package com.valualtion.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "valuations")
public class Valuation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "estimated_value", nullable = false)
    private Double estimatedValue;

    @Column(name = "range_low", nullable = false)
    private Double rangeLow;

    @Column(name = "range_high", nullable = false)
    private Double rangeHigh;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "confidence_level", nullable = false)
    private String confidenceLevel = "MODERATE";

    @Column(name = "input_snapshot_json", columnDefinition = "TEXT")
    private String inputSnapshotJson;

    @Column(name = "attribution_snapshot_json", columnDefinition = "TEXT")
    private String attributionSnapshotJson;

    @OneToMany(mappedBy = "valuation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comparable> comparables = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Valuation() {}

    // Helper method
    public void addComparable(Comparable comp) {
        comparables.add(comp);
        comp.setValuation(this);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public String getInputSnapshotJson() { return inputSnapshotJson; }
    public void setInputSnapshotJson(String inputSnapshotJson) { this.inputSnapshotJson = inputSnapshotJson; }

    public String getAttributionSnapshotJson() { return attributionSnapshotJson; }
    public void setAttributionSnapshotJson(String attributionSnapshotJson) { this.attributionSnapshotJson = attributionSnapshotJson; }

    public List<Comparable> getComparables() { return comparables; }
    public void setComparables(List<Comparable> comparables) { this.comparables = comparables; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
