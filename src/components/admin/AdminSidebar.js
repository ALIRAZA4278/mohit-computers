"use client";

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Store,
  Mail,
  MessageCircle,
  Star,
  Menu,
  X,
  DollarSign,
  Cpu,
  Image
} from 'lucide-react';

export default function AdminSidebar({ activeSection, setActiveSection, onLogout, isSidebarOpen, setIsSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'banners', label: 'Hero Banners', icon: Image },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'subscribers', label: 'Subscribers', icon: Mail },
    { id: 'laptop-options', label: 'Laptop Options', icon: Cpu },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-[#6dc1c9] rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-teal-400 font-medium">Mohit Computers</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-[#6dc1c9] text-white shadow-lg shadow-teal-500/30 scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:scale-102'
                }`}
              >
                <div className={`mr-3 p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-gray-800 group-hover:bg-gray-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

      {/* Session Info & Logout */}
      <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
        <div className="bg-gray-800/50 rounded-xl p-4 mb-3 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-400">Session Active</span>
          </div>
          <p className="text-xs text-gray-400">Auto-logout in 24 hours</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3.5 rounded-xl text-left text-gray-300 hover:text-white bg-red-600/10 hover:bg-red-600 border border-red-600/20 hover:border-red-600 transition-all duration-200 group"
        >
          <div className="mr-3 p-2 rounded-lg bg-red-600/20 group-hover:bg-white/20 transition-all">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
        </div>
      </div>
    </>
  );
}