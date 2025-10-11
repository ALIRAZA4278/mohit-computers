'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Heart, GitCompareArrows, Menu, X, User, Phone, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData && token) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const { getCartItemsCount, getCartTotal } = useCart();
  const { wishlistItems } = useWishlist();
  const { compareItems } = useCompare();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProducts = () => setIsProductsOpen(!isProductsOpen);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (e, url) => {
    e.preventDefault();
    setIsProductsOpen(false);
    router.push(url);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const formatCurrency = (amount) => {
    try {
      return `Rs ${(amount || 0).toLocaleString('en-PK', { maximumFractionDigits: 2 })}`;
    } catch (e) {
      return `Rs ${(amount || 0).toLocaleString()}`;
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="bg-gray-900 text-white text-sm py-2 md:py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            {/* Contact Info - Hidden on mobile, visible on tablets+ */}
            <div className="hidden sm:flex items-center space-x-4 md:space-x-6 text-xs md:text-sm">
              <span className="flex items-center text-gray-300">
                <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="font-medium">Call: 0336 8900349</span>
              </span>
              <span className="flex items-center text-gray-300">
                <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="font-medium">info@mohitcomputers.pk</span>
              </span>
            </div>

            {/* Account Links - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-xs sm:text-sm">
              <Link href="/account" className="flex items-center text-gray-300 hover:text-teal-400 transition-colors font-medium">
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-0 sm:hidden" />
                <span className="hidden sm:inline">My Account</span>
                <span className="sm:hidden">Account</span>
              </Link>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <Link href="/login" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">Log In</Link>
              <span className="text-gray-600">|</span>
              <Link href="/register" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Register</span>
              </Link>
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
              <Image
                src="/logo.png"
                alt="Mohit Computers"
                width={480}
                height={180}
                  className="h-20 sm:h-24 lg:h-28 w-auto"
                priority
              />
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
                    className="px-4 md:px-6 py-2 md:py-3 bg-[#6dc1c9] text-white hover:bg-teal-700 transition-colors font-medium"
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Cart Info & User Account - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
              {isLoggedIn ? (
                <Link href="/account" className="flex items-center space-x-2 p-1.5 sm:p-2 text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="hidden lg:block">
                    <div className="text-sm font-medium">{user?.name?.split(' ')[0] || 'Account'}</div>
                    <div className="text-xs text-gray-600">My Account</div>
                  </div>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center space-x-2 p-1.5 sm:p-2 text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="hidden lg:block">
                    <div className="text-sm font-medium">Login</div>
                    <div className="text-xs text-gray-600">Account</div>
                  </div>
                </Link>
              )}
              <Link href="/wishlist" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-[#6dc1c9] transition-colors">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link href="/compare" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-[#6dc1c9] transition-colors">
                <GitCompareArrows className="w-5 h-5 sm:w-6 sm:h-6" />
                {compareItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                    {compareItems.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="flex items-center space-x-2 p-1.5 sm:p-2 text-gray-700 hover:text-[#6dc1c9] transition-colors">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-black">Cart</div>
                  <div className="text-xs text-gray-600">{formatCurrency(getCartTotal())}</div>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button (visible until large screens) */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-[#6dc1c9] transition-colors ml-2"
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
                  <Link href="/" className="hover:text-[#6dc1c9] font-medium py-2 px-3 rounded transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#6dc1c9] font-medium py-2 px-3 rounded transition-colors">
                    About
                  </Link>
                </li>
                <li className="relative group">
                  <button 
                    className="hover:text-[#6dc1c9] font-medium flex items-center py-2 px-3 rounded transition-colors"
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
                        <Link href="/products?category=used-laptop" onClick={(e) => handleCategoryClick(e, '/products?category=used-laptop')} className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer">
                          <span className="font-medium text-gray-800">Used Laptops</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        {/* Brand Submenu */}
                        <div className="absolute left-full top-0 mt-0 w-48 bg-white shadow-xl rounded-lg hidden group-hover/submenu:block border-l border-gray-200">
                          <div className="py-2">
                            <Link href="/products?category=used-laptop&brand=HP" onClick={(e) => handleCategoryClick(e, '/products?category=used-laptop&brand=HP')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer">
                              HP
                            </Link>
                            <Link href="/products?category=used-laptop&brand=Dell" onClick={(e) => handleCategoryClick(e, '/products?category=used-laptop&brand=Dell')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer">
                              Dell
                            </Link>
                            <Link href="/products?category=used-laptop&brand=Acer" onClick={(e) => handleCategoryClick(e, '/products?category=used-laptop&brand=Acer')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer">
                              Acer
                            </Link>
                            <Link href="/products?category=used-laptop&brand=Lenovo" onClick={(e) => handleCategoryClick(e, '/products?category=used-laptop&brand=Lenovo')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer">
                              Lenovo
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100"></div>

                      <Link href="/products?category=chromebook" onClick={(e) => handleCategoryClick(e, '/products?category=chromebook')} className="block px-4 py-3 hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium text-gray-800">Chrome Book</div>
                      </Link>

                      <Link href="/products?category=accessories" onClick={(e) => handleCategoryClick(e, '/products?category=accessories')} className="block px-4 py-3 hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium text-gray-800">Accessories</div>
                      </Link>

                      <Link href="/products?category=ram" onClick={(e) => handleCategoryClick(e, '/products?category=ram')} className="block px-4 py-3 hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium text-gray-800">RAM</div>
                      </Link>

                      <Link href="/products?category=ssd" onClick={(e) => handleCategoryClick(e, '/products?category=ssd')} className="block px-4 py-3 hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium text-gray-800">SSD</div>
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#6dc1c9] font-medium py-2 px-3 rounded transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/corporate" className="hover:text-[#6dc1c9] font-medium py-2 px-3 rounded transition-colors">
                    Corporate
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#6dc1c9] font-medium py-2 px-3 rounded transition-colors">
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
              <button type="submit" className="px-4 bg-[#6dc1c9] text-white hover:bg-teal-700 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <Link href="/" onClick={closeMobileMenu} className="block py-2 text-gray-700 hover:text-[#6dc1c9] font-medium">Home</Link>
            <Link href="/about" onClick={closeMobileMenu} className="block py-2 text-gray-700 hover:text-[#6dc1c9] font-medium">About</Link>
            <div className="py-2">
              <div className="font-semibold mb-2 text-gray-800">Products</div>
              <div className="pl-4 space-y-1">
                <Link href="/products?category=used-laptop" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-[#6dc1c9]">Used Laptops</Link>
                <div className="pl-4 space-y-1">
                  <Link href="/products?category=used-laptop&brand=hp" onClick={closeMobileMenu} className="block py-1 text-xs text-gray-500 hover:text-[#6dc1c9]">HP</Link>
                  <Link href="/products?category=used-laptop&brand=dell" onClick={closeMobileMenu} className="block py-1 text-xs text-gray-500 hover:text-[#6dc1c9]">Dell</Link>
                  <Link href="/products?category=used-laptop&brand=acer" onClick={closeMobileMenu} className="block py-1 text-xs text-gray-500 hover:text-[#6dc1c9]">Acer</Link>
                  <Link href="/products?category=used-laptop&brand=lenovo" onClick={closeMobileMenu} className="block py-1 text-xs text-gray-500 hover:text-[#6dc1c9]">Lenovo</Link>
                </div>
                <Link href="/products?category=chromebook" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-[#6dc1c9]">Chrome Book</Link>
                <Link href="/products?category=accessories" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-[#6dc1c9]">Accessories</Link>
                <Link href="/products?category=ram" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-[#6dc1c9]">RAM</Link>
                <Link href="/products?category=ssd" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-[#6dc1c9]">SSD</Link>
              </div>
            </div>
            <Link href="/blog" onClick={closeMobileMenu} className="block py-2 text-gray-700 hover:text-[#6dc1c9] font-medium">Blog</Link>
            <Link href="/corporate" onClick={closeMobileMenu} className="block py-2 text-gray-700 hover:text-[#6dc1c9] font-medium">Corporate</Link>
            <Link href="/contact" onClick={closeMobileMenu} className="block py-2 text-gray-700 hover:text-[#6dc1c9] font-medium">Contact</Link>
            
            {/* Mobile Action Buttons */}
            <div className="pt-3 border-t border-gray-200 mt-3">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <Link href="/wishlist" className="flex flex-col items-center justify-center py-3 bg-gray-50 rounded-lg hover:bg-teal-50 hover:text-[#6dc1c9] transition-colors">
                  <div className="relative">
                    <Heart className="w-5 h-5 mb-1 text-black" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-black">Wishlist</span>
                </Link>
                
                <Link href="/compare" className="flex flex-col items-center justify-center py-3 bg-gray-50 rounded-lg hover:bg-teal-50 hover:text-[#6dc1c9] transition-colors">
                  <div className="relative">
                    <GitCompareArrows className="w-5 h-5 mb-1 text-black" />
                    {compareItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                        {compareItems.length}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-black">Compare</span>
                </Link>
                
                <Link href="/cart" className="flex text-black flex-col items-center justify-center py-3 bg-gray-50 rounded-lg hover:bg-teal-50 hover:text-[#6dc1c9] transition-colors">
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 mb-1 text-black" />
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-black">Cart</span>
                </Link>
              </div>
              
              <div className="text-center py-2 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-teal-700">
                  Cart Total: {formatCurrency(getCartTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;