'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, BarChart3, Menu, X, User, Phone, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { getCartItemsCount, getCartTotal } = useCart();
  const { wishlistItems } = useWishlist();
  const { compareItems } = useCompare();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProducts = () => setIsProductsOpen(!isProductsOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);
    } catch (e) {
      return `Rs:${(amount || 0).toLocaleString()}`;
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="bg-gray-900 text-white text-sm py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                <span className="font-medium">Call: 0336 8900349</span>
              </span>
              <span className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                <span className="font-medium">info@mohitcomputers.pk</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/account" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">My Account</Link>
              <span className="text-gray-600">|</span>
              <Link href="/login" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">Log In</Link>
              <span className="text-gray-600">|</span>
              <Link href="/register" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">Create Account</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="flex items-center">
                <div className="bg-teal-600 text-white px-3 sm:px-4 lg:px-6 py-2 lg:py-3 font-bold text-lg sm:text-xl lg:text-2xl rounded-lg shadow-md">
                  <span className="text-white">MOHIT</span>
                  <span className="bg-white text-teal-600 px-1 sm:px-2 py-1 rounded ml-1 text-sm sm:text-base lg:text-lg">COMPUTERS</span>
                </div>
              </div>
            </Link>

            {/* Search Bar (visible on medium screens and up) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search for laptops, accessories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset text-sm md:text-base"
                  />
                  <button
                    type="submit"
                    className="px-4 md:px-6 py-2 md:py-3 bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Cart Info */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link href="/wishlist" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-teal-600 transition-colors">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link href="/compare" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-teal-600 transition-colors">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                {compareItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                    {compareItems.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="flex items-center space-x-2 p-1.5 sm:p-2 text-gray-700 hover:text-teal-600 transition-colors">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium">Cart</div>
                  <div className="text-xs text-gray-600">{formatCurrency(getCartTotal())}</div>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button (visible until large screens) */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors ml-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Main Menu */}
          <div className="border-t border-gray-200 hidden md:block">
            <nav className="py-3">
              <ul className="flex justify-center items-center space-x-4 lg:space-x-8 text-gray-700">
                <li>
                  <Link href="/" className="hover:text-teal-600 font-medium py-2 px-3 rounded transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-teal-600 font-medium py-2 px-3 rounded transition-colors">
                    About
                  </Link>
                </li>
                <li className="relative group">
                  <button 
                    className="hover:text-teal-600 font-medium flex items-center py-2 px-3 rounded transition-colors"
                    onClick={toggleProducts}
                  >
                    Products
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Dropdown Menu */}
                  <div className={`absolute top-full left-0 mt-2 w-80 bg-white text-gray-800 shadow-xl rounded-lg z-50 ${isProductsOpen ? 'block' : 'hidden'} group-hover:block`}>
                    <div className="py-2">
                      {/* Used Laptops with brand submenu */}
                      <div className="relative group/submenu">
                        <Link href="/products?category=used-laptop" className="flex items-center justify-between px-4 py-3 hover:bg-gray-100">
                          <span className="font-medium text-gray-800">Used Laptops</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        {/* Brand Submenu */}
                        <div className="absolute left-full top-0 mt-0 w-48 bg-white shadow-xl rounded-lg hidden group-hover/submenu:block border-l border-gray-200">
                          <div className="py-2">
                            <Link href="/products?category=used-laptop&brand=hp" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                              HP
                            </Link>
                            <Link href="/products?category=used-laptop&brand=dell" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                              Dell
                            </Link>
                            <Link href="/products?category=used-laptop&brand=acer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                              Acer
                            </Link>
                            <Link href="/products?category=used-laptop&brand=lenovo" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                              Lenovo
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100"></div>
                      
                      <Link href="/products?category=chromebook" className="block px-4 py-3 hover:bg-gray-100">
                        <div className="font-medium text-gray-800">Chrome Book</div>
                      </Link>
                      
                      <Link href="/products?category=accessories" className="block px-4 py-3 hover:bg-gray-100">
                        <div className="font-medium text-gray-800">Accessories</div>
                      </Link>
                      
                      <Link href="/products?category=ram" className="block px-4 py-3 hover:bg-gray-100">
                        <div className="font-medium text-gray-800">RAM</div>
                      </Link>
                      
                      <Link href="/products?category=ssd" className="block px-4 py-3 hover:bg-gray-100">
                        <div className="font-medium text-gray-800">SSD</div>
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-teal-600 font-medium py-2 px-3 rounded transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/corporate" className="hover:text-teal-600 font-medium py-2 px-3 rounded transition-colors">
                    Corporate
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-teal-600 font-medium py-2 px-3 rounded transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex rounded-lg border border-gray-300 overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-gray-700 focus:outline-none"
              />
              <button type="submit" className="px-4 bg-teal-600 text-white hover:bg-teal-700 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <Link href="/" className="block py-2 text-gray-700 hover:text-teal-600 font-medium">Home</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-teal-600 font-medium">About</Link>
            <div className="py-2">
              <div className="font-semibold mb-2 text-gray-800">Products</div>
              <div className="pl-4 space-y-1">
                <Link href="/products?category=used-laptop" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Used Laptops</Link>
                <div className="pl-4 space-y-1">
                  <Link href="/products?category=used-laptop&brand=hp" className="block py-1 text-xs text-gray-500 hover:text-teal-600">HP</Link>
                  <Link href="/products?category=used-laptop&brand=dell" className="block py-1 text-xs text-gray-500 hover:text-teal-600">Dell</Link>
                  <Link href="/products?category=used-laptop&brand=acer" className="block py-1 text-xs text-gray-500 hover:text-teal-600">Acer</Link>
                  <Link href="/products?category=used-laptop&brand=lenovo" className="block py-1 text-xs text-gray-500 hover:text-teal-600">Lenovo</Link>
                </div>
                <Link href="/products?category=chromebook" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Chrome Book</Link>
                <Link href="/products?category=accessories" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Accessories</Link>
                <Link href="/products?category=ram" className="block py-1 text-sm text-gray-600 hover:text-teal-600">RAM</Link>
                <Link href="/products?category=ssd" className="block py-1 text-sm text-gray-600 hover:text-teal-600">SSD</Link>
              </div>
            </div>
            <Link href="/blog" className="block py-2 text-gray-700 hover:text-teal-600 font-medium">Blog</Link>
            <Link href="/corporate" className="block py-2 text-gray-700 hover:text-teal-600 font-medium">Corporate</Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-teal-600 font-medium">Contact</Link>
            <div className="pt-3 border-t border-gray-200 mt-3">
              <Link href="/cart" className="flex items-center justify-between py-2 text-gray-700 hover:text-teal-600 font-medium">
                <span>Cart</span>
                <span className="text-sm text-gray-600">{formatCurrency(getCartTotal())}</span>
              </Link>
              <Link href="/wishlist" className="block py-2 text-gray-700 hover:text-teal-600 font-medium">Wishlist ({wishlistItems.length})</Link>
              <Link href="/compare" className="block py-2 text-gray-700 hover:text-teal-600 font-medium">Compare ({compareItems.length})</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;