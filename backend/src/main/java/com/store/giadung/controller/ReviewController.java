package com.store.giadung.controller;

import com.store.giadung.entity.Review;
import com.store.giadung.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:5500", "http://localhost:5500"})
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        if (review != null) {
            return ResponseEntity.ok(review);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Review>> getReviewsByRating(@PathVariable Integer rating) {
        return ResponseEntity.ok(reviewService.getReviewsByRating(rating));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        try {
            Review savedReview = reviewService.saveReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
        Review updated = reviewService.updateReview(id, review);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
}