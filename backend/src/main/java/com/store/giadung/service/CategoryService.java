package com.store.giadung.service;

import com.store.giadung.entity.Category;
import com.store.giadung.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category updated) {
        Category category = getCategoryById(id);
        if (category != null) {
            category.setCategoryName(updated.getCategoryName());
            category.setDescription(updated.getDescription());
            return categoryRepository.save(category);
        }
        return null;
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
