'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Shield, RotateCcw, Headphones, Phone, Mail, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      {/* Features Section */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fast Delivery */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#6dc1c9]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Experience Lightning-Fast Delivery</p>
              </div>
            </div>

            {/* Secured Payment */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Secured Payment</h3>
                <p className="text-gray-600 text-sm">Shop with Confidence</p>
              </div>
            </div>

            {/* Money Back */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-[#6dc1c9]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Money Back</h3>
                <p className="text-gray-600 text-sm">100% Money-Back Guarantee</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">24/7 Support</h3>
                <p className="text-gray-600 text-sm">Always Here for You</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About The Shop */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">About The Shop</h3>
            <div className="space-y-3 text-gray-600">
              <p className="text-sm">
                <strong>Address:</strong> Suite No. 316-B, Regal Trade Square, Saddar, Karachi
              </p>
              
              <div className="pt-4">
                <p className="font-semibold text-gray-800 mb-2">Got Question? Call us 24/7</p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#6dc1c9]" />
                  </div>
                  <a href="tel:03368900349" className="text-[#6dc1c9] font-semibold">
                    0336 8900349
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-bold text-[#6dc1c9] text-lg mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=used-laptop" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Laptop
                </Link>
              </li>
              <li>
                <Link href="/products?category=used-laptop" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Used Laptop
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  New Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Laptop Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=chromebook" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Chrome Book
                </Link>
              </li>
              <li>
                <Link href="/products?category=ram" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  RAM
                </Link>
              </li>
              <li>
                <Link href="/products?category=ssd" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  SSD
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-[#6dc1c9] text-lg mb-4">Quick links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Corporate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-[#6dc1c9] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-[#6dc1c9] text-lg mb-4">Contact Info</h3>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mt-1">
                  <Phone className="w-4 h-4 text-[#6dc1c9]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Phone</p>
                  <a href="tel:03368900349" className="text-gray-600 hover:text-[#6dc1c9] transition-colors text-sm">
                    0336 8900349
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mt-1">
                  <Mail className="w-4 h-4 text-[#6dc1c9]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <a href="mailto:info@mohitcomputers.pk" className="text-gray-600 hover:text-[#6dc1c9] transition-colors text-sm">
                    info@mohitcomputers.pk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              2025 © Mohit computers. All Rights Reserved
            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-teal-500 text-white rounded-lg flex items-center justify-center hover:bg-[#6dc1c9] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-teal-500 text-white rounded-lg flex items-center justify-center hover:bg-[#6dc1c9] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-teal-500 text-white rounded-lg flex items-center justify-center hover:bg-[#6dc1c9] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.138-.93c-.74-.838-1.066-1.822-1.179-2.584h3.708V0H15.91c0 .706.022 7.66.022 7.66v7.34c0 3.096-2.524 5.62-5.62 5.62s-5.62-2.524-5.62-5.62 2.524-5.62 5.62-5.62c.832 0 1.614.198 2.31.548v-3.826a9.328 9.328 0 0 0-2.31-.298C4.694 5.804 0 10.498 0 16.216s4.694 10.412 10.412 10.412 10.412-4.694 10.412-10.412V8.539c1.186.838 2.632 1.332 4.176 1.332V6.613c-1.624 0-3.086-.674-4.176-1.774l-.013-.013z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;