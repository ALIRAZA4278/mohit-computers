'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, testimonials } from '../lib/data';

export default function Home() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [newArrivalIndex, setNewArrivalIndex] = useState(0);
  const [workstationIndex, setWorkstationIndex] = useState(0);
  const [accessoryIndex, setAccessoryIndex] = useState(0);

  const featuredProducts = products.filter(product => product.featured);
  const newArrivalProducts = products.slice(8, 16); // Assuming newer products
  const workstationProducts = products.filter(product => product.category === 'used-laptop');
  const accessoryProducts = products.filter(product => product.category === 'accessories');

  // Auto-slide effect for featured products (right to left)
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % Math.max(1, featuredProducts.length - 4));
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  // Auto-slide effect for new arrivals
  useEffect(() => {
    const interval = setInterval(() => {
      setNewArrivalIndex((prev) => (prev + 1) % Math.max(1, newArrivalProducts.length - 4));
    }, 3500);
    return () => clearInterval(interval);
  }, [newArrivalProducts.length]);

  // Auto-slide effect for workstation
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkstationIndex((prev) => (prev + 1) % Math.max(1, workstationProducts.length - 4));
    }, 4000);
    return () => clearInterval(interval);
  }, [workstationProducts.length]);

  // Auto-slide effect for accessories
  useEffect(() => {
    const interval = setInterval(() => {
      setAccessoryIndex((prev) => (prev + 1) % Math.max(1, accessoryProducts.length - 4));
    }, 4500);
    return () => clearInterval(interval);
  }, [accessoryProducts.length]);

  return (
    <div>
      {/* Landing Page - Hero Section */}
            {/* Landing Page - Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
                Premium <span className="text-teal-600">Refurbished</span> Laptops
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-600 leading-relaxed">
                Quality certified laptops with warranty. Experience professional performance at unbeatable prices with our comprehensive quality guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link 
                  href="/products" 
                  className="bg-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-700 transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Shop Now <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link 
                  href="/about" 
                  className="border-2 border-teal-600 text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-600 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/next.png"
                  alt="Premium Laptop"
                  width={500}
                  height={350}
                  className="rounded-lg w-full h-auto"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Best Price
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Warranty
              </div>
            </div>
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
                <Image src="/next.svg" alt="HP" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">HP</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/next.svg" alt="Dell" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">Dell</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/next.svg" alt="Acer" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">Acer</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/next.svg" alt="Lenovo" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">Lenovo</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/next.svg" alt="Chromebook" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">Chromebook</p>
              </div>
            </div>
            <div className="group flex justify-center items-center p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-white">
              <div className="text-center">
                <Image src="/next.svg" alt="Accessories" width={60} height={45} className="grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">Accessories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Banner */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Featured Products</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Discover our handpicked collection of premium refurbished laptops, 
            carefully selected for their exceptional performance and value
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out gap-6"
                style={{ transform: `translateX(-${featuredIndex * 25}%)` }}
              >
                {featuredProducts.map((product) => (
                  <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setFeaturedIndex(Math.max(0, featuredIndex - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              onClick={() => setFeaturedIndex(Math.min(featuredProducts.length - 4, featuredIndex + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* New Arrival Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Just Added
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">New Arrivals</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Discover the latest additions to our carefully curated collection of premium refurbished laptops
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* New Arrival Products Slider */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out gap-6"
                style={{ transform: `translateX(-${newArrivalIndex * 25}%)` }}
              >
                {newArrivalProducts.map((product) => (
                  <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <div className="relative">
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          NEW
                        </div>
                      </div>
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setNewArrivalIndex(Math.max(0, newArrivalIndex - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              onClick={() => setNewArrivalIndex(Math.min(newArrivalProducts.length - 4, newArrivalIndex + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Workstation Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
            Professional Grade
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Workstation Collection</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            High-performance laptops engineered for demanding professional workflows, 
            creative projects, and intensive computing tasks
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Workstation Products Slider */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out gap-6"
                style={{ transform: `translateX(-${workstationIndex * 25}%)` }}
              >
                {workstationProducts.map((product) => (
                  <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <div className="relative">
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          PRO
                        </div>
                      </div>
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setWorkstationIndex(Math.max(0, workstationIndex - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              onClick={() => setWorkstationIndex(Math.min(workstationProducts.length - 4, workstationIndex + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
              Essential Add-ons
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Premium Accessories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your computing experience with our carefully selected range of high-quality accessories 
              designed to complement your laptop perfectly
            </p>
          </div>
          
          {/* Accessories Slider */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out gap-6"
                style={{ transform: `translateX(-${accessoryIndex * 25}%)` }}
              >
                {accessoryProducts.map((product) => (
                  <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setAccessoryIndex(Math.max(0, accessoryIndex - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              onClick={() => setAccessoryIndex(Math.min(accessoryProducts.length - 4, accessoryIndex + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link 
              href="/products?category=accessories"
              className="inline-flex items-center px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
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
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg">
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
              <Image src="/next.svg" alt="Google" width={24} height={24} className="mr-3" />
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
