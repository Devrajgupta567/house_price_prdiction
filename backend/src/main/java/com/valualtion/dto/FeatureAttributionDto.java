package com.valualtion.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FeatureAttributionDto {

    @JsonProperty("feature_name")
    private String featureName;

    private String category;

    private Double amount;

    @JsonProperty("formatted_amount")
    private String formattedAmount;

    private Double percentage;

    private String impact; // "POSITIVE" or "NEGATIVE"

    @JsonProperty("detail_description")
    private String detailDescription;

    public FeatureAttributionDto() {}

    public FeatureAttributionDto(
            String featureName,
            String category,
            Double amount,
            String formattedAmount,
            Double percentage,
            String impact,
            String detailDescription
    ) {
        this.featureName = featureName;
        this.category = category;
        this.amount = amount;
        this.formattedAmount = formattedAmount;
        this.percentage = percentage;
        this.impact = impact;
        this.detailDescription = detailDescription;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getFormattedAmount() {
        return formattedAmount;
    }

    public void setFormattedAmount(String formattedAmount) {
        this.formattedAmount = formattedAmount;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public String getImpact() {
        return impact;
    }

    public void setImpact(String impact) {
        this.impact = impact;
    }

    public String getDetailDescription() {
        return detailDescription;
    }

    public void setDetailDescription(String detailDescription) {
        this.detailDescription = detailDescription;
    }
}
