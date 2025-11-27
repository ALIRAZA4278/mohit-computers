'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';
import { testimonials } from '../lib/data';
import { productsAPI } from '../lib/supabase-db';

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [newArrivalIndex, setNewArrivalIndex] = useState(0);
  const [workstationIndex, setWorkstationIndex] = useState(0);
  const [accessoryIndex, setAccessoryIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewsPerView, setReviewsPerView] = useState(3);

  // State for products from database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero banners carousel
  const heroBanners = [
    { desktop: '/banners/hero banner 1.jpg', mobile: '/banners/hero mobile banner 1.jpg' },
    { desktop: '/banners/hero banner 2.jpg', mobile: '/banners/hero mobile banner 2.jpg' },
    { desktop: '/banners/hero banner 3.jpg', mobile: '/banners/hero mobile banner 3.jpg' }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 3);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // State for items per view (responsive)
  const [itemsPerView, setItemsPerView] = useState(4);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // Mobile
        setReviewsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2); // Small tablets
        setReviewsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablets
        setReviewsPerView(2);
      } else {
        setItemsPerView(4); // Desktop
        setReviewsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products from database
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await productsAPI.getAll();

        if (error) {
          console.error('Error fetching products:', error);
          setError(error.message);
          return;
        }

        setProducts(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter out SEO-only products (they should only be visible via direct URL, not in catalog)
  const catalogProducts = products.filter(product => !product.seo_only);

  const featuredProducts = catalogProducts.filter(product => product.is_featured);
  const newArrivalProducts = catalogProducts.slice(0, 8); // Latest 8 products - all categories
  const workstationProducts = catalogProducts.filter(product =>
    product.is_workstation === true || product.category_id === 'workstation'
  );
  const accessoryProducts = catalogProducts.filter(product => product.category_id === 'accessories');

  // Calculate max index for each carousel
  const getMaxIndex = (productCount) => {
    return Math.max(0, productCount - itemsPerView);
  };

  // Calculate transform percentage based on items per view
  const getTransformPercentage = (index) => {
    return index * (100 / itemsPerView);
  };

  return (
    <div className="bg-[#f3f4f6]">
      {/* Landing Page - Hero Section with Carousel */}
      <section className="relative">
        <div className="relative">
          {/* Hero Banners Carousel */}
          <div className="relative overflow-hidden w-full">
            <div
              className="flex transition-transform duration-700 ease-in-out w-full"
              style={{ transform: `translateX(-${heroIndex * 100}%)` }}
            >
              {heroBanners.map((banner, index) => (
                <div key={index} className="w-full flex-shrink-0" style={{ minWidth: '100%' }}>
                  <Banner
                    desktopImage={banner.desktop}
                    mobileImage={banner.mobile}
                    alt={`Hero Banner ${index + 1}`}
                    priority={index === 0}
                    isHero={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={() => setHeroIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-2xl rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
          </button>
          <button
            onClick={() => setHeroIndex((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-2xl rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === heroIndex
                    ? 'bg-white w-8 h-3 shadow-lg'
                    : 'bg-white/60 w-3 h-3 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Banner */}
      <section className="pt-8 md:pt-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="bg-white rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <Banner
              desktopImage="/banners/feature c.jpg"
              mobileImage="/banners/mob feature c.jpg"
              alt="Featured Products"
              height="250px"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6dc1c9]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">Error loading products: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700"
              >
                Retry
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No featured products available at the moment.</p>
            </div>
          ) : (
              <div className="relative px-8 sm:px-4">
              <div className="overflow-hidden rounded-xl -mx-2 sm:-mx-3">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${getTransformPercentage(featuredIndex)}%)` }}
                >
                  {featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex-none px-2 sm:px-3"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              {featuredProducts.length > itemsPerView && (
                <>
                  <button
                    onClick={() => setFeaturedIndex(Math.max(0, featuredIndex - 1))}
                    className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={featuredIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setFeaturedIndex(Math.min(getMaxIndex(featuredProducts.length), featuredIndex + 1))}
                    className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={featuredIndex >= getMaxIndex(featuredProducts.length)}
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* New Arrival Banner */}
      <section className="pt-8 md:pt-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="bg-white rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <Banner
              desktopImage="/banners/Newarrival banner.jpg"
              mobileImage="/banners/mob Newarrival c.jpg"
              alt="New Arrivals"
              height="250px"
            />
          </div>
        </div>
      </section>

      {/* New Arrival Products Slider */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {!loading && !error && newArrivalProducts.length > 0 && (
            <div className="relative px-8 sm:px-4">
              <div className="overflow-hidden rounded-xl -mx-2 sm:-mx-3">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${getTransformPercentage(newArrivalIndex)}%)` }}
                >
                  {newArrivalProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex-none px-2 sm:px-3"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              {newArrivalProducts.length > itemsPerView && (
                <>
                  <button
                    onClick={() => setNewArrivalIndex(Math.max(0, newArrivalIndex - 1))}
                    className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={newArrivalIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setNewArrivalIndex(Math.min(getMaxIndex(newArrivalProducts.length), newArrivalIndex + 1))}
                    className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={newArrivalIndex >= getMaxIndex(newArrivalProducts.length)}
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Workstation Banner */}
      <section className="pt-8 md:pt-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="bg-white rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <Banner
              desktopImage="/banners/Work station banner.jpg"
              mobileImage="/banners/mob Work station c.jpg"
              alt="Workstation Collection"
              height="250px"
            />
          </div>
        </div>
      </section>

      {/* Workstation Products Slider */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Workstation Slider with View All Card */}
          {!loading && !error && workstationProducts.length > 0 && (
            <div className="relative px-8 sm:px-4">
              <div className="overflow-hidden rounded-xl -mx-2 sm:-mx-3">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${getTransformPercentage(workstationIndex)}%)` }}
                >
                  {workstationProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex-none px-2 sm:px-3"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                  {/* View All Card */}
                  <div
                    className="flex-none px-2 sm:px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <Link href="/workstation" className="block h-full">
                      <div className="bg-gradient-to-br from-[#6dc1c9] to-teal-700 rounded-xl p-6 h-full min-h-[400px] flex flex-col items-center justify-center text-white hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                          <ArrowRight className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">View All</h3>
                        <p className="text-white/80 text-sm text-center">Workstations</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              {(workstationProducts.length + 1) > itemsPerView && (
                <>
                  <button
                    onClick={() => setWorkstationIndex(Math.max(0, workstationIndex - 1))}
                    className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={workstationIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setWorkstationIndex(Math.min(workstationProducts.length + 1 - itemsPerView, workstationIndex + 1))}
                    className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={workstationIndex >= workstationProducts.length + 1 - itemsPerView}
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Accessories Banner */}
      <section className="pt-8 md:pt-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="bg-white rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <Banner
              desktopImage="/banners/Accessories banner.jpg"
              mobileImage="/banners/mob Accessories c.jpg"
              alt="Premium Accessories"
              height="250px"
            />
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4 relative">

          {/* Accessories Slider */}
          {!loading && !error && accessoryProducts.length > 0 && (
            <div className="relative px-8 sm:px-4">
              <div className="overflow-hidden rounded-xl -mx-2 sm:-mx-3">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${getTransformPercentage(accessoryIndex)}%)` }}
                >
                  {accessoryProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex-none px-2 sm:px-3"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                  {/* View All Card */}
                  <div
                    className="flex-none px-2 sm:px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <Link href="/products?category=accessories" className="block h-full">
                      <div className="bg-gradient-to-br from-[#6dc1c9] to-teal-700 rounded-xl p-6 h-full min-h-[400px] flex flex-col items-center justify-center text-white hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                          <ArrowRight className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">View All</h3>
                        <p className="text-white/80 text-sm text-center">Accessories</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              {(accessoryProducts.length + 1) > itemsPerView && (
                <>
                  <button
                    onClick={() => setAccessoryIndex(Math.max(0, accessoryIndex - 1))}
                    className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={accessoryIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setAccessoryIndex(Math.min(accessoryProducts.length + 1 - itemsPerView, accessoryIndex + 1))}
                    className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={accessoryIndex >= accessoryProducts.length + 1 - itemsPerView}
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section - Slider */}
      <section className="py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Customer Reviews
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
              See what our satisfied customers have to say
            </p>
          </div>

          {/* Reviews Slider */}
          <div className="relative px-8 sm:px-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${reviewIndex * (100 / reviewsPerView)}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-none px-2"
                    style={{ width: `${100 / reviewsPerView}%` }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition-all duration-300 border border-white/10 h-full">
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-300">5.0</span>
                      </div>
                      <p className="text-gray-200 mb-4 italic text-sm leading-relaxed line-clamp-3">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-gradient-to-r from-teal-400 to-[#6dc1c9] rounded-full mr-3 flex items-center justify-center text-white font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{testimonial.name}</h4>
                          <p className="text-gray-400 text-xs">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            {testimonials.length > reviewsPerView && (
              <>
                <button
                  onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={reviewIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setReviewIndex(Math.min(testimonials.length - reviewsPerView, reviewIndex + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={reviewIndex >= testimonials.length - reviewsPerView}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-6">
            <a
              href="https://g.page/r/CXHJJmG3XcUzEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Image src="/images/brands/chromebook-logo.svg" alt="Google" width={20} height={20} className="mr-2" />
              <span className="text-xs font-medium text-gray-300">
                4.9/5 rating based on 150+ Google reviews
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
