'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Phone, Mail, MapPin, ArrowRight, Download } from 'lucide-react';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [orderId, router]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/track?order_id=${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        alert('Order not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Failed to load order details');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-green-100">Thank you for your order. We&apos;ll process it shortly.</p>
            </div>

            {/* Order Details */}
            <div className="p-8 space-y-6">
              {/* Order ID */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
                <p className="text-3xl font-bold text-gray-900 mb-3">{order.order_id}</p>
                <p className="text-sm text-gray-600">
                  Save this ID to track your order
                </p>
              </div>

              {/* Order Summary */}
              <div className="border-t border-b py-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Status:</span>
                    <span className="font-semibold text-orange-600 capitalize">{order.order_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-2xl font-bold text-gray-900">Rs {parseFloat(order.total_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <div className="flex items-start">
                    <Package className="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">{order.shipping_address}</p>
                      <p className="text-sm text-gray-700">
                        {order.shipping_city}
                        {order.shipping_postal_code && `, ${order.shipping_postal_code}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Items Ordered ({order.order_items.length})</h2>
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

              {/* Order Notes */}
              {order.order_notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700">Order Notes:</p>
                  <p className="text-sm text-gray-600 mt-1">{order.order_notes}</p>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-5 h-5 text-teal-600 mr-2" />
                  What happens next?
                </h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-teal-600 mr-3">1.</span>
                    <span>We&apos;ll confirm your order via phone call within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-teal-600 mr-3">2.</span>
                    <span>Your order will be carefully packed and dispatched</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-teal-600 mr-3">3.</span>
                    <span>Delivery will be made to your address within 2-5 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-teal-600 mr-3">4.</span>
                    <span>Pay cash when you receive your order</span>
                  </li>
                </ol>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-900 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-4">Need Help?</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-teal-400" />
                    <div>
                      <p className="text-gray-400">Call us</p>
                      <p className="font-medium">0336 8900349</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-teal-400" />
                    <div>
                      <p className="text-gray-400">Email us</p>
                      <p className="font-medium">info@mohitcomputers.pk</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-teal-400" />
                    <div>
                      <p className="text-gray-400">Visit us</p>
                      <p className="font-medium text-xs">Suite 316-B, Karachi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  href="/account"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 px-6 rounded-xl font-semibold text-center transition-all shadow-lg hover:shadow-xl"
                >
                  View My Orders
                </Link>
                <Link
                  href="/products"
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-teal-300 text-gray-900 py-3 px-6 rounded-xl font-semibold text-center transition-all flex items-center justify-center"
                >
                  Continue Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Track Order */}
          <div className="mt-6 text-center">
            <Link
              href={`/track-order?order_id=${order.order_id}`}
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold"
            >
              <Package className="w-5 h-5 mr-2" />
              Track Your Order
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
