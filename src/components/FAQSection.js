'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0); // First FAQ open by default

  const faqs = [
    {
      id: 0,
      category: "Products & Quality",
      question: "What types of laptops do you sell?",
      answer: "We deal in imported laptops from top brands like HP, Dell, Lenovo, and more. All units are in excellent condition and directly imported from international markets."
    },
    {
      id: 1,
      category: "Products & Quality",
      question: "Are your laptops brand new or refurbished?",
      answer: "Our laptops are not refurbished. These are fresh-condition imported laptops that have not been used in Pakistan."
    },
    {
      id: 2,
      category: "Products & Quality",
      question: "Can I customize the laptop specifications?",
      answer: "Yes! Share your requirements with us, and we'll help you find the best match according to your needs and budget."
    },
    {
      id: 3,
      category: "Products & Quality",
      question: "Do you sell laptop accessories?",
      answer: "Yes, we offer a wide range of laptop accessories, including chargers, bags, webcams, and more."
    },
    {
      id: 4,
      category: "Warranty & Returns",
      question: "What kind of warranty do you offer?",
      answer: "We provide a 15-day checking warranty with a minimum battery backup guarantee of 1.5 hours. Note: Issues like screen/display damage, physical damage, liquid/burn damage, keyboard, and speaker faults are not covered under warranty."
    },
    {
      id: 5,
      category: "Warranty & Returns",
      question: "Can I return or exchange my order?",
      answer: "Yes, returns and exchanges are accepted within 3 days, even in case of a change of mind, provided the product is in its original condition with complete packaging. We want you to be fully satisfied with your purchase."
    },
    {
      id: 6,
      category: "Warranty & Returns",
      question: "What if my laptop has a problem after purchase?",
      answer: "You can contact our support team at 0336-8900349. If the issue is covered under warranty, we will repair or replace the unit as appropriate."
    },
    {
      id: 7,
      category: "Business & Bulk Deals",
      question: "Do you offer bulk purchases or business deals?",
      answer: "Yes, we provide wholesale rates and special discounts for resellers, institutions, and corporate clients."
    },
    {
      id: 8,
      category: "Business & Bulk Deals",
      question: "Can I trade in or sell my own laptop?",
      answer: "No, we do not purchase or exchange laptops from customers. Our focus is on reliable, imported used laptops only."
    },
    {
      id: 9,
      category: "Pricing & Promotions",
      question: "Do you offer any discounts or deals?",
      answer: "Absolutely! We run weekly and monthly deals on our website, as well as special promotions during festive seasons and public holidays to make tech more affordable."
    },
    {
      id: 10,
      category: "Pricing & Promotions",
      question: "Are your prices the lowest in the market?",
      answer: "Since 2005, our mission has been to make technology affordable and accessible for everyone in Pakistan. We strive to offer the most competitive pricing. If you feel our prices can be improved, please reach out — we'll do our best to assist based on your request."
    },
    {
      id: 11,
      category: "Company Info & Contact",
      question: "Is Mohit Computers reliable?",
      answer: "We've been serving the market since 2005, with thousands of satisfied customers across Pakistan. Many of our first-time buyers become repeat customers and part of our extended family. We prioritize customer trust, product quality, and long-term satisfaction over just making a sale."
    },
    {
      id: 12,
      category: "Company Info & Contact",
      question: "Where is your store located?",
      answer: "You can visit us at: Suite No. 316-B, 3rd Floor, Regal Trade Square, Saddar, Karachi (Just opposite the lift, near Skin Hospital/Chamra Hospital)"
    },
    {
      id: 13,
      category: "Company Info & Contact",
      question: "How can I contact you?",
      answer: "📞 0336-8900349 | 📧 supports@mohitcomputers.pk"
    },
    {
      id: 14,
      category: "Company Info & Contact",
      question: "Can I send complaints or suggestions?",
      answer: "Yes, we're always happy to hear from you. Please call or email us directly, and our team will respond promptly to assist you."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? -1 : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            FREQUENTLY <span className="text-teal-500">ASK QUESTION</span>
          </h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-8"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            WHY CHOOSE MOHIT COMPUTERS?
          </h3>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-200 ${
                  openFAQ === faq.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <div className="ml-4 flex-shrink-0">
                  {openFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Answer Content */}
              {openFAQ === faq.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can&rsquo;t find the answer you&rsquo;re looking for? Our friendly customer support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:03368900349"
                className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-[#6dc1c9] transition-colors font-medium"
              >
                Call us: 0336 8900349
              </a>
              <a
                href="mailto:info@mohitcomputers.pk"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Email us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;