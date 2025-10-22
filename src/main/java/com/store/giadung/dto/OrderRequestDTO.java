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

/**
 * DTO cho Order Response
 */
@Data
public class OrderResponseDTO {
    private Long orderId;
    private String userName;
    private String userEmail;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String shippingAddress;
    private String currentStatus;
    private String createdAt;
    private List<OrderDetailDTO> orderDetails;

    @Data
    public static class OrderDetailDTO {
        private Long productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}