package com.store.giadung.controller;

import com.store.giadung.entity.User;
import com.store.giadung.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:8000"})
public class UserController {

    @Autowired
    private UserService userService;

    // Lấy danh sách người dùng
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Đăng ký người dùng mới
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Đăng nhập
    @PostMapping("/login")
    public User login(@RequestBody User loginData) {
        User existing = userService.findByEmail(loginData.getEmail());
        if (existing != null && existing.getPassword().equals(loginData.getPassword())) {
            return existing;
        }
        return null; // Trả null nếu sai tài khoản
    }

    // Cập nhật người dùng
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    // Xóa người dùng
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
