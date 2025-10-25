package com.store.giadung.repository;

import com.store.giadung.entity.Payment;
import com.store.giadung.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrder(Order order);
}
