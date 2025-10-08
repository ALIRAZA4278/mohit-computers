'use client';

import React from 'react';
import { User, Settings, Package, Heart, FileText, LogOut } from 'lucide-react';

export default function MyAccount() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Account</h1>
          <p className="text-gray-600">Manage your account settings and view your order history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-teal-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-600">john@example.com</p>
                </div>
              </div>

              <nav className="space-y-2">
                <a href="#profile" className="flex items-center px-4 py-2 text-teal-600 bg-teal-50 rounded-lg">
                  <User className="w-4 h-4 mr-3" />
                  Profile Information
                </a>
                <a href="#orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Package className="w-4 h-4 mr-3" />
                  Order History
                </a>
                <a href="#wishlist" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Heart className="w-4 h-4 mr-3" />
                  Wishlist
                </a>
                <a href="#settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </a>
                <a href="#addresses" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 mr-3" />
                  Addresses
                </a>
                <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left">
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+92 300 1234567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    rows="3"
                    defaultValue="123 Main Street, Karachi, Pakistan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Orders</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">Order #ORD-001</h3>
                      <p className="text-sm text-gray-600">Placed on January 15, 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Delivered
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">HP EliteBook 840 G5 - Intel Core i5</p>
                  <p className="font-semibold text-gray-800">Rs: 35,000</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">Order #ORD-002</h3>
                      <p className="text-sm text-gray-600">Placed on January 20, 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Processing
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Dell Latitude 7390 - Intel Core i7</p>
                  <p className="font-semibold text-gray-800">Rs: 38,000</p>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full md:w-auto px-6 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50">
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}