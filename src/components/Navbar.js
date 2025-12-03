  'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, User, Clock, Tag, Heart, GitCompare, Laptop, HardDrive, MemoryStick, Monitor, Briefcase, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

// Category Navigation Bar Component
function CategoryNavBar({ laptopDropdownOpen, setLaptopDropdownOpen, discountedDropdownOpen, setDiscountedDropdownOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [salesSubOpen, setSalesSubOpen] = useState(false);

  const currentCategory = searchParams?.get('category') ||
    (pathname === '/chromebook' ? 'chromebook' :
     pathname === '/clearance' ? 'clearance' :
     pathname === '/sales' ? 'sales' :
     pathname === '/workstation' ? 'workstation' : null);

  const currentBrand = searchParams?.get('brand');

  const isActive = (categoryId) => {
    if (currentCategory === categoryId) return true;
    if (categoryId === 'laptop' && (currentCategory === 'used-laptop' || currentCategory === 'workstation' || currentCategory === 'rugged-laptop')) return true;
    if (categoryId === 'discounted' && (currentCategory === 'clearance' || currentCategory === 'sales' || pathname === '/clearance' || pathname === '/sales')) return true;
    return false;
  };

  const categories = [
    {
      id: 'laptop',
      name: 'Laptops',
      icon: Laptop,
      href: '/products?category=used-laptop',
      hasDropdown: true,
      dropdownType: 'laptop',
      subcategories: [
        { name: 'All Laptops', href: '/products?category=used-laptop' },
        { name: 'HP', href: '/products?category=used-laptop&brand=HP' },
        { name: 'Dell', href: '/products?category=used-laptop&brand=Dell' },
        { name: 'Lenovo', href: '/products?category=used-laptop&brand=Lenovo' },
        { name: 'Acer', href: '/products?category=used-laptop&brand=Acer' },
        { name: 'Workstation & Gaming', href: '/workstation' },
        { name: 'Rugged Laptops', href: '/products?category=rugged-laptop' },
      ]
    },
    { id: 'chromebook', name: 'Chromebook', icon: Monitor, href: '/chromebook' },
    { id: 'ram', name: 'RAM', icon: MemoryStick, href: '/products?category=ram' },
    { id: 'ssd', name: 'SSD', icon: HardDrive, href: '/products?category=ssd' },
    {
      id: 'discounted',
      name: 'Discounted',
      icon: Tag,
      href: '/clearance',
      hasDropdown: true,
      dropdownType: 'discounted',
      subcategories: [
        { name: 'Clearance', href: '/clearance' },
        {
          name: 'Sale',
          href: '/sales',
          hasSubMenu: true,
          subItems: [
            { name: 'All Sales', href: '/sales' },
            { name: 'Used Laptops', href: '/sales?category=laptop' },
            { name: 'Chromebook', href: '/sales?category=chromebook' },
            { name: 'RAM', href: '/sales?category=ram' },
            { name: 'SSD', href: '/sales?category=ssd' },
            { name: 'Accessories', href: '/sales?category=accessories' },
          ]
        },
      ]
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[44px] sm:top-[52px] md:top-[56px] lg:top-[60px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = isActive(category.id);

            if (category.hasDropdown) {
              const isLaptopDropdown = category.dropdownType === 'laptop';
              const isDiscountedDropdown = category.dropdownType === 'discounted';
              const isOpen = isLaptopDropdown ? laptopDropdownOpen : discountedDropdownOpen;
              const setOpen = isLaptopDropdown ? setLaptopDropdownOpen : setDiscountedDropdownOpen;

              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => {
                    setOpen(false);
                    setSalesSubOpen(false);
                  }}
                >
                  <button
                    onClick={() => setOpen(!isOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#6dc1c9] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] py-2">
                        {category.subcategories.map((sub) => (
                          sub.hasSubMenu ? (
                            <div
                              key={sub.name}
                              className="relative"
                              onMouseEnter={() => setSalesSubOpen(true)}
                              onMouseLeave={() => setSalesSubOpen(false)}
                            >
                              <button
                                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#6dc1c9]/10 hover:text-[#6dc1c9] transition-colors"
                              >
                                {sub.name}
                                <ChevronDown className="w-3 h-3 -rotate-90" />
                              </button>
                              {salesSubOpen && (
                                <div className="absolute left-full top-0 ml-1 z-50">
                                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] py-2">
                                    {sub.subItems.map((item) => (
                                      <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#6dc1c9]/10 hover:text-[#6dc1c9] transition-colors"
                                      >
                                        {item.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#6dc1c9]/10 hover:text-[#6dc1c9] transition-colors"
                            >
                              {sub.name}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={category.id}
                href={category.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#6dc1c9] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isDiscountedOpen, setIsDiscountedOpen] = useState(false);
  const [isUsedLaptopsOpen, setIsUsedLaptopsOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [laptopDropdownOpen, setLaptopDropdownOpen] = useState(false);
  const [discountedDropdownOpen, setDiscountedDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData && token) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setIsProductsOpen(false);
    setIsMenuOpen(false);
    setShowSuggestions(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Debounced search function
  const debouncedSearch = useCallback((query) => {
    const performSearch = debounce(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearchLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
        setSelectedSuggestionIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    performSearch();
  }, []);

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      router.push(`/products/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      router.push(`/products?category=${suggestion.slug}`);
    } else if (suggestion.type === 'popular') {
      setSearchQuery(suggestion.name);
      router.push(`/products?search=${encodeURIComponent(suggestion.name)}`);
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutsideSearch = searchRef.current && !searchRef.current.contains(event.target);
      const isClickOutsideMobileSearch = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);

      if (isClickOutsideSearch && isClickOutsideMobileSearch) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  // Close dropdown menu when clicking on a category link
  const handleCategoryClick = () => {
    setIsProductsOpen(false);
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
      {/* Main Navigation - Clean Minimal Design */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Hamburger Menu Button */}
            <button
              className="p-1.5 text-gray-700 hover:text-[#6dc1c9] transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo - Centered */}
            <Link href="/" className="flex items-center absolute left-1/2 transform -translate-x-1/2">
              <Image
                src="/logo.png"
                alt="Mohit Computers"
                width={480}
                height={180}
                className="h-7 sm:h-10 md:h-12 lg:h-14 w-auto"
                priority
              />
            </Link>

            {/* Right Icons - Search, Wishlist, Compare, User */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`text-gray-700 hover:text-[#6dc1c9] transition-colors ${isSearchOpen ? 'text-[#6dc1c9]' : ''}`}
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="text-gray-700 hover:text-[#6dc1c9] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px] sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#6dc1c9] text-white text-[8px] rounded-full min-w-[12px] h-3 flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Compare Icon */}
              <Link
                href="/compare"
                className="text-gray-700 hover:text-[#6dc1c9] transition-colors relative"
                aria-label="Compare"
              >
                <GitCompare className="w-[18px] h-[18px] sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                {compareItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#6dc1c9] text-white text-[8px] rounded-full min-w-[12px] h-3 flex items-center justify-center font-bold">
                    {compareItems.length}
                  </span>
                )}
              </Link>

              {/* User Icon */}
              <Link
                href={isLoggedIn ? "/account" : "/login"}
                className="text-gray-700 hover:text-[#6dc1c9] transition-colors"
                aria-label="Account"
              >
                <User className="w-[18px] h-[18px] sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Search Overlay - Glassmorphism */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl animate-fadeInDown">
            <div className="container mx-auto px-4 py-5">
              <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="flex rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden bg-white">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for laptops, accessories..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        if (suggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      autoFocus
                      className="flex-1 px-5 py-4 text-gray-700 bg-transparent focus:outline-none text-base"
                    />
                    <button
                      type="submit"
                      className="px-6 py-4 bg-gradient-to-r from-[#6dc1c9] to-teal-500 text-white hover:from-teal-600 hover:to-teal-700 transition-all font-medium"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto animate-fadeInUp"
                  >
                    <div className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.type}-${suggestion.id || suggestion.name}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`px-4 py-3 cursor-pointer transition-all flex items-center space-x-3 ${
                            index === selectedSuggestionIndex
                              ? 'bg-gradient-to-r from-[#6dc1c9]/10 to-teal-500/10 border-l-4 border-[#6dc1c9]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {suggestion.type === 'product' && (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                                <Search className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            {suggestion.type === 'category' && (
                              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
                                <Tag className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                            {suggestion.type === 'popular' && (
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-sm">
                                <Clock className="w-5 h-5 text-orange-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {suggestion.name}
                            </div>
                            {suggestion.brand && (
                              <div className="text-sm text-gray-500 truncate">
                                {suggestion.brand} • {suggestion.category}
                              </div>
                            )}
                            {suggestion.type === 'popular' && (
                              <div className="text-sm text-gray-500">
                                Popular search
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-xs text-gray-400 uppercase font-medium bg-gray-100 px-2 py-1 rounded-full">
                              {suggestion.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Loading indicator */}
                    {isSearchLoading && (
                      <div className="px-4 py-4 text-center text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#6dc1c9] border-t-transparent"></div>
                          <span className="text-sm">Searching...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-[44px] sm:h-[52px] md:h-[56px] lg:h-[60px]"></div>

      {/* Category Navigation Bar - Show on all pages except home */}
      {pathname !== '/' && (
        <Suspense fallback={
          <div className="bg-white border-b border-gray-200 sticky top-[44px] sm:top-[52px] md:top-[56px] lg:top-[60px] z-40">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-1 py-2">
                <div className="h-9 w-full max-w-xl bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        }>
          <CategoryNavBar laptopDropdownOpen={laptopDropdownOpen} setLaptopDropdownOpen={setLaptopDropdownOpen} discountedDropdownOpen={discountedDropdownOpen} setDiscountedDropdownOpen={setDiscountedDropdownOpen} />
        </Suspense>
      )}

      {/* Slide-out Menu - Smooth Transition */}
      {/* Backdrop with blur - always rendered, opacity transition */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      ></div>

      {/* Menu Panel - always rendered, transform transition */}
      <div className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[70] flex flex-col transition-transform duration-300 ease-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link href="/" onClick={closeMobileMenu}>
                <Image
                  src="/logo.png"
                  alt="Mohit Computers"
                  width={200}
                  height={75}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#6dc1c9]/10 hover:to-transparent hover:text-[#6dc1c9] font-medium rounded-xl transition-all">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </span>
                <span>Home</span>
              </Link>

              <Link href="/about" onClick={closeMobileMenu} className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#6dc1c9]/10 hover:to-transparent hover:text-[#6dc1c9] font-medium rounded-xl transition-all">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                <span>About</span>
              </Link>

              {/* Products with expandable submenu */}
              <div>
                <button
                  onClick={toggleProducts}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#6dc1c9]/10 hover:to-transparent font-medium rounded-xl transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <span>Products</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProductsOpen && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-[#6dc1c9]/30 pl-4 py-2 bg-gray-50/50 rounded-r-xl animate-fadeIn">
                    {/* Used Laptops - Expandable */}
                    <div>
                      <button
                        onClick={() => setIsUsedLaptopsOpen(!isUsedLaptopsOpen)}
                        className="flex items-center justify-between w-full py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all"
                      >
                        <span>Used Laptops</span>
                        <svg className={`w-3 h-3 transition-transform duration-200 ${isUsedLaptopsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isUsedLaptopsOpen && (
                        <div className="ml-3 space-y-1 border-l border-gray-200 pl-3 mt-1 animate-fadeIn">
                          <Link href="/products?category=used-laptop" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">View All</Link>
                          <Link href="/products?category=used-laptop&brand=HP" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">HP</Link>
                          <Link href="/products?category=used-laptop&brand=Dell" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">Dell</Link>
                          <Link href="/products?category=used-laptop&brand=Acer" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">Acer</Link>
                          <Link href="/products?category=used-laptop&brand=Lenovo" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">Lenovo</Link>
                        </div>
                      )}
                    </div>
                    <Link href="/products?category=chromebook" onClick={closeMobileMenu} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all">Chrome Book</Link>
                    <Link href="/workstation" onClick={closeMobileMenu} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all">Workstation & Gaming</Link>
                    <Link href="/products?category=rugged-laptop" onClick={closeMobileMenu} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all">Rugged Book</Link>
                    <Link href="/products?category=accessories" onClick={closeMobileMenu} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all">Accessories</Link>
                    <Link href="/products?category=ram" onClick={closeMobileMenu} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all">RAM</Link>
                    <Link href="/products?category=ssd" onClick={closeMobileMenu} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all">SSD</Link>
                  </div>
                )}
              </div>

              {/* Discounted with expandable submenu */}
              <div>
                <button
                  onClick={() => setIsDiscountedOpen(!isDiscountedOpen)}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#6dc1c9]/10 hover:to-transparent font-medium rounded-xl transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    </span>
                    <span>Discounted</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDiscountedOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDiscountedOpen && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-100 pl-4 py-2 bg-gray-50/50 rounded-r-xl animate-fadeIn">
                    {/* Sales - Expandable */}
                    <div>
                      <button
                        onClick={() => setIsSalesOpen(!isSalesOpen)}
                        className="flex items-center justify-between w-full py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all font-medium"
                      >
                        <span>Sales</span>
                        <svg className={`w-3 h-3 transition-transform duration-200 ${isSalesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isSalesOpen && (
                        <div className="ml-3 space-y-1 border-l border-gray-200 pl-3 mt-1 animate-fadeIn">
                          <Link href="/sales" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">View All</Link>
                          <Link href="/sales?category=laptop" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">Used Laptops</Link>
                          <Link href="/sales?category=chromebook" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">Chromebook</Link>
                          <Link href="/sales?category=ram" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">RAM</Link>
                          <Link href="/sales?category=ssd" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">SSD</Link>
                          <Link href="/sales?category=accessories" onClick={closeMobileMenu} className="block py-1.5 text-xs text-gray-500 hover:text-[#6dc1c9]">Accessories</Link>
                        </div>
                      )}
                    </div>
                    <Link href="/clearance" onClick={closeMobileMenu} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#6dc1c9] hover:bg-white rounded-lg transition-all font-medium">
                      Clearance
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/corporate" onClick={closeMobileMenu} className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#6dc1c9]/10 hover:to-transparent hover:text-[#6dc1c9] font-medium rounded-xl transition-all">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </span>
                <span>Corporate</span>
              </Link>

              <Link href="/contact" onClick={closeMobileMenu} className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#6dc1c9]/10 hover:to-transparent hover:text-[#6dc1c9] font-medium rounded-xl transition-all">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <span>Contact</span>
              </Link>

              <Link href="/blog" onClick={closeMobileMenu} className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#6dc1c9]/10 hover:to-transparent hover:text-[#6dc1c9] font-medium rounded-xl transition-all">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </span>
                <span>Blog</span>
              </Link>
            </div>

            {/* Account Section at bottom */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <Link
                href={isLoggedIn ? "/account" : "/login"}
                onClick={closeMobileMenu}
                className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-[#6dc1c9] text-white font-medium rounded-xl hover:bg-teal-600 transition-all"
              >
                <User className="w-5 h-5" />
                <span>{isLoggedIn ? "My Account" : "Login / Create Account"}</span>
              </Link>
            </div>
          </div>

      {/* Floating Cart Button - Shows only when items in cart */}
      {getCartItemsCount() > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-24 right-6 z-50 bg-[#6dc1c9] hover:bg-teal-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="View Cart"
        >
          <span className="absolute inset-0 rounded-full bg-[#6dc1c9] animate-ping opacity-75"></span>
          <div className="relative z-10">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {getCartItemsCount()}
            </span>
          </div>
        </Link>
      )}
    </>
  );
};

export default Navbar;