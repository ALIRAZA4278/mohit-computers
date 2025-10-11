'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, RefreshCw, Download, Users } from 'lucide-react';

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/subscribers');
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.subscribers || []);
        setTotalSubscribers(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;

    try {
      const response = await fetch('/api/admin/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (data.success) {
        fetchSubscribers();
      } else {
        alert('Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Failed to delete subscriber');
    }
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to export');
      return;
    }

    const csv = [
      ['Email', 'Subscribed Date'],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6dc1c9] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Newsletter Subscribers</h1>
          <p className="text-gray-600 mt-2">Manage your newsletter subscriber list</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSubscribers}
            className="bg-white text-black px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="bg-[#6dc1c9] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Subscribers</p>
            <p className="text-3xl font-bold text-black mt-1">{totalSubscribers}</p>
          </div>
          <Users className="w-12 h-12 text-[#6dc1c9]" />
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">#</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">Email Address</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">Subscribed Date</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">No subscribers yet</p>
                    <p className="text-sm">Newsletter subscribers will appear here</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber, index) => (
                  <tr key={subscriber.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(subscriber.subscribed_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Message */}
      {subscribers.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> You can export all subscriber emails to CSV format and use them for email marketing campaigns.
          </p>
        </div>
      )}
    </div>
  );
}
