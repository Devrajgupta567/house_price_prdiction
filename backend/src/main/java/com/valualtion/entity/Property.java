package com.valualtion.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String neighborhood;

    @Column(name = "living_area_sqft", nullable = false)
    private Double livingAreaSqft;

    @Column(nullable = false)
    private Integer bedrooms;

    @Column(name = "full_bath", nullable = false)
    private Integer fullBath;

    @Column(name = "half_bath")
    private Integer halfBath = 0;

    @Column(name = "year_built")
    private Integer yearBuilt;

    @Column(name = "overall_qual")
    private Integer overallQual;

    @Column(name = "overall_cond")
    private Integer overallCond;

    @Column(name = "lot_area")
    private Double lotArea;

    @Column(name = "garage_cars")
    private Integer garageCars = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Property() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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
