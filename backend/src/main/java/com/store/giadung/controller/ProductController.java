package com.store.giadung.controller;

import com.store.giadung.dto.ProductDTO;
import com.store.giadung.entity.Product;
import com.store.giadung.service.impl.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:5500", "http://localhost:5500"})
public class ProductController {

    @Autowired
    private ProductServiceImpl productService;

    /**
     * ✅ OPTIMIZED PAGINATION với Cache Headers
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        try {
            // Giới hạn size tối đa để tránh quá tải
            if (size > 100) size = 100;
            
            Page<ProductDTO> productPage = productService.getAllProductsPaginated(page, size, sortBy, direction);
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", productPage.getContent());
            response.put("currentPage", productPage.getNumber());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());
            response.put("pageSize", productPage.getSize());
            
            // ✅ THÊM Cache-Control header (cache 5 phút)
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES))
                    .body(response);
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ✅ OPTIMIZED: Lightweight endpoint - chỉ trả id, name, price, image
     */
    @GetMapping("/lite")
    public ResponseEntity<Map<String, Object>> getProductsLite(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        try {
            Page<ProductDTO> productPage = productService.getAllProductsPaginated(page, size, "createdAt", "desc");
            
            // Chỉ trả về các field cần thiết
            List<Map<String, Object>> liteProducts = productPage.getContent().stream()
                .map(p -> {
                    Map<String, Object> lite = new HashMap<>();
                    lite.put("productId", p.getProductId());
                    lite.put("productName", p.getProductName());
                    lite.put("price", p.getPrice());
                    lite.put("imageUrl", p.getImageUrl());
                    lite.put("discount", p.getDiscount());
                    lite.put("stockQuantity", p.getStockQuantity());
                    return lite;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", liteProducts);
            response.put("currentPage", productPage.getNumber());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());
            
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
                    .body(response);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ✅ Get product by ID với cache
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        try {
            ProductDTO product = productService.getProductDTOById(id);
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
                    .body(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * ✅ OPTIMIZED Search với debounce-friendly response
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String keyword) {
        try {
            // Giới hạn 50 kết quả search
            List<ProductDTO> products = productService.searchProducts(keyword)
                    .stream()
                    .limit(50)
                    .toList();
                    
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(2, TimeUnit.MINUTES))
                    .body(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create product
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        try {
            Product saved = productService.saveProduct(product);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update product
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updated = productService.updateProduct(id, product);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete product
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}