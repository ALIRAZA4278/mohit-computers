'use client';
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

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
      {/* Page Header */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Get in Touch</h2>

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
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9] text-sm sm:text-base"
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
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9] text-sm sm:text-base"
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
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9] text-sm sm:text-base"
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
                    className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9] text-sm sm:text-base resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6dc1c9] text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="mt-8 lg:mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6"></h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                We&rsquo;re here to help! Whether you have a question, need support, or want to share feedback, feel free to reach out — our team is always ready to assist you.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="bg-[#6dc1c9]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#6dc1c9]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">📍 Store Location</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Suite No. 316-B, 3rd Floor, Regal Trade Square, Saddar, Karachi<br />
                      <span className="text-xs sm:text-sm text-gray-500">(Just opposite the lift, near Skin / Chamra Hospital)</span>
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">☎️ Phone / WhatsApp Support</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Mobile / WhatsApp: <a href="tel:03368900349" className="text-[#6dc1c9] hover:underline">0336-8900349</a><br />
                      Landline: <a href="tel:02132700706" className="text-[#6dc1c9] hover:underline">021-3270070-6</a>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Available during business hours:<br />
                      Monday to Thursday & Saturday: 12:30 PM – 9:00 PM<br />
                      Friday: 2:00 PM – 9:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">📧 Email Us</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      General Support: <a href="mailto:supports@mohitcomputers.pk" className="text-[#6dc1c9] hover:underline">supports@mohitcomputers.pk</a>
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Corporate/Bulk Orders: <a href="mailto:corporate@mohitcomputers.pk" className="text-[#6dc1c9] hover:underline">corporate@mohitcomputers.pk</a>
                    </p>
                  </div>
                </div>

                {/* Warranty Help */}
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">📦 Need Help with an Order or Warranty?</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      If you&rsquo;re facing any issue with a recent purchase, please include your Invoice Number or Order Reference when contacting us for faster service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Find Us on Map</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Visit our store at Regal Trade Square, Saddar, Karachi. We&rsquo;re conveniently located opposite the lift, near Skin Hospital.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative w-full h-64 sm:h-96 lg:h-[450px] rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d452.5112864214508!2d67.02374982740054!3d24.860765600000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d5d17c9e1%3A0x53e76be30a899943!2s28%20Regal%20Chowk%2C%20Saddar%20Karachi%2C%2074400%2C%20Pakistan!5e0!3m2!1sen!2s!4v1761234419203!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{border: 0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mohit Computers Location - Regal Trade Square, Saddar, Karachi"
                >
                </iframe>
              </div>
              
              {/* Map Info */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">📍 Exact Address:</h4>
                    <p className="text-gray-600">
                      Suite No. 316-B, 3rd Floor<br />
                      Regal Trade Square, Saddar<br />
                      Karachi, Pakistan
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">🕒 Business Hours:</h4>
                    <p className="text-gray-600">
                      Mon-Thu & Sat: 12:30 PM – 9:00 PM<br />
                      Friday: 2:00 PM – 9:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 sm:py-16 bg-gradient-to-r from-[#6dc1c9] to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">✅ We&rsquo;re Here Because You Matter</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">
            At Mohit Computers, we don&rsquo;t just deal in laptops and Accessories, we build long-term relationships through trusted products, reliable support, and personalized service.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <a
              href="tel:03368900349"
              className="bg-white text-teal-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Call: 0336-8900349
            </a>
            <a
              href="mailto:supports@mohitcomputers.pk"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-700 transition-colors text-sm sm:text-base"
            >
              Email: supports@mohitcomputers.pk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}