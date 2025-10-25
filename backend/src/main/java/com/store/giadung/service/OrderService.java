package com.store.giadung.service;

import com.store.giadung.entity.Order;
import com.store.giadung.entity.OrderDetail;
import com.store.giadung.entity.User;
import com.store.giadung.entity.Product;
import com.store.giadung.repository.OrderRepository;
import com.store.giadung.repository.UserRepository;
import com.store.giadung.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return orderRepository.findByUserOrderByCreatedAtDesc(user);
        }
        return List.of();
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByCurrentStatus(status);
    }

    @Transactional
    public Order saveOrder(Order order) {
        // Validate user
        if (order.getUser() != null && order.getUser().getUserId() != null) {
            User user = userRepository.findById(order.getUser().getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            order.setUser(user);
        }

        // Process order details
        if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
            BigDecimal totalAmount = BigDecimal.ZERO;
            
            for (OrderDetail detail : order.getOrderDetails()) {
                // Set order reference
                detail.setOrder(order);
                
                // Validate and get product
                if (detail.getProduct() != null && detail.getProduct().getProductId() != null) {
                    Product product = productRepository.findById(detail.getProduct().getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found: " + detail.getProduct().getProductId()));
                    
                    detail.setProduct(product);
                    
                    // Set unit price if not set
                    if (detail.getUnitPrice() == null) {
                        detail.setUnitPrice(product.getPrice());
                    }
                    
                    // Update stock quantity
                    int newStock = product.getStockQuantity() - detail.getQuantity();
                    if (newStock < 0) {
                        throw new RuntimeException("Not enough stock for product: " + product.getProductName());
                    }
                    product.setStockQuantity(newStock);
                    productRepository.save(product);
                    
                    // Calculate total
                    totalAmount = totalAmount.add(detail.getSubtotal());
                }
            }
            
            order.setTotalAmount(totalAmount);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Update basic fields
        if (updatedOrder.getPaymentMethod() != null) {
            existing.setPaymentMethod(updatedOrder.getPaymentMethod());
        }
        if (updatedOrder.getShippingAddress() != null) {
            existing.setShippingAddress(updatedOrder.getShippingAddress());
        }
        if (updatedOrder.getCurrentStatus() != null) {
            existing.setCurrentStatus(updatedOrder.getCurrentStatus());
        }

        return orderRepository.save(existing);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        existing.setCurrentStatus(status);
        return orderRepository.save(existing);
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Restore stock quantities
        if (order.getOrderDetails() != null) {
            for (OrderDetail detail : order.getOrderDetails()) {
                Product product = detail.getProduct();
                product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
                productRepository.save(product);
            }
        }
        
        orderRepository.deleteById(id);
    }
    // public Page<Order> getAllOrdersPaginated(Pageable pageable) {
    // return orderRepository.findAll(pageable);
    //}
}