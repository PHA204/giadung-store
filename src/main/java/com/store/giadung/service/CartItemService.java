package com.store.giadung.service;

import com.store.giadung.entity.CartItem;
import com.store.giadung.entity.User;
import com.store.giadung.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getAllItems() {
        return cartItemRepository.findAll();
    }

    public List<CartItem> getCartItemsByUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItem addItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public void deleteItem(Long id) {
        cartItemRepository.deleteById(id);
    }
}
