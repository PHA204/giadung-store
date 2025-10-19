package com.store.giadung.service;

import com.store.giadung.entity.Product;
import com.store.giadung.entity.Brand;
import com.store.giadung.entity.Category;
import com.store.giadung.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated) {
        Product product = getProductById(id);
        if (product != null) {
            product.setProductName(updated.getProductName());
            product.setDescription(updated.getDescription());
            product.setPrice(updated.getPrice());
            product.setCategory(updated.getCategory());
            product.setBrand(updated.getBrand());
            return productRepository.save(product);
        }
        return null;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> searchByKeyword(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword);
    }

    public List<Product> getByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getByBrand(Brand brand) {
        return productRepository.findByBrand(brand);
    }
}
