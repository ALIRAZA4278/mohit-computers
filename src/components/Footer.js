'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const Footer = () => {
  return (
    <footer>
      {/* Features Bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#6dc1c9]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Fast Delivery</p>
                <p className="text-xs text-gray-400">Quick & Reliable Shipping</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#6dc1c9]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Secured Payment</p>
                <p className="text-xs text-gray-400">Shop with Confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-[#6dc1c9]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Easy Returns</p>
                <p className="text-xs text-gray-400">3 Days Return Policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Headphones className="w-5 h-5 text-[#6dc1c9]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Customer Support</p>
                <p className="text-xs text-gray-400">We&apos;re Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold text-[#6dc1c9] mb-2">Mohit Computers</h3>
              <p className="text-xs text-gray-400 mb-4">Your Trusted Tech Partner</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Suite No. 316-B, 3rd Floor, Regal Trade Square, Saddar, Karachi</p>
                <p>
                  <a href="tel:03368900349" className="hover:text-[#6dc1c9] transition-colors">0336-8900349</a>
                </p>
                <p>
                  <a href="tel:02132700706" className="hover:text-[#6dc1c9] transition-colors">Landline: 021-3270070-6</a>
                </p>
                <p>
                  <a href="mailto:info@mohitcomputers.pk" className="hover:text-[#6dc1c9] transition-colors">info@mohitcomputers.pk</a>
                </p>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products?category=used-laptop" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Laptops</Link></li>
                <li><Link href="/chromebook" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Chromebook</Link></li>
                <li><Link href="/products?category=ram" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">RAM</Link></li>
                <li><Link href="/products?category=ssd" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">SSD</Link></li>
                <li><Link href="/clearance" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Clearance</Link></li>
                <li><Link href="/workstation" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Workstation & Gaming</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">About Us</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Shop</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Blog</Link></li>
                <li><Link href="/corporate" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Corporate</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-[#6dc1c9] transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Business Hours</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Mon-Thu & Sat: 12:30 PM – 9:00 PM</p>
                <p>Friday: 2:00 PM – 9:00 PM</p>
                <p>Sunday: Closed</p>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#6dc1c9] hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#6dc1c9] hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#6dc1c9] hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#6dc1c9] hover:text-white transition-all"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-xs text-gray-500">
              © 2025 Mohit Computers. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
