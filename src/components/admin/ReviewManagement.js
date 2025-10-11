'use client';

import { useState, useEffect } from 'react';
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Package,
  ExternalLink,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, approved, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, [filter, searchTerm, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filter,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm
      });

      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews || []);
        setTotalReviews(data.total || 0);
        setTotalPages(data.totalPages || 1);
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
  };

  const handleApprove = async (reviewId, currentStatus) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_id: reviewId,
          is_approved: !currentStatus
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchReviews(); // Refresh the list
        alert(`Review ${!currentStatus ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert(data.error || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews?review_id=${reviewId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        fetchReviews(); // Refresh the list
        alert('Review deleted successfully!');
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (review) => {
    if (review.is_approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Eye className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const getVerificationBadge = (review) => {
    if (review.is_verified) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <ShoppingBag className="w-3 h-3 mr-1" />
          Verified Purchase
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
            <p className="text-gray-600">Manage and moderate product reviews</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total Reviews: {totalReviews}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              All Reviews
            </button>
            <button
              onClick={() => {
                setFilter('approved');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Check className="w-4 h-4 inline mr-2" />
              Approved
            </button>
            <button
              onClick={() => {
                setFilter('pending');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Pending
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Product reviews will appear here when customers start reviewing products.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">Anonymous User</h4>
                              {getStatusBadge(review)}
                              {getVerificationBadge(review)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(review.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                <Link 
                                  href={`/products/${review.products?.slug || review.product_id}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {review.products?.name || 'Product'}
                                </Link>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {review.helpful_count || 0} helpful
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {review.rating}/5
                          </span>
                        </div>

                        {/* Review Title */}
                        {review.title && (
                          <h5 className="font-medium text-gray-900 mb-2">
                            {review.title}
                          </h5>
                        )}

                        {/* Review Content */}
                        {review.comment && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-gray-700 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        )}

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-4">
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

                        {/* Order Info */}
                        <div className="text-sm text-gray-500 mb-4">
                          <span className="inline-flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            Order ID: {review.order_id?.substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(review.id, review.is_approved)}
                      className={`p-2 rounded-lg transition-colors ${
                        review.is_approved
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={review.is_approved ? 'Reject review' : 'Approve review'}
                    >
                      {review.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                    <Link
                      href={`/products/${review.products?.slug || review.product_id}`}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View product"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalReviews)} of {totalReviews} reviews
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
