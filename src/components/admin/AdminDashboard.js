"use client";

import React from 'react';
import { FileText, Users, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Blogs',
      value: '12',
      icon: FileText,
      color: 'bg-blue-500',
      change: '+2 this week'
    },
    {
      title: 'Products',
      value: '156',
      icon: Package,
      color: 'bg-green-500',
      change: '+5 this month'
    },
    {
      title: 'Users',
      value: '89',
      icon: Users,
      color: 'bg-purple-500',
      change: '+12 this month'
    },
    {
      title: 'Revenue',
      value: '$2,340',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      change: '+18% this month'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
  <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Blog Posts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Latest Gaming Laptops Review</p>
                  <p className="text-sm text-gray-500">Published 2 days ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Best Budget Chromebooks 2024</p>
                  <p className="text-sm text-gray-500">Draft • 1 week ago</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <p className="font-medium text-gray-900">Create New Blog Post</p>
                <p className="text-sm text-gray-500">Start writing a new article</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <p className="font-medium text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-500">Add product to inventory</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}