package com.store.giadung.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Simple In-Memory Cache Configuration
 * Để sử dụng Redis, cần thêm dependency và config khác
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            "products",      // Cache cho products
            "categories",    // Cache cho categories
            "brands"         // Cache cho brands
        );
    }
}

/*
 * Sau khi add config này, update Service:
 * 
 * @Service
 * public class ProductServiceImpl {
 * 
 *     @Cacheable(value = "products", key = "#page + '-' + #size")
 *     public Page<ProductDTO> getAllProductsPaginated(int page, int size, ...) {
 *         // Logic
 *     }
 * 
 *     @CacheEvict(value = "products", allEntries = true)
 *     public Product saveProduct(Product product) {
 *         // Logic - clear cache khi có thay đổi
 *     }
 * }
 */