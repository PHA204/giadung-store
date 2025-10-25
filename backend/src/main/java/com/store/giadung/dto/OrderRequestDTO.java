package com.store.giadung.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO cho Order Request
 */
@Data
public class OrderRequestDTO {
    private Long userId;
    private String paymentMethod;
    private String shippingAddress;
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}

