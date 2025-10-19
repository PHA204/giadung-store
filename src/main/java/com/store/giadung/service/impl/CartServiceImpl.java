package com.store.giadung.service.impl;

import com.store.giadung.entity.CartItem;
import com.store.giadung.repository.CartItemRepository;
import com.store.giadung.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository CartItemRepository;

    @Override
    public List<CartItem> getAllItems() {
        return CartItemRepository.findAll();
    }

    @Override
    public CartItem addItem(CartItem item) {
        return CartItemRepository.save(item);
    }

    @Override
    public CartItem updateItem(Long id, CartItem updatedItem) {
        CartItem existing = CartItemRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setQuantity(updatedItem.getQuantity());
            existing.setProduct(updatedItem.getProduct());
            existing.setUser(updatedItem.getUser());
            return CartItemRepository.save(existing);
        }
        return null;
    }

    @Override
    public void removeItem(Long id) {
        CartItemRepository.deleteById(id);
    }

    @Override
    public void clearCart() {
        CartItemRepository.deleteAll();
    }
}
