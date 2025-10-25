package com.store.giadung.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDTO {
    private Long productId;
    private String productName;
    private String description;
    private BigDecimal price;
    private BigDecimal discount;
    private Integer stockQuantity;
    private String imageUrl;
    private BigDecimal ratingAvg;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private CategoryDTO category;
    private BrandDTO brand;

    public ProductDTO() {}

    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(BigDecimal ratingAvg) { this.ratingAvg = ratingAvg; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    public BrandDTO getBrand() { return brand; }
    public void setBrand(BrandDTO brand) { this.brand = brand; }

    // Nested DTOs
    public static class CategoryDTO {
        private Long categoryId;
        private String categoryName;

        public CategoryDTO() {}

        public CategoryDTO(Long categoryId, String categoryName) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
        }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    }

    public static class BrandDTO {
        private Long brandId;
        private String brandName;

        public BrandDTO() {}

        public BrandDTO(Long brandId, String brandName) {
            this.brandId = brandId;
            this.brandName = brandName;
        }

        public Long getBrandId() { return brandId; }
        public void setBrandId(Long brandId) { this.brandId = brandId; }

        public String getBrandName() { return brandName; }
        public void setBrandName(String brandName) { this.brandName = brandName; }
    }
}