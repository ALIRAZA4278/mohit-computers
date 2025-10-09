'use client';

import React, { useState, useEffect } from 'react';
import { Package, Eye, RefreshCw, Truck, CheckCircle, XCircle, Clock, Search, ArrowLeft, User, MapPin, Phone, Mail, Calendar } from 'lucide-react';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      // Fetch all orders from database (admin endpoint needed)
      const response = await fetch('/api/admin/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          order_status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setOrders(orders.map(order =>
          order.order_id === orderId
            ? { ...order, order_status: newStatus }
            : order
        ));

        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder({ ...selectedOrder, order_status: newStatus });
        }

        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      processing: 'bg-purple-100 text-purple-800 border-purple-300',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.order_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // If an order is selected, show detail view
  if (selectedOrder) {
    return (
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-black hover:text-teal-600 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Order Detail */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedOrder.order_id}</h1>
                <p className="flex items-center gap-2 text-teal-50">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedOrder.created_at).toLocaleString('en-PK', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(selectedOrder.order_status)} bg-white`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedOrder.order_status)}
                  <span className="capitalize">{selectedOrder.order_status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer & Shipping Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Details
                </h3>
                <div className="space-y-3 text-black">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Email
                    </p>
                    <p className="font-medium">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" /> Phone
                    </p>
                    <p className="font-medium">{selectedOrder.customer_phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>
                <div className="text-black space-y-2">
                  <p className="font-medium">{selectedOrder.shipping_address}</p>
                  <p className="font-medium">{selectedOrder.shipping_city}</p>
                  {selectedOrder.shipping_postal_code && (
                    <p className="font-medium">Postal Code: {selectedOrder.shipping_postal_code}</p>
                  )}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold">{selectedOrder.payment_method || 'COD'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black">Product</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-black">Quantity</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-black">Price</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-black">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedOrder.order_items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-black font-medium">{item.name}</td>
                        <td className="px-4 py-4 text-black text-center font-medium">{item.quantity}</td>
                        <td className="px-4 py-4 text-black text-right font-medium">Rs {item.price.toLocaleString()}</td>
                        <td className="px-4 py-4 text-black text-right font-bold">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-4 text-right text-black font-bold text-lg">Total Amount:</td>
                      <td className="px-4 py-4 text-right text-black font-bold text-xl">
                        Rs {parseFloat(selectedOrder.total_amount).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Order Notes */}
            {selectedOrder.order_notes && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-sm font-bold text-black mb-2">Order Notes:</p>
                <p className="text-black">{selectedOrder.order_notes}</p>
              </div>
            )}

            {/* Status Update */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-black mb-4">Update Order Status</h3>
              <div className="flex gap-3 flex-wrap">
                {orderStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder.order_id, status)}
                    disabled={updatingStatus === selectedOrder.order_id || selectedOrder.order_status === status}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      selectedOrder.order_status === status
                        ? getStatusColor(status) + ' cursor-default border-2'
                        : 'bg-gray-100 text-black hover:bg-gray-200 disabled:opacity-50 border-2 border-gray-300'
                    }`}
                  >
                    {updatingStatus === selectedOrder.order_id ? 'Updating...' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders List View (like blog cards)
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Orders Management</h1>
        <button
          onClick={fetchAllOrders}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID, Customer Name, or Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid (Blog Style) */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-black font-medium">No orders found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden border border-gray-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-black">{order.order_id}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.order_status)}`}>
                    {order.order_status.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-black flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.created_at).toLocaleDateString('en-PK')}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Customer</p>
                  <p className="font-bold text-black">{order.customer_name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Items</p>
                  <p className="font-medium text-black">{order.order_items?.length || 0} Product(s)</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-black">Rs {parseFloat(order.total_amount).toLocaleString()}</p>
                </div>

                <div className="pt-3 border-t">
                  <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
        <p className="text-sm text-black font-medium">
          Showing <span className="font-bold">{filteredOrders.length}</span> of <span className="font-bold">{orders.length}</span> orders
        </p>
      </div>
    </div>
  );
}
