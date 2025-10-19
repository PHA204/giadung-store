package com.store.giadung.repository;

import com.store.giadung.entity.Product;
import com.store.giadung.entity.Category;
import com.store.giadung.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findByBrand(Brand brand);
    List<Product> findByProductNameContainingIgnoreCase(String keyword);
}
