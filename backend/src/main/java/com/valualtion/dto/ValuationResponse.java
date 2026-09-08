package com.valualtion.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ValuationResponse {

    private UUID id;
    private Double estimatedValue;
    private Double rangeLow;
    private Double rangeHigh;
    private Double confidenceScore;
    private String confidenceLevel;
    private String address;
    private String neighborhood;
    private Double grLivArea;
    private Integer bedrooms;
    private Integer fullBath;
    private Integer yearBuilt;
    private Integer overallQual;
    private Double baselinePrice;
    private Double priceDifference;
    private List<FeatureAttributionDto> attributions = new ArrayList<>();
    private List<ComparableDto> comparables = new ArrayList<>();
    private LocalDateTime createdAt;

    public ValuationResponse() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Double getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(Double estimatedValue) { this.estimatedValue = estimatedValue; }

    public Double getRangeLow() { return rangeLow; }
    public void setRangeLow(Double rangeLow) { this.rangeLow = rangeLow; }

    public Double getRangeHigh() { return rangeHigh; }
    public void setRangeHigh(Double rangeHigh) { this.rangeHigh = rangeHigh; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public Double getGrLivArea() { return grLivArea; }
    public void setGrLivArea(Double grLivArea) { this.grLivArea = grLivArea; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getFullBath() { return fullBath; }
    public void setFullBath(Integer fullBath) { this.fullBath = fullBath; }

    public Integer getYearBuilt() { return yearBuilt; }
    public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }

    public Integer getOverallQual() { return overallQual; }
    public void setOverallQual(Integer overallQual) { this.overallQual = overallQual; }

    public Double getBaselinePrice() { return baselinePrice; }
    public void setBaselinePrice(Double baselinePrice) { this.baselinePrice = baselinePrice; }

    public Double getPriceDifference() { return priceDifference; }
    public void setPriceDifference(Double priceDifference) { this.priceDifference = priceDifference; }

    public List<FeatureAttributionDto> getAttributions() { return attributions; }
    public void setAttributions(List<FeatureAttributionDto> attributions) { this.attributions = attributions; }

    public List<ComparableDto> getComparables() { return comparables; }
    public void setComparables(List<ComparableDto> comparables) { this.comparables = comparables; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
