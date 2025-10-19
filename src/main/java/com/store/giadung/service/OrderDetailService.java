package com.store.giadung.service;

import com.store.giadung.entity.Order;
import com.store.giadung.entity.OrderDetail;
import com.store.giadung.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    public List<OrderDetail> getDetailsByOrder(Order order) {
        return orderDetailRepository.findByOrder(order);
    }

    public OrderDetail saveOrderDetail(OrderDetail detail) {
        return orderDetailRepository.save(detail);
    }

    public void deleteOrderDetail(Long id) {
        orderDetailRepository.deleteById(id);
    }
}
