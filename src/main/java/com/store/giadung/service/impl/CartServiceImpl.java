package com.store.giadung.service.impl;

import com.store.giadung.entity.CartItem;
import com.store.giadung.entity.User;
import com.store.giadung.repository.CartItemRepository;
import com.store.giadung.repository.UserRepository;
import com.store.giadung.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<CartItem> getAllItems() {
        return cartItemRepository.findAll();
    }

    @Override
    public List<CartItem> getCartByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return cartItemRepository.findByUser(user);
        }
        return List.of();
    }

    @Override
    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id).orElse(null);
    }

    @Override
    public CartItem addItem(CartItem item) {
        return cartItemRepository.save(item);
    }

    @Override
    public CartItem updateItem(Long id, CartItem updatedItem) {
        CartItem existing = cartItemRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setQuantity(updatedItem.getQuantity());
            if (updatedItem.getProduct() != null) {
                existing.setProduct(updatedItem.getProduct());
            }
            return cartItemRepository.save(existing);
        }
        return null;
    }

    @Override
    public void removeItem(Long id) {
        cartItemRepository.deleteById(id);
    }

    @Override
    public void clearUserCart(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            List<CartItem> items = cartItemRepository.findByUser(user);
            cartItemRepository.deleteAll(items);
        }
    }

    @Override
    public void clearCart() {
        cartItemRepository.deleteAll();
    }
}