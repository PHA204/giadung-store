package com.store.giadung.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private Long cartItemId;
    private String userName;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
}