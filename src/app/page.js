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
      setHeroIndex((prev) => (prev + 1) % heroBanners.length);
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
      } else if (window.innerWidth < 768) {
        setItemsPerView(2); // Small tablets
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablets
      } else {
        setItemsPerView(4); // Desktop
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

  const featuredProducts = products.filter(product => product.is_featured);
  const newArrivalProducts = products.slice(0, 8); // Latest 8 products - all categories
  const workstationProducts = products.filter(product => product.category_id === 'workstation');
  const accessoryProducts = products.filter(product => product.category_id === 'accessories');

  // Calculate max index for each carousel
  const getMaxIndex = (productCount) => Math.max(0, productCount - itemsPerView);

  // Calculate transform percentage based on items per view
  const getTransformPercentage = (index) => {
    const slideWidth = 100 / itemsPerView;
    return index * slideWidth;
  };

  return (
    <div>
      {/* Landing Page - Hero Section with Carousel */}
      <section className="relative">
        <div className="relative">
          {/* Hero Banners Carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${heroIndex * 100}%)` }}
            >
              {heroBanners.map((banner, index) => (
                <div key={index} className="min-w-full">
                  <Banner
                    desktopImage={banner.desktop}
                    mobileImage={banner.mobile}
                    alt={`Hero Banner ${index + 1}`}
                    height="500px"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={() => setHeroIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => setHeroIndex((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === heroIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
            {/* Brand Logos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Trusted Brands</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              We partner with leading technology brands to bring you quality refurbished laptops and accessories
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/images/brands/hp-logo.svg" alt="HP" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#6dc1c9] transition-colors">HP</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/images/brands/dell-logo.svg" alt="Dell" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#6dc1c9] transition-colors">Dell</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/images/brands/acer-logo.svg" alt="Acer" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#6dc1c9] transition-colors">Acer</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/images/brands/lenovo-logo.svg" alt="Lenovo" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#6dc1c9] transition-colors">Lenovo</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/images/brands/chromebook-logo.svg" alt="Chromebook" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#6dc1c9] transition-colors">Chromebook</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/images/brands/accessories-logo.svg" alt="Accessories" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#6dc1c9] transition-colors">Accessories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Banner */}
      <section className="relative overflow-hidden">
        <Banner
          desktopImage="/banners/feature c.jpg"
          mobileImage="/banners/feature c.jpg"
          alt="Featured Products"
          height="300px"
        />
      </section>

      {/* Featured Products Slider */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6dc1c9]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg mb-4">Error loading products: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700"
              >
                Retry
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No featured products available at the moment.</p>
            </div>
          ) : (
              <div className="relative px-8 sm:px-4">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
                    style={{ transform: `translateX(-${getTransformPercentage(featuredIndex)}%)` }}
                  >
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
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
      <section className="relative overflow-hidden">
        <Banner
          desktopImage="/banners/Newarrival banner.jpg"
          mobileImage="/banners/Newarrival banner.jpg"
          alt="New Arrivals"
          height="300px"
        />
      </section>

      {/* New Arrival Products Slider */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {!loading && !error && newArrivalProducts.length > 0 && (
            <div className="relative px-8 sm:px-4">
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
                  style={{ transform: `translateX(-${getTransformPercentage(newArrivalIndex)}%)` }}
                >
                  {newArrivalProducts.map((product) => (
                    <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
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
      <section className="relative overflow-hidden">
        <Banner
          desktopImage="/banners/Work station banner.jpg"
          mobileImage="/banners/Work station banner.jpg"
          alt="Workstation Collection"
          height="300px"
        />
      </section>

      {/* Workstation Products Slider */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {!loading && !error && workstationProducts.length > 0 && (
            <div className="relative px-8 sm:px-4">
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
                  style={{ transform: `translateX(-${getTransformPercentage(workstationIndex)}%)` }}
                >
                  {workstationProducts.map((product) => (
                    <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              {workstationProducts.length > itemsPerView && (
                <>
                  <button
                    onClick={() => setWorkstationIndex(Math.max(0, workstationIndex - 1))}
                    className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={workstationIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setWorkstationIndex(Math.min(getMaxIndex(workstationProducts.length), workstationIndex + 1))}
                    className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={workstationIndex >= getMaxIndex(workstationProducts.length)}
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
      <section className="relative overflow-hidden">
        <Banner
          desktopImage="/banners/Accessories banner.jpg"
          mobileImage="/banners/Accessories banner.jpg"
          alt="Premium Accessories"
          height="300px"
        />
      </section>

      {/* Accessories Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <div className="container mx-auto px-4 relative">
          
          {/* Accessories Slider */}
          {!loading && !error && accessoryProducts.length > 0 && (
            <div className="relative px-8 sm:px-4">
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
                  style={{ transform: `translateX(-${getTransformPercentage(accessoryIndex)}%)` }}
                >
                  {accessoryProducts.map((product) => (
                    <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              {accessoryProducts.length > itemsPerView && (
                <>
                  <button
                    onClick={() => setAccessoryIndex(Math.max(0, accessoryIndex - 1))}
                    className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={accessoryIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setAccessoryIndex(Math.min(getMaxIndex(accessoryProducts.length), accessoryIndex + 1))}
                    className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-white shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={accessoryIndex >= getMaxIndex(accessoryProducts.length)}
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          )}

          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link 
              href="/products?category=accessories"
              className="inline-flex items-center px-8 py-3 bg-[#6dc1c9] text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              View All Accessories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Customer Reviews
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don&apos;t just take our word for it - see what our satisfied customers have to say about their experience with Mohit Computers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-300">5.0</span>
                </div>
                <p className="text-gray-200 mb-6 italic text-lg leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-[#6dc1c9] rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <Image src="/images/brands/chromebook-logo.svg" alt="Google" width={24} height={24} className="mr-3" />
              <span className="text-sm font-medium text-gray-300">
                4.9/5 rating based on 150+ Google reviews
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
