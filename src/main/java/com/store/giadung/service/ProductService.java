package com.store.giadung.service;

import com.store.giadung.entity.Product;
import org.springframework.data.domain.Page;
import com.store.giadung.dto.ProductDTO;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product saveProduct(Product product);
    Product updateProduct(Long id, Product updatedProduct);
    void deleteProduct(Long id);
    
    // New methods
    Page<ProductDTO> getAllProductsPaginated(int page, int size, String sortBy, String direction);
    ProductDTO getProductDTOById(Long id);
    List<ProductDTO> searchProducts(String keyword);
}