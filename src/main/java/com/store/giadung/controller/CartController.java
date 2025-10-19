package com.store.giadung.controller;

import com.store.giadung.entity.CartItem;
import com.store.giadung.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    @Autowired
    private CartService cartService;

    // Lấy toàn bộ sản phẩm trong giỏ
    @GetMapping
    public List<CartItem> getAllItems() {
        return cartService.getAllItems();
    }

    // Thêm sản phẩm vào giỏ
    @PostMapping
    public CartItem addItem(@RequestBody CartItem item) {
        return cartService.addItem(item);
    }

    // Cập nhật số lượng sản phẩm
    @PutMapping("/{id}")
    public CartItem updateItem(@PathVariable Long id, @RequestBody CartItem updatedItem) {
        return cartService.updateItem(id, updatedItem);
    }

    // Xóa 1 sản phẩm khỏi giỏ
    @DeleteMapping("/{id}")
    public void removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
    }

    // Xóa toàn bộ giỏ hàng
    @DeleteMapping
    public void clearCart() {
        cartService.clearCart();
    }
}
