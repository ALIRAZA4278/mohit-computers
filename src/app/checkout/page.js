'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Truck, CreditCard, MapPin, User, Phone, Mail, ArrowLeft, CheckCircle, ChevronDown, Navigation } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: 'Pakistan',
    street_address: '',
    apartment: '',
    city: '',
    state: 'Sindh',
    postal_code: '',
    phone: '',
    email: '',
    order_notes: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          // Auto-fill form with user profile data
          const nameParts = (data.user.name || '').split(' ');
          setFormData({
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            country: 'Pakistan',
            street_address: data.user.address_line1 || data.user.address || '',
            apartment: data.user.address_line2 || '',
            city: data.user.city || '',
            state: data.user.state || 'Sindh',
            postal_code: data.user.postal_code || '',
            phone: data.user.phone || '',
            email: data.user.email || '',
            order_notes: ''
          });
        } else {
          // Redirect to login if not authenticated
          router.push('/login?redirect=/checkout');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login?redirect=/checkout');
      } finally {
        setIsLoading(false);
      }
    };

    // Check if cart is empty
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }

    checkAuth();
  }, [cartItems.length, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get user's current location
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;

            // Update form with location data
            setFormData(prev => ({
              ...prev,
              street_address: address.road || address.neighbourhood || address.suburb || data.display_name || '',
              city: address.city || address.town || address.village || address.state_district || '',
              state: address.state || prev.state,
              postal_code: address.postcode || prev.postal_code
            }));
          } else {
            // Fallback: Just show coordinates
            setFormData(prev => ({
              ...prev,
              street_address: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }));
          }
        } catch (error) {
          console.error('Error getting address:', error);
          alert('Could not get address from location. Please enter manually.');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not get your location. Please ensure location permissions are enabled.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        image: item.featured_image || item.image,
        processor: item.processor,
        ram: item.ram,
        storage: item.hdd || item.storage
      }));

      // Calculate total
      const subtotal = getCartTotal();
      const totalAmount = subtotal;

      // Combine name and address
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();
      const fullAddress = formData.apartment
        ? `${formData.street_address}, ${formData.apartment}`
        : formData.street_address;

      // Submit order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: fullAddress,
          shipping_city: formData.city,
          shipping_postal_code: formData.postal_code,
          order_items: orderItems,
          total_amount: totalAmount,
          order_notes: formData.order_notes
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart
        clearCart();
        // Redirect to order confirmation page
        router.push(`/order-confirmation?order_id=${data.order.order_id}`);
      } else {
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const total = subtotal;

  const pakistanStates = [
    'Sindh', 'Punjab', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Jammu and Kashmir', 'Islamabad Capital Territory'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to cart
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Billing Details */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Details</h2>

                <div className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        placeholder="First Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Last Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none bg-white"
                      >
                        <option value="Pakistan">Pakistan</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mb-3">
                      <input
                        type="text"
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleInputChange}
                        required
                        placeholder="House number and street name"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Use current location"
                      >
                        {isGettingLocation ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-600 border-t-transparent"></div>
                        ) : (
                          <Navigation className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Town/City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Town / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / County <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none bg-white"
                      >
                        {pakistanStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Postcode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postcode / ZIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Email Address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order notes (optional)
                    </label>
                    <textarea
                      name="order_notes"
                      value={formData.order_notes}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-gray-900"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 lg:sticky lg:top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h2>

                {/* Order Items Table */}
                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  <div className="flex justify-between font-semibold text-gray-900 mb-4 pb-3 border-b">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.name} <span className="text-gray-500">× {item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-900">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-gray-700 py-3 border-t">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">Rs {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 py-3 border-t">
                    <span>Total</span>
                    <span>Rs {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowCoupon(!showCoupon)}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Have a coupon? Click here to enter your coupon code
                  </button>
                  {showCoupon && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                      />
                      <button
                        type="button"
                        className="px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      checked
                      readOnly
                      className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="cod" className="ml-3 flex-1">
                      <span className="font-medium text-gray-900 block mb-1">Cash on delivery</span>
                      <span className="text-sm text-gray-600">Pay with cash upon delivery.</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processing Order...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>100% Secure Checkout</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0" />
                    <span>Free Delivery Across Pakistan</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span>Easy 7-Day Return Policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
