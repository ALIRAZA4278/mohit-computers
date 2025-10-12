'use client';
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import Banner from '../../components/Banner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Thank you for contacting us! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <Banner
        desktopImage="/banners/contact banner.jpg"
        mobileImage="/banners/contact mobile banner.jpg"
        alt="Contact Us"
        height="400px"
        priority={true}
      />

      {/* Contact Information */}
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send us a Message</h2>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="mt-8 lg:mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                We&rsquo;d love to hear from you. Choose the best way to reach us and we&rsquo;ll respond as soon as possible.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Visit Our Store</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Suite No. 316-B, 3rd Floor, Regal Trade Square, Saddar, Karachi
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Call Us</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      0336-8900349<br />
                      021-3270070-6
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Email Us</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      info@mohitcomputers.pk
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Business Hours</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Monday to Thursday &amp; Saturday: 12:00 PM – 9:00 PM<br />
                      Friday: 2:00 PM – 9:00 PM
                    </p>
                  </div>
                </div>

                {/* Live Chat */}
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Live Chat</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Chat with our experts in real-time<br />
                      Available: Monday - Saturday, 10 AM - 8 PM
                    </p>
                    <button className="mt-2 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 transition-colors">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
   

      {/* Call to Action */}
      <section className="py-8 sm:py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Still Have Questions?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Our expert team is here to help you make the right choice
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <a 
              href="tel:+923368900349"
              className="bg-yellow-400 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-sm sm:text-base"
            >
              Call Now: +92 336 8900349
            </a>
            <a 
              href="mailto:info@mohitcomputers.pk"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors text-sm sm:text-base"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}