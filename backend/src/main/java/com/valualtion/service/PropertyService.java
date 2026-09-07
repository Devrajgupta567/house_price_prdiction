package com.valualtion.service;

import com.valualtion.dto.PropertyDto;
import com.valualtion.entity.Property;
import com.valualtion.entity.User;
import com.valualtion.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final AuthService authService;

    public PropertyService(PropertyRepository propertyRepository, AuthService authService) {
        this.propertyRepository = propertyRepository;
        this.authService = authService;
    }

    public List<PropertyDto> getUserProperties() {
        User user = authService.getCurrentUserEntity();
        if (user == null) {
            throw new IllegalStateException("Authentication required to access saved properties");
        }

        return propertyRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyDto createProperty(PropertyDto dto) {
        User user = authService.getCurrentUserEntity();
        if (user == null) {
            throw new IllegalStateException("Authentication required to save properties");
        }

        Property property = new Property();
        property.setUser(user);
        property.setAddress(dto.getAddress());
        property.setNeighborhood(dto.getNeighborhood());
        property.setLivingAreaSqft(dto.getLivingAreaSqft());
        property.setBedrooms(dto.getBedrooms());
        property.setFullBath(dto.getFullBath());
        property.setHalfBath(dto.getHalfBath() != null ? dto.getHalfBath() : 0);
        property.setYearBuilt(dto.getYearBuilt());
        property.setOverallQual(dto.getOverallQual());
        property.setOverallCond(dto.getOverallCond());
        property.setLotArea(dto.getLotArea());
        property.setGarageCars(dto.getGarageCars() != null ? dto.getGarageCars() : 0);

        Property saved = propertyRepository.save(property);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteProperty(UUID propertyId) {
        User user = authService.getCurrentUserEntity();
        if (user == null) {
            throw new IllegalStateException("Authentication required");
        }

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with ID: " + propertyId));

        if (!property.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete property belonging to another user");
        }

        propertyRepository.delete(property);
    }

    public PropertyDto mapToDto(Property p) {
        PropertyDto dto = new PropertyDto();
        dto.setId(p.getId());
        dto.setAddress(p.getAddress());
        dto.setNeighborhood(p.getNeighborhood());
        dto.setLivingAreaSqft(p.getLivingAreaSqft());
        dto.setBedrooms(p.getBedrooms());
        dto.setFullBath(p.getFullBath());
        dto.setHalfBath(p.getHalfBath());
        dto.setYearBuilt(p.getYearBuilt());
        dto.setOverallQual(p.getOverallQual());
        dto.setOverallCond(p.getOverallCond());
        dto.setLotArea(p.getLotArea());
        dto.setGarageCars(p.getGarageCars());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }
}
