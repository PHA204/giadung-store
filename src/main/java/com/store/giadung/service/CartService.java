package com.store.giadung.service;

import com.store.giadung.entity.CartItem;
import java.util.List;

public interface CartService {
    List<CartItem> getAllItems();
    List<CartItem> getCartByUserId(Long userId);
    CartItem getCartItemById(Long id);
    CartItem addItem(CartItem item);
    CartItem updateItem(Long id, CartItem updatedItem);
    void removeItem(Long id);
    void clearUserCart(Long userId);
    void clearCart();
}