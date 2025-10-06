'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart, BarChart3 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare, isLaptopCategory } = useCompare();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompare = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      const success = addToCompare(product);
      if (success) {
        // Optional: Show success message
      }
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // In a real app, you would integrate with a payment gateway
    setTimeout(() => {
      alert('Order placed successfully! Thank you for your purchase.');
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&rsquo;t added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src="/next.png" // Placeholder
                          alt={item.name}
                          width={80}
                          height={60}
                          className="rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.processor && <div>{item.processor}</div>}
                          {item.ram && <div>{item.ram} RAM</div>}
                          {item.storage && <div>{item.storage}</div>}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="text-lg font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          Rs:{(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rs:{item.price.toLocaleString()} each
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2">
                        {/* Wishlist Button */}
                        <button
                          onClick={() => handleWishlist(item)}
                          className={`p-2 rounded-lg transition-colors ${
                            isInWishlist(item.id)
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                          title={isInWishlist(item.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(item.id) ? 'fill-current' : ''}`} />
                        </button>

                        {/* Compare Button */}
                        {isLaptopCategory(item.category) && (
                          <button
                            onClick={() => handleCompare(item)}
                            className={`p-2 rounded-lg transition-colors ${
                              isInCompare(item.id)
                                ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-teal-600'
                            }`}
                            title={isInCompare(item.id) ? 'Remove from Compare' : 'Add to Compare'}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-lg bg-gray-100 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Remove from Cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping & Quick Actions */}
            <div className="mt-6 space-y-4">
              <Link 
                href="/products"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                ← Continue Shopping
              </Link>
              
              {/* Quick Action Buttons */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      cartItems.forEach(item => {
                        if (!isInWishlist(item.id)) {
                          addToWishlist(item);
                        }
                      });
                    }}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add All to Wishlist
                  </button>
                  
                  <button
                    onClick={() => {
                      const laptops = cartItems.filter(item => isLaptopCategory(item.category));
                      laptops.forEach(item => {
                        if (!isInCompare(item.id)) {
                          addToCompare(item);
                        }
                      });
                    }}
                    className="flex-1 bg-teal-50 text-teal-600 hover:bg-teal-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Compare Laptops
                  </button>
                </div>
                
                <div className="mt-3 flex gap-3">
                  <Link
                    href="/wishlist"
                    className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  >
                    View Wishlist
                  </Link>
                  
                  <Link
                    href="/compare"
                    className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  >
                    Compare Products
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs:{getCartTotal().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-medium">Rs:{Math.round(getCartTotal() * 0.18).toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rs:{Math.round(getCartTotal() * 1.18).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                  isCheckingOut
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {/* Checkout Form (Simple) */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Checkout</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Delivery Address"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Cash on Delivery</option>
                    <option>Online Payment</option>
                    <option>EMI Options</option>
                  </select>
                </form>
              </div>

              {/* Security */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-500">
                  🔒 Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}