"use client";

import React, { useState, useEffect } from 'react';
import { User, Lock, Shield } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDashboard from '../../components/admin/AdminDashboard';
import BlogManagement from '../../components/admin/BlogManagement';
import ProductManagement from '../../components/admin/ProductManagement';
import UsersManagement from '../../components/admin/UsersManagement';
import OrdersManagement from '../../components/admin/OrdersManagement';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login session on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const savedLoginState = localStorage.getItem('adminLoggedIn');
        const savedActiveSection = localStorage.getItem('adminActiveSection');
        const loginTimestamp = localStorage.getItem('adminLoginTime');
        
        // Check if login is still valid (24 hours)
        if (savedLoginState === 'true' && loginTimestamp) {
          const currentTime = new Date().getTime();
          const loginTime = parseInt(loginTimestamp);
          const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (currentTime - loginTime < twentyFourHours) {
            setIsLoggedIn(true);
            if (savedActiveSection) {
              setActiveSection(savedActiveSection);
            }
          } else {
            // Session expired, clear storage
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminActiveSection');
            localStorage.removeItem('adminLoginTime');
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('adminActiveSection', activeSection);
    }
  }, [activeSection, isLoggedIn]);

  // Auto-logout timer - check every minute for session expiry
  useEffect(() => {
    if (isLoggedIn) {
      const checkSessionExpiry = setInterval(() => {
        try {
          const loginTimestamp = localStorage.getItem('adminLoginTime');
          if (loginTimestamp) {
            const currentTime = new Date().getTime();
            const loginTime = parseInt(loginTimestamp);
            const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            
            if (currentTime - loginTime >= twentyFourHours) {
              // Session expired
              handleLogout();
              alert('Session expired. Please login again.');
            }
          }
        } catch (error) {
          console.error('Error checking session expiry:', error);
        }
      }, 60000); // Check every minute

      return () => clearInterval(checkSessionExpiry);
    }
  }, [isLoggedIn]);

  // Extend session on user activity
  useEffect(() => {
    if (isLoggedIn) {
      const extendSession = () => {
        try {
          localStorage.setItem('adminLoginTime', new Date().getTime().toString());
        } catch (error) {
          console.error('Error extending session:', error);
        }
      };

      // Add event listeners for user activity
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, extendSession);
      });

      // Cleanup event listeners
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, extendSession);
        });
      };
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email === 'mohit316bwebsite@gmail.com' && password === 'Rabahsocial') {
      setIsLoggedIn(true);
      setError('');
      
      // Save login state to localStorage
      try {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminActiveSection', activeSection);
        localStorage.setItem('adminLoginTime', new Date().getTime().toString());
      } catch (error) {
        console.error('Error saving login state:', error);
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
    setEmail('');
    setPassword('');
    
    // Clear login state from localStorage
    try {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminActiveSection');
      localStorage.removeItem('adminLoginTime');
    } catch (error) {
      console.error('Error clearing login state:', error);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'blogs':
        return <BlogManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Settings coming soon...</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  // Show loading screen while checking login status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-auto">
          {renderActiveSection()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Access the admin panel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                  placeholder="Email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Shield className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              Sign in to Admin Panel
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}