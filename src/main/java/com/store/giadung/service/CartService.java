package com.store.giadung.service;

import com.store.giadung.entity.CartItem;
import java.util.List;

public interface CartService {
    List<CartItem> getAllItems();
    CartItem addItem(CartItem item);
    CartItem updateItem(Long id, CartItem updatedItem);
    void removeItem(Long id);
    void clearCart();
}
