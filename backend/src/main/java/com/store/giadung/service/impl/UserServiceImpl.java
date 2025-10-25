package com.store.giadung.service.impl;

import com.store.giadung.entity.User;
import com.store.giadung.repository.UserRepository;
import com.store.giadung.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setFullName(updatedUser.getFullName());
            existing.setEmail(updatedUser.getEmail());
            existing.setPassword(updatedUser.getPassword());
            return userRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
