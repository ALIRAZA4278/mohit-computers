'use client';

import React from 'react';
import { Star } from 'lucide-react';

const ProductRating = ({ rating = 5, reviewCount = 0, showReviewCount = true }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      {showReviewCount && (
        <span className="text-gray-600 text-sm">
          {reviewCount > 0 ? `(${reviewCount} reviews)` : '(No reviews yet)'}
        </span>
      )}
    </div>
  );
};

export default ProductRating;