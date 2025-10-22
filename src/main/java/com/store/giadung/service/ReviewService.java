package com.store.giadung.service;

import com.store.giadung.entity.Review;
import com.store.giadung.entity.Product;
import com.store.giadung.entity.User;
import com.store.giadung.repository.ReviewRepository;
import com.store.giadung.repository.ProductRepository;
import com.store.giadung.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public List<Review> getReviewsByProductId(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            return reviewRepository.findByProduct(product);
        }
        return List.of();
    }

    public List<Review> getReviewsByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return reviewRepository.findByUser(user);
        }
        return List.of();
    }

    public List<Review> getReviewsByRating(Integer rating) {
        return reviewRepository.findByRating(rating);
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, Review updatedReview) {
        Review existing = reviewRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setRating(updatedReview.getRating());
            existing.setComment(updatedReview.getComment());
            return reviewRepository.save(existing);
        }
        return null;
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}