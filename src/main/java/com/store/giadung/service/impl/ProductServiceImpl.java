package com.store.giadung.service.impl;

import com.store.giadung.entity.Product;
import com.store.giadung.repository.ProductRepository;
import com.store.giadung.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setProductName(updatedProduct.getProductName());
            existing.setPrice(updatedProduct.getPrice());
            existing.setDescription(updatedProduct.getDescription());
            existing.setImageUrl(updatedProduct.getImageUrl());
            existing.setBrand(updatedProduct.getBrand());
            existing.setCategory(updatedProduct.getCategory());
            return productRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
