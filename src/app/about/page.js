import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQSection from '../../components/FAQSection';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
              About Us
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Welcome to <span className="text-teal-600">Mohit Computers</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Where trust comes first and customer satisfaction is at the heart of everything we do.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-teal-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="w-16 h-1 bg-teal-600 rounded-full mb-6"></div>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                With over 19 years of experience in the laptop industry, Mohit Computers has grown from a small retail store into a trusted name in imported used laptops and accessories, not just across Pakistan, but globally as well. What sets us apart isn&rsquo;t just the products we offer, it&rsquo;s the relationships we build.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We proudly serve a diverse customer base, including individual buyers (B2C), resellers (B2B), wholesalers, and large-scale corporate clients across various industries. Our operations include direct imports of high-quality laptops and accessories from global markets.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-teal-50 rounded-xl">
                  <div className="text-2xl font-bold text-teal-600">19+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/hero/about-hero.svg"
                  alt="MOHIT COMPUTERS Office"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-teal-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Since 2005
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Trusted
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From a small retail store to a global technology partner - discover how we&apos;ve been shaping the future of technology access in Pakistan for nearly two decades.
              </p>
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-teal-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-teal-600 font-bold text-lg">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">The Beginning</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    The idea behind Mohit Computers was born at a time when technology was still new in Pakistan. Back then, there were few resources, limited access, and little awareness, but we saw the future.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold text-lg">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Building Trust</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    From our very first retail store, we worked hard to build trust, educate our customers, and meet their evolving needs. Over time, our journey led us into wholesale, then corporate supply, and eventually into direct importing.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-purple-600 font-bold text-lg">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Vision & Purpose</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    It hasn&rsquo;t been an easy road, but every step has been guided by our vision to become a bridge between people and technology. Today, that same passion continues to drive us forward with integrity and purpose.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 font-bold text-lg">4</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Global Reach</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We proudly serve a diverse customer base, including individual buyers (B2C), resellers (B2B), wholesalers, and large-scale corporate clients across various industries with authentic, reliable, and competitively priced products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence & Mission */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Global Presence & Mission</h2>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Connecting Pakistan to the world through trusted technology solutions
            </p>
            <div className="flex justify-center mt-6">
              <div className="w-24 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Global Presence */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-2xl font-bold">Global Presence</h3>
              </div>
              <p className="text-teal-100 leading-relaxed text-lg">
                Today, we&rsquo;re proud to say that our presence extends <strong className="text-white">beyond Pakistan</strong>, with operational roots in <strong className="text-white">UAE</strong> and <strong className="text-white">Canada</strong>. This international footprint allows us to source top-tier products and provide unmatched service and support to our growing customer base around the world.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Pakistan</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">UAE</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Canada</span>
              </div>
            </div>

            {/* Our Mission */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-teal-100 leading-relaxed text-lg">
                We are more motivated than ever to meet the evolving tech needs of our region. As we grow, our mission remains clear: to help shape a stronger, tech-savvy future for Pakistan by making authentic technology accessible, affordable, and trusted for everyone.
              </p>
              <div className="mt-6">
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="text-white font-medium">
                    &ldquo;Bridging the gap between people and technology&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Mohit Computers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
              Why Choose Us
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Mohit Computers?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover what makes us the trusted choice for technology solutions across Pakistan and beyond
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">19+ Years Experience</h3>
                    <p className="text-gray-600">Established in 2005, with over 19 years of proven industry experience</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Direct Importer</h3>
                    <p className="text-gray-600">Direct importer of original laptops and accessories</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Diverse Clientele</h3>
                    <p className="text-gray-600">Serving B2C, B2B, and corporate clients</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Global Presence</h3>
                    <p className="text-gray-600">Trusted presence in Pakistan, UAE, and Canada</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Complete Support</h3>
                    <p className="text-gray-600">Personalized service, after-sales support, and nationwide delivery</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Customer First</h3>
                    <p className="text-gray-600">Committed to putting customer needs and satisfaction first</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-100">
                <p className="text-gray-800 font-medium text-lg text-center">
                  &ldquo;At Mohit Computers, we don&rsquo;t just sell laptops, we help people and businesses move forward through trusted technology.&rdquo;
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/about/quality-laptops.svg"
                  alt="MOHIT COMPUTERS Laptops"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Quality
              </div>
              <div className="absolute -bottom-4 -left-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Trusted
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
              className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
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