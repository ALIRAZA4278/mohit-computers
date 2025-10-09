"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Users, FileText, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalBlogs: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [ordersRes, productsRes, usersRes, blogsRes] = await Promise.all([
        fetch('/api/admin/orders').catch(() => ({ ok: false })),
        fetch('/api/products').catch(() => ({ ok: false })),
        fetch('/api/admin/users').catch(() => ({ ok: false })),
        fetch('/api/blogs').catch(() => ({ ok: false }))
      ]);

      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
      const productsData = productsRes.ok ? await productsRes.json() : { data: [] };
      const usersData = usersRes.ok ? await usersRes.json() : { users: [] };
      const blogsData = blogsRes.ok ? await blogsRes.json() : { blogs: [] };

      const orders = ordersData.orders || [];
      const products = productsData.data || productsData.products || [];
      const users = usersData.users || [];
      const blogs = blogsData.blogs || [];

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) =>
        sum + parseFloat(order.total_amount || 0), 0
      );

      const pendingOrders = orders.filter(o => o.order_status === 'pending').length;
      const deliveredOrders = orders.filter(o => o.order_status === 'delivered').length;

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalBlogs: blogs.length,
        totalRevenue,
        pendingOrders,
        deliveredOrders
      });

      // Get recent 5 orders
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50'
    },
    {
      title: 'Total Revenue',
      value: `Rs ${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      lightBg: 'bg-green-50'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      lightBg: 'bg-purple-50'
    },
    {
      title: 'Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-orange-500',
      lightBg: 'bg-orange-50'
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-black">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
          </div>
          <p className="text-3xl font-bold text-black">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
          </div>
          <p className="text-3xl font-bold text-black">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Delivered</p>
          </div>
          <p className="text-3xl font-bold text-black">{stats.deliveredOrders}</p>
        </div>
      </div>

      {/* Recent Orders and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black">Recent Orders</h2>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-bold text-black">{order.order_id}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black">Rs {parseFloat(order.total_amount).toLocaleString()}</p>
                      <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-teal-600" />
              <div>
                <p className="text-sm text-gray-600">Total Blogs</p>
                <p className="text-2xl font-bold text-black">{stats.totalBlogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-black">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-black">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
