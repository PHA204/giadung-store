// giadung-admin/src/main/java/com/store/giadung/dto/OrderResponseDTO.java
package com.store.giadung.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long orderId;
    private UserSimpleDTO user;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String shippingAddress;
    private String currentStatus;
    private LocalDateTime createdAt;
    private List<OrderDetailDTO> orderDetails;

    @Data
    public static class UserSimpleDTO {
        private Long userId;
        private String fullName;
        private String email;
        private String phoneNumber;
    }

    @Data
    public static class OrderDetailDTO {
        private Long id;
        private ProductSimpleDTO product;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    @Data
    public static class ProductSimpleDTO {
        private Long productId;
        private String productName;
        private String imageUrl;
        private BigDecimal price;
    }
}