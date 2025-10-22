package com.store.giadung.service;

import com.store.giadung.entity.Order;
import com.store.giadung.entity.User;
import com.store.giadung.repository.OrderRepository;
import com.store.giadung.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return orderRepository.findByUser(user);
        }
        return List.of();
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByCurrentStatus(status);
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTotalAmount(updatedOrder.getTotalAmount());
            existing.setPaymentMethod(updatedOrder.getPaymentMethod());
            existing.setShippingAddress(updatedOrder.getShippingAddress());
            existing.setCurrentStatus(updatedOrder.getCurrentStatus());
            return orderRepository.save(existing);
        }
        return null;
    }

    public Order updateOrderStatus(Long id, String status) {
        Order existing = orderRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setCurrentStatus(status);
            return orderRepository.save(existing);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}