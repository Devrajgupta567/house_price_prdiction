package com.valualtion.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "comparables")
public class Comparable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "valuation_id", nullable = false)
    private Valuation valuation;

    @Column(nullable = false)
    private String address;

    @Column(name = "sale_price", nullable = false)
    private Double salePrice;

    @Column(name = "similarity_score", nullable = false)
    private Double similarityScore;

    @Column(name = "distance_miles")
    private Double distanceMiles;

    @Column(name = "living_area_sqft")
    private Double livingAreaSqft;

    @Column
    private Integer bedrooms;

    @Column(name = "full_bath")
    private Integer fullBath;

    @Column(name = "sale_date")
    private String saleDate;

    public Comparable() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Valuation getValuation() { return valuation; }
    public void setValuation(Valuation valuation) { this.valuation = valuation; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getSalePrice() { return salePrice; }
    public void setSalePrice(Double salePrice) { this.salePrice = salePrice; }

    public Double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }

    public Double getDistanceMiles() { return distanceMiles; }
    public void setDistanceMiles(Double distanceMiles) { this.distanceMiles = distanceMiles; }

    public Double getLivingAreaSqft() { return livingAreaSqft; }
    public void setLivingAreaSqft(Double livingAreaSqft) { this.livingAreaSqft = livingAreaSqft; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getFullBath() { return fullBath; }
    public void setFullBath(Integer fullBath) { this.fullBath = fullBath; }

    public String getSaleDate() { return saleDate; }
    public void setSaleDate(String saleDate) { this.saleDate = saleDate; }
}
