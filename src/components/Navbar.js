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
      return `₹${(amount || 0).toLocaleString()}`;
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="bg-blue-900 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Call: 0336 8900349
            </span>
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              info@mohitcomputers.pk
            </span>
          </div>
          <div className="flex items-center space-x-4">
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/account" className="hover:text-yellow-400">My Account</Link>
            <Link href="/login" className="hover:text-yellow-400">Log In</Link>
            <Link href="/register" className="hover:text-yellow-400">Create Account</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-blue-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="bg-teal-500 text-white px-4 py-2 font-bold text-xl rounded">
                MOHIT <span className="bg-white text-teal-500 px-2 rounded">COMPUTERS</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search entire store here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 text-gray-800 border-2 border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:border-yellow-400"
                  />
                  <select className="px-4 py-3 bg-gray-100 border-2 border-l-0 border-r-0 border-gray-300 text-gray-800 focus:outline-none">
                    <option>Categories</option>
                    <option>Used Laptop</option>
                    <option>Chromebook</option>
                    <option>Accessories</option>
                    <option>RAM</option>
                    <option>SSD</option>
                  </select>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-yellow-400 text-black rounded-r-lg hover:bg-yellow-500 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Cart Info */}
            <div className="flex items-center space-x-6 text-white">
              <Link href="/wishlist" className="relative">
                <Heart className="w-6 h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link href="/compare" className="relative">
                <BarChart3 className="w-6 h-6" />
                {compareItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {compareItems.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="flex items-center space-x-2">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm">Cart</div>
                  <div className="font-bold">{formatCurrency(getCartTotal())}</div>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Main Menu */}
          <div className="border-t border-blue-700">
            <nav className="py-4">
              <ul className="flex items-center space-x-8 text-white">
                <li>
                  <Link href="/" className="hover:text-yellow-400 font-medium">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-yellow-400 font-medium">
                    About
                  </Link>
                </li>
                <li className="relative group">
                  <button 
                    className="hover:text-yellow-400 font-medium flex items-center"
                    onClick={toggleProducts}
                  >
                    Products
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <Link href="/blog" className="hover:text-yellow-400 font-medium">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/corporate" className="hover:text-yellow-400 font-medium">
                    Corporate
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-yellow-400 font-medium">
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
        <div className="md:hidden bg-blue-800 text-white">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-yellow-400">Home</Link>
            <Link href="/about" className="block py-2 hover:text-yellow-400">About</Link>
            <div className="py-2">
              <div className="font-medium mb-2">Products</div>
              <div className="pl-4 space-y-1">
                <Link href="/products?category=used-laptop" className="block py-1 text-sm hover:text-yellow-400">Used Laptops</Link>
                <div className="pl-4 space-y-1">
                  <Link href="/products?category=used-laptop&brand=hp" className="block py-1 text-xs text-gray-300 hover:text-yellow-400">HP</Link>
                  <Link href="/products?category=used-laptop&brand=dell" className="block py-1 text-xs text-gray-300 hover:text-yellow-400">Dell</Link>
                  <Link href="/products?category=used-laptop&brand=acer" className="block py-1 text-xs text-gray-300 hover:text-yellow-400">Acer</Link>
                  <Link href="/products?category=used-laptop&brand=lenovo" className="block py-1 text-xs text-gray-300 hover:text-yellow-400">Lenovo</Link>
                </div>
                <Link href="/products?category=chromebook" className="block py-1 text-sm hover:text-yellow-400">Chrome Book</Link>
                <Link href="/products?category=accessories" className="block py-1 text-sm hover:text-yellow-400">Accessories</Link>
                <Link href="/products?category=ram" className="block py-1 text-sm hover:text-yellow-400">RAM</Link>
                <Link href="/products?category=ssd" className="block py-1 text-sm hover:text-yellow-400">SSD</Link>
              </div>
            </div>
            <Link href="/blog" className="block py-2 hover:text-yellow-400">Blog</Link>
            <Link href="/corporate" className="block py-2 hover:text-yellow-400">Corporate</Link>
            <Link href="/contact" className="block py-2 hover:text-yellow-400">Contact</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;