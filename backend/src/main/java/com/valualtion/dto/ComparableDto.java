package com.valualtion.dto;

public class ComparableDto {

    private String address;
    private Double salePrice;
    private Double similarityScore;
    private Double distanceMiles;
    private Double livingAreaSqft;
    private Integer bedrooms;
    private Integer fullBath;
    private String saleDate;

    public ComparableDto() {}

    public ComparableDto(String address, Double salePrice, Double similarityScore, Double distanceMiles, Double livingAreaSqft, Integer bedrooms, Integer fullBath, String saleDate) {
        this.address = address;
        this.salePrice = salePrice;
        this.similarityScore = similarityScore;
        this.distanceMiles = distanceMiles;
        this.livingAreaSqft = livingAreaSqft;
        this.bedrooms = bedrooms;
        this.fullBath = fullBath;
        this.saleDate = saleDate;
    }

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
