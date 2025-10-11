'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, Eye, Mail, Phone, MapPin, Calendar, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const adminEmail = 'admin@mohitcomputers.com';
      const adminPassword = 'Admin@123456';
      const credentials = btoa(`${adminEmail}:${adminPassword}`);

      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.append('page', currentPage);
      url.searchParams.append('limit', 20);
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination.totalPages);
        setTotalUsers(data.pagination.total);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const adminEmail = 'admin@mohitcomputers.com';
      const adminPassword = 'Admin@123456';
      const credentials = btoa(`${adminEmail}:${adminPassword}`);

      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        fetchUsers(); // Refresh list
        setDeleteConfirm(null);
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Users Management</h1>
        <button
          onClick={fetchUsers}
          className="bg-white text-black px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium shadow-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-black mt-1">{totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-[#6dc1c9]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Current Page</p>
              <p className="text-3xl font-bold text-black mt-1">{currentPage} / {totalPages}</p>
            </div>
            <ChevronRight className="w-12 h-12 text-[#6dc1c9]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Showing</p>
              <p className="text-3xl font-bold text-black mt-1">{users.length} users</p>
            </div>
            <Eye className="w-12 h-12 text-[#6dc1c9]" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6dc1c9]"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-black mb-2">No Users Found</h3>
          <p className="text-gray-600">No users match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-black">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-black">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-black">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-black">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-[#6dc1c9] font-bold">
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-black">
                              {user.name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          {user.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          {user.city || user.state || user.country || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="text-[#6dc1c9] hover:text-teal-900 mr-3"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black font-medium">
              Page {currentPage} of {totalPages} ({totalUsers} total users)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="bg-gradient-to-r from-[#6dc1c9] to-teal-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">User Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600">Name</label>
                    <p className="text-black font-medium">{selectedUser.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600">Email</label>
                    <p className="text-black font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600">Phone</label>
                    <p className="text-black font-medium">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600">User ID</label>
                    <p className="text-black font-medium text-xs break-all">{selectedUser.id}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <label className="text-sm font-bold text-gray-600">Current Address</label>
                  <p className="text-black font-medium">{selectedUser.current_address || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600">Address Line 1</label>
                    <p className="text-black font-medium">{selectedUser.address_line1 || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600">City</label>
                    <p className="text-black font-medium">{selectedUser.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600">State</label>
                    <p className="text-black font-medium">{selectedUser.state || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600">Country</label>
                    <p className="text-black font-medium">{selectedUser.country || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-bold text-gray-600">Created At</label>
                    <p className="text-black font-medium">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600">Last Updated</label>
                    <p className="text-black font-medium">{formatDate(selectedUser.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-white text-black border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
