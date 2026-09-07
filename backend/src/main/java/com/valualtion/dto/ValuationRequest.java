package com.valualtion.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ValuationRequest {

    private UUID propertyId;

    private String address = "1234 Ames Way";

    private String neighborhood = "Northridge Heights";

    @NotNull(message = "Living area is required")
    @Min(value = 100, message = "Living area must be at least 100 sq ft")
    @JsonProperty("gr_liv_area")
    private Double grLivArea;

    @JsonProperty("lot_area")
    private Double lotArea = 8500.0;

    @NotNull(message = "Bedrooms count is required")
    @Min(0) @Max(15)
    private Integer bedrooms = 3;

    @NotNull(message = "Full bath count is required")
    @Min(0) @Max(8)
    @JsonProperty("full_bath")
    private Integer fullBath = 2;

    @JsonProperty("half_bath")
    private Integer halfBath = 0;

    @Min(1800) @Max(2026)
    @JsonProperty("year_built")
    private Integer yearBuilt = 2005;

    @Min(1) @Max(10)
    @JsonProperty("overall_qual")
    private Integer overallQual = 7;

    @Min(1) @Max(10)
    @JsonProperty("overall_cond")
    private Integer overallCond = 5;

    @JsonProperty("garage_cars")
    private Integer garageCars = 2;

    /** Basement total finished area in sq ft */
    @Min(0)
    @JsonProperty("total_bsmt_sf")
    private Double totalBsmtSf = 0.0;

    /** Whether the property has central air conditioning */
    @JsonProperty("central_air")
    private Boolean centralAir = false;

    /** Year the property was remodelled (defaults to year_built if null) */
    @Min(1800) @Max(2026)
    @JsonProperty("year_remod")
    private Integer yearRemod;

    /** Number of fireplaces */
    @Min(0) @Max(5)
    private Integer fireplaces = 0;

    public ValuationRequest() {}

    // Getters and Setters
    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public Double getGrLivArea() { return grLivArea; }
    public void setGrLivArea(Double grLivArea) { this.grLivArea = grLivArea; }

    public Double getLotArea() { return lotArea; }
    public void setLotArea(Double lotArea) { this.lotArea = lotArea; }

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

    public Integer getGarageCars() { return garageCars; }
    public void setGarageCars(Integer garageCars) { this.garageCars = garageCars; }

    public Double getTotalBsmtSf() { return totalBsmtSf; }
    public void setTotalBsmtSf(Double totalBsmtSf) { this.totalBsmtSf = totalBsmtSf; }

    public Boolean getCentralAir() { return centralAir; }
    public void setCentralAir(Boolean centralAir) { this.centralAir = centralAir; }

    public Integer getYearRemod() { return yearRemod; }
    public void setYearRemod(Integer yearRemod) { this.yearRemod = yearRemod; }

    public Integer getFireplaces() { return fireplaces; }
    public void setFireplaces(Integer fireplaces) { this.fireplaces = fireplaces; }
}
