package com.valualtion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valualtion.dto.AdminAnalyticsDto;
import com.valualtion.dto.AdminUserDto;
import com.valualtion.dto.ComparableDto;
import com.valualtion.dto.ValuationResponse;
import com.valualtion.entity.User;
import com.valualtion.entity.Valuation;
import com.valualtion.repository.UserRepository;
import com.valualtion.repository.ValuationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ValuationRepository valuationRepository;
    private final ObjectMapper objectMapper;

    public AdminService(UserRepository userRepository,
                        ValuationRepository valuationRepository,
                        ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.valuationRepository = valuationRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Returns all users with their valuation aggregates.
     */
    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Valuation> allValuations = valuationRepository.findAll();

        // Group valuations by user id
        Map<UUID, List<Valuation>> byUser = allValuations.stream()
                .filter(v -> v.getUser() != null)
                .collect(Collectors.groupingBy(v -> v.getUser().getId()));

        return users.stream().map(u -> {
            List<Valuation> userVals = byUser.getOrDefault(u.getId(), Collections.emptyList());
            double total = userVals.stream().mapToDouble(v -> v.getEstimatedValue() != null ? v.getEstimatedValue() : 0.0).sum();
            double avg = userVals.isEmpty() ? 0.0 : total / userVals.size();
            var lastDate = userVals.stream()
                    .filter(v -> v.getCreatedAt() != null)
                    .max(Comparator.comparing(Valuation::getCreatedAt))
                    .map(Valuation::getCreatedAt).orElse(null);
            return AdminUserDto.fromEntity(u, userVals.size(), total, avg, lastDate);
        }).collect(Collectors.toList());
    }

    /**
     * Returns full details for one user including valuation history.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getUserDetails(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        List<Valuation> valuations = valuationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        double total = valuations.stream().mapToDouble(v -> v.getEstimatedValue() != null ? v.getEstimatedValue() : 0).sum();
        double avg = valuations.isEmpty() ? 0 : total / valuations.size();
        var lastDate = valuations.stream().filter(v -> v.getCreatedAt() != null)
                .max(Comparator.comparing(Valuation::getCreatedAt))
                .map(Valuation::getCreatedAt).orElse(null);

        AdminUserDto userDto = AdminUserDto.fromEntity(user, valuations.size(), total, avg, lastDate);

        List<ValuationResponse> valuationDtos = valuations.stream()
                .map(v -> mapValuationToResponse(v))
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("user", userDto);
        result.put("valuations", valuationDtos);
        return result;
    }

    /**
     * Returns all system-wide valuations with owner info attached.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllValuations() {
        List<Valuation> all = valuationRepository.findAll();
        // Most recent first
        all.sort(Comparator.comparing(Valuation::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));

        return all.stream().map(v -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("valuation", mapValuationToResponse(v));
            if (v.getUser() != null) {
                Map<String, Object> owner = new LinkedHashMap<>();
                owner.put("id", v.getUser().getId());
                owner.put("email", v.getUser().getEmail());
                owner.put("fullName", v.getUser().getFullName());
                owner.put("profilePictureUrl", v.getUser().getProfilePictureUrl());
                entry.put("owner", owner);
            }
            return entry;
        }).collect(Collectors.toList());
    }

    /**
     * Returns platform-wide analytics.
     */
    @Transactional(readOnly = true)
    public AdminAnalyticsDto getAnalytics() {
        List<User> users = userRepository.findAll();
        List<Valuation> valuations = valuationRepository.findAll();

        AdminAnalyticsDto dto = new AdminAnalyticsDto();
        dto.setTotalUsers(users.size());
        dto.setVerifiedUsers(users.stream().filter(User::isVerified).count());
        dto.setTotalValuations(valuations.size());

        double totalVolume = valuations.stream().mapToDouble(v -> v.getEstimatedValue() != null ? v.getEstimatedValue() : 0).sum();
        dto.setTotalPortfolioVolume(totalVolume);
        dto.setAverageValuationPrice(valuations.isEmpty() ? 0.0 : totalVolume / valuations.size());
        dto.setAveragePricePerSqft(125.0); // representative Ames market figure

        // Neighborhood breakdown from input snapshot JSON
        Map<String, Long> neighborhoodBreakdown = new LinkedHashMap<>();
        for (Valuation v : valuations) {
            try {
                if (v.getInputSnapshotJson() != null && !v.getInputSnapshotJson().isBlank()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> snap = objectMapper.readValue(v.getInputSnapshotJson(), Map.class);
                    String nb = (String) snap.get("neighborhood");
                    if (nb != null) {
                        neighborhoodBreakdown.merge(nb, 1L, Long::sum);
                    }
                }
            } catch (Exception ignored) {}
        }
        // Sort by count descending, keep top 10
        Map<String, Long> sorted = neighborhoodBreakdown.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
        dto.setValuationsByNeighborhood(sorted);

        // Monthly trend (last 6 months)
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, Long> monthCount = new LinkedHashMap<>();
        valuations.stream()
                .filter(v -> v.getCreatedAt() != null)
                .forEach(v -> monthCount.merge(v.getCreatedAt().format(fmt), 1L, Long::sum));
        List<Map<String, Object>> trend = monthCount.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("month", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                }).collect(Collectors.toList());
        dto.setMonthlyTrend(trend);

        return dto;
    }

    private ValuationResponse mapValuationToResponse(Valuation v) {
        ValuationResponse res = new ValuationResponse();
        res.setId(v.getId());
        res.setEstimatedValue(v.getEstimatedValue());
        res.setRangeLow(v.getRangeLow());
        res.setRangeHigh(v.getRangeHigh());
        res.setConfidenceScore(v.getConfidenceScore());
        res.setConfidenceLevel(v.getConfidenceLevel());
        res.setCreatedAt(v.getCreatedAt());

        // Parse input snapshot for property fields
        try {
            if (v.getInputSnapshotJson() != null && !v.getInputSnapshotJson().isBlank()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> snap = objectMapper.readValue(v.getInputSnapshotJson(), Map.class);
                res.setAddress((String) snap.get("address"));
                res.setNeighborhood((String) snap.get("neighborhood"));
                Object area = snap.get("gr_liv_area");
                if (area instanceof Number) res.setGrLivArea(((Number) area).doubleValue());
                Object beds = snap.get("bedrooms");
                if (beds instanceof Number) res.setBedrooms(((Number) beds).intValue());
                Object bath = snap.get("full_bath");
                if (bath instanceof Number) res.setFullBath(((Number) bath).intValue());
                Object yr = snap.get("year_built");
                if (yr instanceof Number) res.setYearBuilt(((Number) yr).intValue());
                Object qual = snap.get("overall_qual");
                if (qual instanceof Number) res.setOverallQual(((Number) qual).intValue());
            }
        } catch (Exception ignored) {}

        res.setComparables(v.getComparables() == null ? Collections.emptyList() :
                v.getComparables().stream().map(c -> new ComparableDto(
                        c.getAddress(), c.getSalePrice(), c.getSimilarityScore(),
                        c.getDistanceMiles(), c.getLivingAreaSqft(),
                        c.getBedrooms(), c.getFullBath(), c.getSaleDate()
                )).collect(Collectors.toList()));
        return res;
    }
}
