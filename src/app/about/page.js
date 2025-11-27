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

      {/* About Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">About Us</h2>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Welcome to Mohit Computers — a name built on trust, quality, and customer-first values.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                With nearly two decades of expertise in the laptop industry, Mohit Computers has evolved from a small retail outlet into a reputable global provider of imported, top-grade used laptops and accessories. Our journey is defined not only by the products we offer but by the long-lasting relationships we build with our customers. For us, it&rsquo;s never just a transaction, it&rsquo;s about understanding your requirements and guiding you toward the perfect solution with transparency, integrity, and genuine care.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We proudly serve a wide and diverse clientele, including individual customers (B2C), resellers (B2B), wholesalers, and corporate organizations across multiple sectors. By directly importing premium laptops and accessories from trusted international markets, we ensure that every product you receive is authentic, reliable, and competitively priced.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Mohit Computers, we are committed to delivering value, performance, and trust - every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Mohit Computers began at a time when technology was still emerging in Pakistan. Resources were scarce, access was limited, and awareness was minimal — but we recognized the potential and embraced the future before it arrived.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our mission was simple: to make technology accessible to everyone. From the very first retail store, we focused on building trust, guiding customers, and responding to their changing needs. As demand grew, our journey expanded from retail to wholesale, then to corporate supply, and eventually to direct importing. Each phase strengthened our ability to deliver greater value, better quality, and a broader range of products across the country.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                The journey has not been without challenges, but our vision has remained constant: to serve as a dependable link between people and technology. Today, that same commitment continues to guide us, strengthened by integrity, passion, and purpose.
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
                We are driven by a renewed commitment to meet the evolving technological needs of our region. As we continue to grow, our mission remains unwavering — to contribute to a stronger, more tech-empowered Pakistan by ensuring that authentic, reliable, and affordable technology is accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Competitive Edge */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Competitive Edge</h2>
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Established in 2005, backed by over 19 years of trusted industry experience</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Direct importer of authentic, top-quality laptops and accessories</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Serving a diverse clientele including B2C, B2B, and corporate sectors</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Recognized and trusted across Pakistan, the UAE, and Canada</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Offering personalized customer service, reliable after-sales support, and nationwide delivery</p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#6dc1c9] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">Driven by a commitment to customer satisfaction, transparency, and long-term value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Corporate Tech Solutions</h2>
            <p className="text-[#6dc1c9] text-xl font-medium mb-8">by Mohit Computers</p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We specialize in meeting the complex demands of corporate technology procurement, providing customized, reliable, and efficient solutions that align with your organizational needs.
            </p>
            <div className="mt-8">
              <Link
                href="/corporate"
                className="bg-[#6dc1c9] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors duration-300 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
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