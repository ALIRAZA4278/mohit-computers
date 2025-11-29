'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Laptop, HardDrive, MemoryStick, Monitor, Tag, Briefcase } from 'lucide-react';

const CategorySwitcher = ({ currentCategory }) => {
  const [laptopDropdownOpen, setLaptopDropdownOpen] = useState(false);

  const categories = [
    {
      id: 'laptop',
      name: 'Laptops',
      icon: Laptop,
      href: '/products?category=used-laptop',
      hasDropdown: true,
      subcategories: [
        { name: 'All Laptops', href: '/products?category=used-laptop' },
        { name: 'Workstation & Gaming', href: '/workstation' },
        { name: 'Rugged Laptops', href: '/products?category=rugged-laptop' },
      ]
    },
    {
      id: 'chromebook',
      name: 'Chromebook',
      icon: Monitor,
      href: '/chromebook',
      hasDropdown: false
    },
    {
      id: 'ram',
      name: 'RAM',
      icon: MemoryStick,
      href: '/products?category=ram',
      hasDropdown: false
    },
    {
      id: 'ssd',
      name: 'SSD',
      icon: HardDrive,
      href: '/products?category=ssd',
      hasDropdown: false
    },
    {
      id: 'clearance',
      name: 'Clearance',
      icon: Tag,
      href: '/clearance',
      hasDropdown: false
    },
    {
      id: 'corporate',
      name: 'Corporate',
      icon: Briefcase,
      href: '/corporate',
      hasDropdown: false
    },
  ];

  const isActive = (categoryId) => {
    if (currentCategory === categoryId) return true;
    if (categoryId === 'laptop' && (currentCategory === 'used-laptop' || currentCategory === 'workstation' || currentCategory === 'rugged-laptop')) return true;
    return false;
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[60px] z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = isActive(category.id);

            if (category.hasDropdown) {
              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setLaptopDropdownOpen(true)}
                  onMouseLeave={() => setLaptopDropdownOpen(false)}
                >
                  <button
                    onClick={() => setLaptopDropdownOpen(!laptopDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#6dc1c9] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                    <ChevronDown className={`w-3 h-3 transition-transform ${laptopDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {laptopDropdownOpen && (
                    <div
                      className="absolute top-full left-0 pt-1 z-50"
                    >
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] py-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#6dc1c9]/10 hover:text-[#6dc1c9] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={category.id}
                href={category.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#6dc1c9] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategorySwitcher;
