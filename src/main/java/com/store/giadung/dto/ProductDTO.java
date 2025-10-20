package com.store.giadung.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long productId;
    private String productName;
    private String description;
    private BigDecimal price;
    private BigDecimal discount;
    private Integer stockQuantity;
    private String imageUrl;
    private BigDecimal ratingAvg;
    private String categoryName;
    private String brandName;
}