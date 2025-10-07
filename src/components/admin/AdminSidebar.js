"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  LogOut 
} from 'lucide-react';

export default function AdminSidebar({ activeSection, setActiveSection, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blogs', label: 'Blog Management', icon: FileText },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-400">Mohit Computers</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Session Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-3">
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Session Active
          </div>
          <p>Auto-logout in 24 hours</p>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-left text-gray-300 hover:text-white hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}