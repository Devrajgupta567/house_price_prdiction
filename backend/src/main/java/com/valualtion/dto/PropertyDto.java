package com.valualtion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public class PropertyDto {

    private UUID id;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Neighborhood is required")
    private String neighborhood;

    @NotNull(message = "Living area is required")
    private Double livingAreaSqft;

    @NotNull(message = "Bedrooms count is required")
    private Integer bedrooms;

    @NotNull(message = "Full bathrooms count is required")
    private Integer fullBath;

    private Integer halfBath = 0;
    private Integer yearBuilt;
    private Integer overallQual;
    private Integer overallCond;
    private Double lotArea;
    private Integer garageCars = 0;
    private LocalDateTime createdAt;

    public PropertyDto() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public Double getLivingAreaSqft() { return livingAreaSqft; }
    public void setLivingAreaSqft(Double livingAreaSqft) { this.livingAreaSqft = livingAreaSqft; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getFullBath() { return fullBath; }
    public void setFullBath(Integer fullBath) { this.fullBath = fullBath; }

    public Integer getHalfBath() { return halfBath; }
    public void setHalfBath(Integer halfBath) { this.halfBath = halfBath; }

    public Integer getYearBuilt() { return yearBuilt; }
    public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }

    public Integer getOverallQual() { return overallQual; }
    public void setOverallQual(Integer overallQual) { this.overallQual = overallQual; }

    public Integer getOverallCond() { return overallCond; }
    public void setOverallCond(Integer overallCond) { this.overallCond = overallCond; }

    public Double getLotArea() { return lotArea; }
    public void setLotArea(Double lotArea) { this.lotArea = lotArea; }

    public Integer getGarageCars() { return garageCars; }
    public void setGarageCars(Integer garageCars) { this.garageCars = garageCars; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
