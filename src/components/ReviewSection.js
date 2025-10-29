'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  User,
  Calendar,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Send,
  Image as ImageIcon,
  Filter,
  Trash2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReviewSection({ productId }) {
  // State management
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [eligibleOrders, setEligibleOrders] = useState([]);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Review form state
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);

  // Filters
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Auth
  const { user, isAuthenticated } = useAuth();
  const [userAuth, setUserAuth] = useState(null);

  const checkAuthentication = useCallback(() => {
    try {
      if (isAuthenticated && user) {
        console.log('Auth from context:', user);
        setUserAuth(user);
        return;
      }

      const storedUser = localStorage.getItem('user');
      const authToken = localStorage.getItem('token');
      
      if (storedUser && authToken) {
        const userData = JSON.parse(storedUser);
        console.log('Auth from localStorage:', userData);
        setUserAuth(userData);
      } else {
        console.log('No authentication found');
        setUserAuth(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUserAuth(null);
    }
  }, [isAuthenticated, user]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        product_id: productId,
        page: currentPage.toString(),
        limit: '10',
        sort: sortBy
      });

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews || []);
        setReviewStats(data.stats || {});
      } else {
        console.error('Error fetching reviews:', data.error);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, currentPage, sortBy]);

  const checkReviewEligibility = useCallback(async () => {
    if (!userAuth?.id) return;

    try {
      setCheckingEligibility(true);
      const response = await fetch(`/api/reviews/check-eligibility?user_id=${userAuth.id}&product_id=${productId}`);
      const data = await response.json();

      if (response.ok) {
        setCanReview(data.canReview);
        setEligibleOrders(data.eligibleOrders || []);
        if (data.eligibleOrders?.length > 0) {
          setSelectedOrderId(data.eligibleOrders[0].id);
        }
      } else {
        setCanReview(false);
        setEligibleOrders([]);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    } finally {
      setCheckingEligibility(false);
    }
  }, [userAuth, productId]);

  // Check authentication
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Fetch reviews and check eligibility
  useEffect(() => {
    if (productId) {
      fetchReviews();
      if (userAuth) {
        checkReviewEligibility();
      }
    }
  }, [productId, userAuth, sortBy, filterRating, currentPage, fetchReviews, checkReviewEligibility]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!userAuth) {
      alert('Please login to post a review');
      return;
    }

    if (!selectedOrderId || !rating) {
      alert('Please select an order and provide a rating');
      return;
    }

    if (comment && (comment.length < 10 || comment.length > 2000)) {
      alert('Comment must be between 10 and 2000 characters');
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        product_id: productId,
        user_id: userAuth.id,
        user_name: userAuth.name || userAuth.email?.split('@')[0] || 'Anonymous User',
        user_email: userAuth.email || '',
        order_id: selectedOrderId,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
        images: images
      };

      console.log('Submitting review with data:', reviewData);
      console.log('Current userAuth:', userAuth);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        setImages([]);
        setShowReviewForm(false);
        
        // Refresh reviews and eligibility
        fetchReviews();
        checkReviewEligibility();
        
        alert('Review posted successfully!');
      } else {
        alert(data.error || 'Failed to post review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to post review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!userAuth) {
      alert('Please login to delete review');
      return;
    }

    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/user-delete?review_id=${reviewId}&user_id=${userAuth.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Review deleted successfully!');
        // Refresh reviews and eligibility
        fetchReviews();
        checkReviewEligibility();
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  // Helper function to check if current user owns the review
  const isUserReview = (review) => {
    if (!userAuth || !review) return false;
    
    console.log('Checking review ownership:', {
      reviewUserId: review.user_id,
      reviewUserName: review.user_name,
      currentUserId: userAuth.id,
      currentUserName: userAuth.name || userAuth.email?.split('@')[0]
    });
    
    // First try to match by user_id (most reliable)
    if (review.user_id && userAuth.id && review.user_id === userAuth.id) {
      return true;
    }
    
    // Fallback to name comparison
    const reviewUserName = review.user_name;
    const currentUserName = userAuth.name || userAuth.email?.split('@')[0];
    
    return reviewUserName === currentUserName;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingInput = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
        className="focus:outline-none"
      >
        <Star
          className={`w-8 h-8 transition-colors ${
            index < (hoverRating || rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  const getRatingPercentage = (stars) => {
    if (reviewStats.totalReviews === 0) return 0;
    return Math.round((reviewStats.ratingDistribution[stars] / reviewStats.totalReviews) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Customer Reviews ({reviewStats.totalReviews})
          </h3>
        </div>

        {userAuth && canReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Write Review
          </button>
        )}
      </div>

      {/* Google Business Review Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-blue-600 fill-current" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Love our products? Share your experience!
              </h4>
              <p className="text-sm text-gray-600">
                Help others discover us by leaving a review on Google Business
              </p>
            </div>
          </div>
          <a
            href="https://g.page/r/CXHJJmG3XcUzEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium border border-blue-200 shadow-sm whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" />
            Review on Google
          </a>
        </div>
      </div>

      {/* Google Business Reviews Section */}
      <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Google Business Reviews
              </h4>
              <p className="text-sm text-gray-600">Real reviews from our customers</p>
            </div>
          </div>
          <a
            href="https://g.page/r/CXHJJmG3XcUzEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Review 1 - Taha Farooqui */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Taha Farooqui</h5>
                  <p className="text-xs text-gray-500">Local Guide · 99 reviews</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Had the experience of buying two laptops back in 2020 (during COVID, they made home delivery) and in 2021. Their products are in really good condition, plus if any defect comes up even after the checking warranty period, they make sure to help.
            </p>
            <p className="text-xs text-gray-500 mt-2">1 year ago</p>
          </div>

          {/* Review 2 - Ahsan Ali */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Ahsan Ali</h5>
                  <p className="text-xs text-gray-500">1 review</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              I recently had the pleasure of purchasing a laptop from Mohit Computers, and I must say, I am thoroughly impressed with both the product and the service I received. From start to finish, the experience was seamless and exceeded my expectations.
            </p>
            <p className="text-xs text-gray-500 mt-2">1 year ago</p>
          </div>

          {/* Review 3 - Uzair Memon */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Uzair Memon</h5>
                  <p className="text-xs text-gray-500">1 review</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              I've bought over seven laptops, and each time, the experience has been superb. Their service and approach are top-notch. highly recommend them. 10/10
            </p>
            <p className="text-xs text-gray-500 mt-2">1 year ago</p>
          </div>

          {/* Review 4 - Azfar Ulislam */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Azfar Ulislam</h5>
                  <p className="text-xs text-gray-500">3 reviews</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              100 % recommendation i already bought 4 laptops from here. The owner is a very nice person; he deals with every client very calmly and then suggests the best laptop according to the client's budget and requirements.
            </p>
            <p className="text-xs text-gray-500 mt-2">1 year ago</p>
          </div>

          {/* Review 5 - Hasssnain Khaaan */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Hasssnain Khaaan</h5>
                  <p className="text-xs text-gray-500">2 reviews</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              I got my laptop from a store called Mohit Computers. They had a great selection, and the staff was super helpful in guiding me through the different options. Best rates and great service.
            </p>
            <p className="text-xs text-gray-500 mt-2">8 months ago</p>
          </div>

          {/* Review 6 - ShahRukh Ashar */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">ShahRukh Ashar</h5>
                  <p className="text-xs text-gray-500">2 reviews</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Best dealer of laptops. I have purchased many laptops but never ever had any complaint.
            </p>
            <p className="text-xs text-gray-500 mt-2">1 year ago</p>
          </div>

          {/* Review 7 - Rajiv Kumar */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-100 to-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-lime-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Rajiv Kumar Chandwani</h5>
                  <p className="text-xs text-gray-500">4 reviews</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Bought my laptop from them. They have the best prices with very quality and reliable products. They have exceptional customer support.
            </p>
            <p className="text-xs text-gray-500 mt-2">3 years ago</p>
          </div>

          {/* Review 8 - Kunal Vidhani */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Kunal Vidhani</h5>
                  <p className="text-xs text-gray-500">6 reviews</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Great after sales service, very gentle in handling customers and prices are unbeatable. Thanks surely gonna buy more products.
            </p>
            <p className="text-xs text-gray-500 mt-2">4 years ago</p>
          </div>

          {/* Review 9 - Ayaz Ahmed */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Ayaz Ahmed</h5>
                  <p className="text-xs text-gray-500">1 review</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Best price with best services as well excellent customer service. Highly recommended.
            </p>
            <p className="text-xs text-gray-500 mt-2">1 year ago</p>
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      {reviewStats.totalReviews > 0 && (
        <div className="grid md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {reviewStats.averageRating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(reviewStats.averageRating), 'w-6 h-6')}
            </div>
            <p className="text-gray-600">Based on {reviewStats.totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getRatingPercentage(stars)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {getRatingPercentage(stars)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-100">
          {!userAuth ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Login Required
              </h4>
              <p className="text-gray-600 mb-6">
                Please login to write a product review.
              </p>
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Login to Review
              </Link>
            </div>
          ) : !canReview ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Cannot Review This Product
              </h4>
              <p className="text-gray-600 mb-6">
                You can only review products from your delivered orders.
              </p>
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {userAuth.name || userAuth.email?.split('@')[0] || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-gray-500">Verified Purchase</p>
                </div>
              </div>

              {/* Order Selection */}
              {eligibleOrders.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Order
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {eligibleOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Order #{order.id.substring(0, 8)} - {formatDate(order.created_at)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex gap-1">
                  {renderRatingInput()}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="255"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  maxLength="2000"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {comment.length}/2000 characters
                  {comment.length > 0 && comment.length < 10 && (
                    <span className="text-red-500 ml-2">Minimum 10 characters required</span>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setRating(0);
                    setTitle('');
                    setComment('');
                  }}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={submitting || !rating || (comment && comment.length > 0 && comment.length < 10)}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Post Review
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Review Filters */}
      {reviewStats.totalReviews > 0 && (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm text-black border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="rating_high">Highest Rating</option>
              <option value="rating_low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No reviews yet
          </h4>
          <p className="text-gray-600 mb-6">
            Be the first to share your experience with this product!
          </p>
          {userAuth && canReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Write First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="font-semibold text-gray-900">
                          {review.user_name || 'Anonymous User'}
                        </h5>
                        {review.is_verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(review.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h6 className="font-medium text-gray-900 mb-2">
                      {review.title}
                    </h6>
                  )}

                  {/* Review Content */}
                  {review.comment && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )}

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {review.images.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600">
                          +{review.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful_count || 0})
                    </button>

                    {/* Delete button - only show for user's own reviews */}
                    {isUserReview(review) && (
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                        title="Delete your review"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
