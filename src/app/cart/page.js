'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart, GitCompareArrows } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

export default function Cart() {
  const router = useRouter();
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
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Hero Section */}
        <section className="py-10 pb-0">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Shopping Cart
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Your Cart</h1>
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Empty Cart */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Looks like you haven&rsquo;t added any items to your cart yet. 
                  Explore our amazing collection of laptops and accessories!
                </p>
                <Link 
                  href="/products"
                  className="bg-[#6dc1c9] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
              Shopping Cart
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Your Cart</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
            </p>
            <div className="w-16 sm:w-24 h-1 bg-[#6dc1c9] rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex items-start space-x-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Image
                            src={item.featured_image || item.image || "/next.svg"}
                            alt={item.name}
                            width={60}
                            height={45}
                            className="rounded-lg object-contain"
                            onError={(e) => {
                              e.target.src = "/next.svg";
                            }}
                          />
                        </div>

                        {/* Product Details & Actions */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                                {item.displayName || item.name}
                              </h3>
                              <p className="text-sm text-gray-500">{item.brand}</p>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 rounded-lg bg-gray-100 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors ml-2"
                              title="Remove from Cart"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Product Specs - Condensed */}
                          <div className="text-xs text-gray-600 mb-3 space-y-1">
                            {item.processor && <div className="truncate">{item.processor}</div>}
                            <div className="flex space-x-4">
                              {item.ram && <span>{item.ram} RAM</span>}
                              {item.storage && <span>{item.storage}</span>}
                            </div>
                            {/* Laptop Customization Details */}
                            {item.hasCustomizations && (
                              <div className="mt-2 pt-2 border-t border-teal-200 bg-teal-50 rounded px-2 py-1">
                                <div className="font-semibold text-teal-700 mb-1">Customizations:</div>
                                {item.customizations?.ramUpgrade && (
                                  <div className="text-gray-700">• +{item.customizations.ramUpgrade.size} RAM</div>
                                )}
                                {item.customizations?.ssdUpgrade && (
                                  <div className="text-gray-700">• {item.customizations.ssdUpgrade.size} SSD</div>
                                )}
                              </div>
                            )}
                            {/* RAM Customization Details */}
                            {item.ramCustomization && (
                              <div className="mt-2 pt-2 border-t border-blue-200 bg-blue-50 rounded px-2 py-1">
                                <div className="font-semibold text-blue-700 mb-1">Configuration:</div>
                                <div className="text-gray-700">• Brand: {item.ramCustomization.specs.brand}</div>
                                <div className="text-gray-700">• Speed: {item.ramCustomization.specs.speed}</div>
                              </div>
                            )}
                          </div>

                          {/* Price & Quantity Row */}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-lg font-bold text-gray-800">
                                Rs{((item.finalPrice || item.price) * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Rs{(item.finalPrice || item.price).toLocaleString()} each
                              </div>
                              {item.customizationCost > 0 && (
                                <div className="text-xs text-teal-600 mt-1">
                                  +Rs{item.customizationCost.toLocaleString()} customization
                                </div>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons Row */}
                          <div className="flex space-x-2 mt-3">
                            {/* Wishlist Button */}
                            <button
                              onClick={() => handleWishlist(item)}
                              className={`flex-1 py-2 px-3 rounded-lg transition-colors text-xs font-medium flex items-center justify-center ${
                                isInWishlist(item.id)
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                              }`}
                            >
                              <Heart className={`w-3 h-3 mr-1 ${isInWishlist(item.id) ? 'fill-current' : ''}`} />
                              Wishlist
                            </button>

                            {/* Compare Button */}
                            {isLaptopCategory(item.category) && (
                              <button
                                onClick={() => handleCompare(item)}
                                className={`flex-1 py-2 px-3 rounded-lg transition-colors text-xs font-medium flex items-center justify-center ${
                                  isInCompare(item.id)
                                    ? 'bg-teal-100 text-[#6dc1c9] hover:bg-teal-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-[#6dc1c9]'
                                }`}
                              >
                                <GitCompareArrows className="w-3 h-3 mr-1" />
                                Compare
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={item.featured_image || item.image || "/next.svg"}
                          alt={item.name}
                          width={80}
                          height={60}
                          className="rounded-lg object-contain"
                          onError={(e) => {
                            e.target.src = "/next.svg";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {item.displayName || item.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.processor && <div>{item.processor}</div>}
                          {item.ram && <div>{item.ram} RAM</div>}
                          {item.storage && <div>{item.storage}</div>}
                          {/* Laptop Customization Details */}
                          {item.hasCustomizations && (
                            <div className="mt-2 p-2 bg-teal-50 border border-teal-200 rounded text-xs">
                              <div className="font-semibold text-teal-700 mb-1">Customizations:</div>
                              {item.customizations?.ramUpgrade && (
                                <div className="text-gray-700">• +{item.customizations.ramUpgrade.size} RAM Module (+Rs{item.customizations.ramUpgrade.price.toLocaleString()})</div>
                              )}
                              {item.customizations?.ssdUpgrade && (
                                <div className="text-gray-700">• {item.customizations.ssdUpgrade.size} SSD Upgrade (+Rs{item.customizations.ssdUpgrade.price.toLocaleString()})</div>
                              )}
                            </div>
                          )}
                          {/* RAM Customization Details */}
                          {item.ramCustomization && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                              <div className="font-semibold text-blue-700 mb-1">Selected Configuration:</div>
                              <div className="text-gray-700">• Brand: {item.ramCustomization.specs.brand}</div>
                              <div className="text-gray-700">• Speed: {item.ramCustomization.specs.speed}</div>
                              <div className="text-gray-700">• Capacity: {item.ramCustomization.specs.capacity}</div>
                            </div>
                          )}
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
                          Rs{((item.finalPrice || item.price) * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rs{(item.finalPrice || item.price).toLocaleString()} each
                        </div>
                        {item.customizationCost > 0 && (
                          <div className="text-xs text-teal-600 mt-1">
                            +Rs{item.customizationCost.toLocaleString()} customization
                          </div>
                        )}
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
                                ? 'bg-teal-100 text-[#6dc1c9] hover:bg-teal-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-[#6dc1c9]'
                            }`}
                            title={isInCompare(item.id) ? 'Remove from Compare' : 'Add to Compare'}
                          >
                            <GitCompareArrows className="w-4 h-4" />
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
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      cartItems.forEach(item => {
                        if (!isInWishlist(item.id)) {
                          addToWishlist(item);
                        }
                      });
                    }}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
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
                    className="flex-1 bg-teal-50 text-[#6dc1c9] hover:bg-teal-100 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                  >
                    <GitCompareArrows className="w-4 h-4 mr-2" />
                    Compare Laptops
                  </button>
                </div>
                
                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/wishlist"
                    className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-lg font-medium transition-colors text-center text-sm"
                  >
                    View Wishlist
                  </Link>
                  
                  <Link
                    href="/compare"
                    className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-lg font-medium transition-colors text-center text-sm"
                  >
                    Compare Products
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 lg:sticky lg:top-4 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-black">Rs {getCartTotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-black">
                    <span>Total</span>
                    <span>Rs {getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 sm:mt-6 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl bg-[#6dc1c9] text-white hover:bg-teal-700"
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Complete your order securely with Cash on Delivery
              </p>

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
      </section>
    </div>
  );
}