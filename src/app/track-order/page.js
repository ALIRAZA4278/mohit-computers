'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Search, CheckCircle, Clock, Truck, MapPin, Phone, Mail } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('order_id') || '');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = useCallback(async (e) => {
    if (e) e.preventDefault();

    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/track?order_id=${orderId.trim()}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError('Order not found. Please check your order ID and try again.');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (searchParams.get('order_id')) {
      handleTrack();
    }
  }, [handleTrack, searchParams]);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Order Pending', icon: Clock },
      confirmed: { color: 'blue', text: 'Order Confirmed', icon: CheckCircle },
      processing: { color: 'purple', text: 'Processing Order', icon: Package },
      shipped: { color: 'indigo', text: 'Order Shipped', icon: Truck },
      delivered: { color: 'green', text: 'Delivered', icon: CheckCircle },
      cancelled: { color: 'red', text: 'Cancelled', icon: Clock }
    };

    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-[#6dc1c9]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order ID to track your order status</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <form onSubmit={handleTrack} className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g., MC-20250109-1234)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl ${
                  isLoading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#6dc1c9] to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r from-${getStatusInfo(order.order_status).color}-500 to-${getStatusInfo(order.order_status).color}-600 p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Order #{order.order_id}</h2>
                      <p className="text-white/90">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      {React.createElement(getStatusInfo(order.order_status).icon, { className: 'w-8 h-8' })}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Timeline */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"></div>

                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                        const statusInfo = getStatusInfo(status);
                        const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                        const currentIndex = statusOrder.indexOf(order.order_status);
                        const isActive = index <= currentIndex;
                        const isCancelled = order.order_status === 'cancelled';

                        return (
                          <div key={status} className="flex flex-col items-center z-10 relative">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                isActive && !isCancelled
                                  ? `bg-${statusInfo.color}-500 text-white`
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {React.createElement(statusInfo.icon, { className: 'w-6 h-6' })}
                            </div>
                            <p className={`text-xs font-medium text-center ${isActive && !isCancelled ? 'text-gray-900' : 'text-gray-400'}`}>
                              {statusInfo.text.split(' ')[1] || statusInfo.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {order.order_status === 'cancelled' && (
                      <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center font-medium">
                        This order has been cancelled
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Order Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Status:</span>
                          <span className="font-semibold capitalize">{order.order_status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-semibold">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className="font-semibold capitalize">{order.payment_status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-lg">Rs {parseFloat(order.total_amount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Delivery Address</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="font-medium">{order.customer_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>
                          {order.shipping_city}
                          {order.shipping_postal_code && `, ${order.shipping_postal_code}`}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-[#6dc1c9]" />
                          {order.customer_phone}
                        </p>
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-[#6dc1c9]" />
                          {order.customer_email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Items ({order.order_items.length})</h3>
                    <div className="space-y-3">
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.brand} • Qty: {item.quantity}
                            </p>
                            {item.processor && (
                              <p className="text-xs text-gray-500 mt-1">{item.processor}</p>
                            )}
                          </div>
                          <p className="font-bold text-gray-900">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.order_notes && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700">Order Notes:</p>
                      <p className="text-sm text-gray-600 mt-1">{order.order_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-gradient-to-r from-[#6dc1c9] to-blue-600 rounded-2xl p-6 text-white text-center">
                <h3 className="font-bold text-xl mb-2">Need Help?</h3>
                <p className="text-teal-100 mb-4">Contact us for any questions about your order</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="tel:03368900349"
                    className="bg-white text-[#6dc1c9] px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                  >
                    Call Us
                  </a>
                  <a
                    href="mailto:info@mohitcomputers.pk"
                    className="bg-white/20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!order && !error && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h3 className="font-bold text-gray-900 mb-4">How to find your Order ID?</h3>
              <p className="text-gray-600 mb-6">
                Your order ID was sent to your email after placing the order. It looks like this: MC-20250109-1234
              </p>
              <Link
                href="/account"
                className="inline-block bg-[#6dc1c9] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                View My Orders
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6dc1c9] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
