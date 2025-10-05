'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0); // First FAQ open by default

  const faqs = [
    {
      id: 0,
      question: "What types of laptops do you sell?",
      answer: "We deal in imported laptops from top brands like HP, Dell, Lenovo, and more. All units are in excellent condition and directly imported from international markets."
    },
    {
      id: 1,
      question: "Are your laptops brand new or refurbished?",
      answer: "We specialize in high-quality refurbished and used laptops that have been thoroughly tested and certified. All our laptops come with warranty and are in excellent working condition. We also have some brand new models available."
    },
    {
      id: 2,
      question: "Can I customize the laptop specifications?",
      answer: "Yes, we offer customization services for RAM and storage upgrades. You can upgrade your laptop's memory and add SSD storage to improve performance. Our technical team will help you choose the right specifications for your needs."
    },
    {
      id: 3,
      question: "Do you sell laptop accessories?",
      answer: "Absolutely! We have a wide range of laptop accessories including chargers, bags, external keyboards, mice, laptop stands, cooling pads, and more. All accessories are compatible with major laptop brands."
    },
    {
      id: 4,
      question: "What warranty do you provide?",
      answer: "We provide warranty on all our laptops ranging from 3 months to 1 year depending on the model and condition. The warranty covers hardware defects and functionality issues. Software-related issues are also covered in the first 30 days."
    },
    {
      id: 5,
      question: "Do you offer home delivery?",
      answer: "Yes, we offer free home delivery within Karachi. For other cities in Pakistan, we provide nationwide delivery through trusted courier services at minimal charges. All products are carefully packed to ensure safe delivery."
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including cash on delivery, bank transfers, JazzCash, EasyPaisa, and online banking. For corporate clients, we also accept cheque payments and can provide invoices."
    },
    {
      id: 7,
      question: "Can I return or exchange a laptop?",
      answer: "Yes, we have a 7-day return policy. If you're not satisfied with your purchase, you can return or exchange the laptop within 7 days of delivery. The laptop should be in original condition with all accessories."
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
                className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium"
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