package com.store.giadung.controller;

import com.store.giadung.entity.CartItem;
import com.store.giadung.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:5500", "http://localhost:5500"})
public class CartController {

    @Autowired
    private CartService cartService;

    // Lấy tất cả items trong giỏ hàng
    @GetMapping
    public ResponseEntity<List<CartItem>> getAllCartItems() {
        return ResponseEntity.ok(cartService.getAllItems());
    }

    // Lấy giỏ hàng theo user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItem>> getCartByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    // Lấy cart item theo ID
    @GetMapping("/{id}")
    public ResponseEntity<CartItem> getCartItemById(@PathVariable Long id) {
        CartItem item = cartService.getCartItemById(id);
        if (item != null) {
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }

    // Thêm sản phẩm vào giỏ
    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cartItem) {
        return ResponseEntity.ok(cartService.addItem(cartItem));
    }

    // Cập nhật số lượng
    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long id, @RequestBody CartItem updatedItem) {
        CartItem item = cartService.updateItem(id, updatedItem);
        if (item != null) {
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa một item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return ResponseEntity.ok().build();
    }

    // Xóa toàn bộ giỏ hàng của user
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearUserCart(@PathVariable Long userId) {
        cartService.clearUserCart(userId);
        return ResponseEntity.ok().build();
    }

    // Xóa tất cả giỏ hàng (admin)
    @DeleteMapping
    public ResponseEntity<Void> clearAllCarts() {
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }
}