package com.store.giadung.service;

import com.store.giadung.entity.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User saveUser(User user);
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
    User findByEmail(String email);
}
