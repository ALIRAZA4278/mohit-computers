import React from 'react';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import FAQSection from '../../components/FAQSection';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">WELCOME TO MOHIT COMPUTERS</h1>
            <p className="text-xl lg:text-2xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
              where trust comes first and customer satisfaction is at the heart of everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Welcome Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                With over 19 years of experience in the laptop industry, Mohit Computers has grown from a small retail store into a trusted name in imported used laptops and accessories, not just across Pakistan, but globally as well. What sets us apart isn&rsquo;t just the products we offer, it&rsquo;s the relationships we build. For us, it&rsquo;s never just about selling a laptop; it&rsquo;s about understanding your needs and helping you find the right fit, with honesty, clarity, and care.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                We proudly serve a diverse customer base, including individual buyers (B2C), resellers (B2B), wholesalers, and large-scale corporate clients across various industries. Our operations include direct imports of high-quality laptops and accessories from global markets, ensuring that every item you purchase is authentic, reliable, and competitively priced.
              </p>
            </div>
            <div className="relative">
              <div className="bg-teal-50 rounded-2xl p-8">
                <Image
                  src="/next.png"
                  alt="MOHIT COMPUTERS Office"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">OUR JOURNEY</h2>
            
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                The idea behind Mohit Computers was born at a time when technology was still new in Pakistan. Back then, there were few resources, limited access, and little awareness, but we saw the future.
              </p>
              
              <p>
                We started with a simple mission: to introduce and expand access to technology in the local market. From our very first retail store, we worked hard to build trust, educate our customers, and meet their evolving needs. Over time, our journey led us into wholesale, then corporate supply, and eventually into direct importing, enabling us to offer even better value and a wider range of products nationwide.
              </p>
              
              <p>
                It hasn&rsquo;t been an easy road, but every step has been guided by our vision to become a bridge between people and technology. Today, that same passion continues to drive us forward with integrity and purpose.
              </p>
              
              <p>
                We proudly serve a diverse customer base, including individual buyers (B2C), resellers (B2B), wholesalers, and large-scale corporate clients across various industries. Our operations include direct imports of high-quality laptops and accessories from global markets, ensuring that every item you purchase is authentic, reliable, and competitively priced.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Global Presence */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">GLOBAL PRESENCE</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Today, we&rsquo;re proud to say that our presence extends <strong>beyond Pakistan</strong>, with operational roots in <strong>UAE</strong> and <strong>Canada</strong>. This international footprint allows us to source top-tier products and provide unmatched service and support to our growing customer base around the world.
              </p>
            </div>

            {/* Our Mission */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">OUR MISSION</h3>
              <p className="text-gray-700 leading-relaxed">
                We are more motivated than ever to meet the evolving tech needs of our region. As we grow, our mission remains clear: to help shape a stronger, tech-savvy future for Pakistan by making authentic technology accessible, affordable, and trusted for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Mohit Computers */}
      <section className="py-16 bg-teal-500">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">WHY CHOOSE MOHIT COMPUTERS?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-800 mt-1 flex-shrink-0" />
                  <span className="text-gray-800">Established in 2005, with over 19 years of proven industry experience</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-800 mt-1 flex-shrink-0" />
                  <span className="text-gray-800">Direct importer of original laptops and accessories</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-800 mt-1 flex-shrink-0" />
                  <span className="text-gray-800">Serving B2C, B2B, and corporate clients</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-800 mt-1 flex-shrink-0" />
                  <span className="text-gray-800">Trusted presence in Pakistan, UAE, and Canada</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-800 mt-1 flex-shrink-0" />
                  <span className="text-gray-800">Personalized service, after-sales support, and nationwide delivery</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-800 mt-1 flex-shrink-0" />
                  <span className="text-gray-800">Committed to putting customer needs and satisfaction first</span>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white bg-opacity-20 rounded-lg">
                <p className="text-gray-800 font-medium text-lg">
                  At Mohit Computers, we don&rsquo;t just sell laptops, we help people and businesses move forward through trusted technology.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white bg-opacity-20 rounded-2xl p-8">
                <Image
                  src="/next.png"
                  alt="MOHIT COMPUTERS Laptops"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action */}
     
    </div>
  );
}