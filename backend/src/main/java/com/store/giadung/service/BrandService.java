package com.store.giadung.service;

import com.store.giadung.entity.Brand;
import com.store.giadung.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id).orElse(null);
    }

    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Long id, Brand updatedBrand) {
        Brand brand = getBrandById(id);
        if (brand != null) {
            brand.setBrandName(updatedBrand.getBrandName());
            brand.setDescription(updatedBrand.getDescription());
            return brandRepository.save(brand);
        }
        return null;
    }

    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
}
