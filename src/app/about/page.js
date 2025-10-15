import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQSection from '../../components/FAQSection';
import Banner from '../../components/Banner';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <Banner
        desktopImage="/banners/about banner.jpg"
        mobileImage="/banners/about banner.jpg"
        alt="About Mohit Computers"
        height="400px"
        priority={true}
      />

      {/* Welcome Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="w-16 h-1 bg-[#6dc1c9] rounded-full mb-6"></div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About Us</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Welcome to Mohit Computers, where trust comes first and customer satisfaction is at the heart of everything we do.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  With over 19 years of experience in the laptop industry, Mohit Computers has grown from a small retail store into a trusted name in imported used laptops and accessories, not just across Pakistan, but globally as well. What sets us apart isn&rsquo;t just the products we offer, it&rsquo;s the relationships we build. For us, it&rsquo;s never just about selling a laptop; it&rsquo;s about understanding your needs and helping you find the right fit, with honesty, clarity, and care.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We proudly serve a diverse customer base, including individual buyers (B2C), resellers (B2B), wholesalers, and large-scale corporate clients across various industries. Our operations include direct imports of high-quality laptops and accessories from global markets, ensuring that every item you purchase is authentic, reliable, and competitively priced.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/images/hero/about-hero.svg"
                alt="MOHIT COMPUTERS Office"
                width={500}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                The idea behind Mohit Computers was born at a time when technology was still new in Pakistan. Back then, there were few resources, limited access, and little awareness, but we saw the future.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We started with a simple mission: to introduce and expand access to technology in the local market. From our very first retail store, we worked hard to build trust, educate our customers, and meet their evolving needs. Over time, our journey led us into wholesale, then corporate supply, and eventually into direct importing, enabling us to offer even better value and a wider range of products nationwide.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                It hasn&rsquo;t been an easy road, but every step has been guided by our vision to become a bridge between people and technology. Today, that same passion continues to drive us forward with integrity and purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence & Mission */}
      <section className="py-20 bg-gradient-to-r from-[#6dc1c9] to-teal-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Global Presence</h2>
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-white/30 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12">
              <p className="text-white leading-relaxed text-lg mb-4">
                Today, we&rsquo;re proud to say that our presence extends beyond Pakistan, with operational roots in UAE and Canada. This international footprint allows us to source top-tier products and provide unmatched service and support to our growing customer base around the world.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">Pakistan</span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">UAE</span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">Canada</span>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Mission</h2>
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-white/30 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <p className="text-white leading-relaxed text-lg text-center">
                We are more motivated than ever to meet the evolving tech needs of our region. As we grow, our mission remains clear: to help shape a stronger, tech-savvy future for Pakistan by making authentic technology accessible, affordable, and trusted for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Mohit Computers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Mohit Computers?</h2>
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Established in 2005, with over 19 years of proven industry experience</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Direct importer of original laptops and accessories</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Serving B2C, B2B, and corporate clients</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Trusted presence in Pakistan, UAE, and Canada</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Personalized service, after-sales support, and nationwide delivery</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Committed to putting customer needs and satisfaction first</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-gray-800 font-semibold text-xl text-center">
                  At Mohit Computers, we don&rsquo;t just sell laptops, we help people and businesses move forward through trusted technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <FAQSection />
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust Mohit Computers for their technology needs. 
            Let us help you find the perfect laptop solution today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-[#6dc1c9] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Browse Products
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors duration-300 inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
     
    </div>
  );
}