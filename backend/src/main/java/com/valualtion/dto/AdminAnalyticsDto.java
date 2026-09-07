package com.valualtion.dto;

import java.util.List;
import java.util.Map;

/**
 * Platform-wide analytics summary for the Admin Dashboard.
 */
public class AdminAnalyticsDto {

    private long totalUsers;
    private long verifiedUsers;
    private long totalValuations;
    private Double totalPortfolioVolume;
    private Double averageValuationPrice;
    private Double averagePricePerSqft;

    // Neighborhood breakdown: { "NoRidge": 14, "CollgCr": 9, ... }
    private Map<String, Long> valuationsByNeighborhood;

    // Monthly trend: list of { month: "Aug 2026", count: 23 }
    private List<Map<String, Object>> monthlyTrend;

    public AdminAnalyticsDto() {}

    // ── Getters & Setters ────────────────────────────────────────────────────
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getVerifiedUsers() { return verifiedUsers; }
    public void setVerifiedUsers(long verifiedUsers) { this.verifiedUsers = verifiedUsers; }

    public long getTotalValuations() { return totalValuations; }
    public void setTotalValuations(long totalValuations) { this.totalValuations = totalValuations; }

    public Double getTotalPortfolioVolume() { return totalPortfolioVolume; }
    public void setTotalPortfolioVolume(Double totalPortfolioVolume) { this.totalPortfolioVolume = totalPortfolioVolume; }

    public Double getAverageValuationPrice() { return averageValuationPrice; }
    public void setAverageValuationPrice(Double averageValuationPrice) { this.averageValuationPrice = averageValuationPrice; }

    public Double getAveragePricePerSqft() { return averagePricePerSqft; }
    public void setAveragePricePerSqft(Double averagePricePerSqft) { this.averagePricePerSqft = averagePricePerSqft; }

    public Map<String, Long> getValuationsByNeighborhood() { return valuationsByNeighborhood; }
    public void setValuationsByNeighborhood(Map<String, Long> valuationsByNeighborhood) { this.valuationsByNeighborhood = valuationsByNeighborhood; }

    public List<Map<String, Object>> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(List<Map<String, Object>> monthlyTrend) { this.monthlyTrend = monthlyTrend; }
}
