'use client';

import React, { useState, useEffect } from 'react';
import { User, Settings, Package, Heart, FileText, LogOut, ShoppingBag, X, Edit2, Save, Navigation, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';

export default function MyAccount() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      // Redirect to login if not logged in
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadUserData(token);
  }, [router]);

  const loadUserData = async (token) => {
    try {
      // Fetch orders from orders API
      const ordersRes = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        console.log('Orders data:', ordersData);
        setOrders(ordersData.orders || []);
      } else {
        console.error('Failed to fetch orders:', ordersRes.status);
      }

      // Fetch wishlist with full product details
      console.log('Fetching wishlist...');
      const wishlistRes = await fetch('/api/user/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Wishlist response status:', wishlistRes.status);

      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        console.log('Wishlist data:', wishlistData);
        const productIds = wishlistData.wishlist || [];
        console.log('Product IDs in wishlist:', productIds);

        // Fetch full product details
        if (productIds.length > 0) {
          console.log('Fetching products...');
          const productsRes = await fetch('/api/products');
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            // API returns data in 'data' property
            const allProducts = productsData.data || productsData.products || [];
            console.log('Total products:', allProducts.length);
            console.log('First product sample:', allProducts[0]);
            console.log('Product IDs to match:', productIds);
            // Filter products that are in wishlist - handle both string and UUID
            const wishlistProducts = allProducts.filter(p => {
              const matches = productIds.includes(p.id) || productIds.includes(String(p.id));
              if (matches) {
                console.log('Matched product:', p.name, 'ID:', p.id);
              }
              return matches;
            });
            console.log('Wishlist products found:', wishlistProducts.length, wishlistProducts);
            setWishlist(wishlistProducts);
          } else {
            console.error('Failed to fetch products:', productsRes.status);
          }
        } else {
          console.log('No products in wishlist');
          setWishlist([]);
        }
      } else {
        console.error('Failed to fetch wishlist:', wishlistRes.status);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Redirect to login
    router.push('/login');
  };

  const handleEditClick = () => {
    setEditFormData({
      name: user.name || '',
      phone: user.phone || '',
      address_line1: user.address_line1 || '',
      address_line2: user.address_line2 || '',
      city: user.city || '',
      state: user.state || '',
      postal_code: user.postal_code || '',
      country: user.country || 'Pakistan',
      current_address: user.current_address || ''
    });
    setIsEditing(true);
    setUpdateMessage('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setUpdateMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setUpdateMessage('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setUpdateMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'MohitComputers/1.0'
              }
            }
          );

          const data = await response.json();

          if (data && data.address) {
            // Parse address from API response
            const address = data.address;
            setEditFormData(prev => ({
              ...prev,
              current_address: data.display_name || '',
              address_line1: `${address.road || ''} ${address.house_number || ''}`.trim() || address.suburb || '',
              city: address.city || address.town || address.village || '',
              state: address.state || address.province || '',
              postal_code: address.postcode || '',
              country: address.country || 'Pakistan'
            }));
            setUpdateMessage('Location detected successfully! Please review and save.');
            setTimeout(() => setUpdateMessage(''), 5000);
          } else {
            setUpdateMessage('Could not get address from location');
          }
        } catch (err) {
          console.error('Error getting address:', err);
          setUpdateMessage('Failed to get address from coordinates');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        console.error('Location error:', err);
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setUpdateMessage('Location permission denied. Please enable location access in your browser.');
            break;
          case err.POSITION_UNAVAILABLE:
            setUpdateMessage('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setUpdateMessage('Location request timed out.');
            break;
          default:
            setUpdateMessage('An unknown error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setUpdateMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update local user state
        setUser(data.user);
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        setUpdateMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        console.error('Update failed:', data);
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        setUpdateMessage(errorMsg || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage('An error occurred while updating profile: ' + error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6dc1c9] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
                  <User className="w-8 h-8 text-[#6dc1c9]" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">{user.name || 'User'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-4 py-2 rounded-lg w-full text-left ${
                    activeTab === 'profile' ? 'text-[#6dc1c9] bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center px-4 py-2 rounded-lg w-full text-left ${
                    activeTab === 'orders' ? 'text-[#6dc1c9] bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-4 h-4 mr-3" />
                  Order History
                  {orders.length > 0 && (
                    <span className="ml-auto bg-teal-100 text-[#6dc1c9] px-2 py-1 rounded-full text-xs">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center px-4 py-2 rounded-lg w-full text-left ${
                    activeTab === 'wishlist' ? 'text-[#6dc1c9] bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-4 h-4 mr-3" />
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-auto bg-teal-100 text-[#6dc1c9] px-2 py-1 rounded-full text-xs">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-4 py-2 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saveLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                {updateMessage && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    updateMessage.includes('success')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {updateMessage}
                  </div>
                )}

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Personal Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={isEditing ? editFormData.name : (user.name || '')}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                          isEditing ? 'bg-white' : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={isEditing ? editFormData.phone : (user.phone || '')}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Enter phone number"
                        className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                          isEditing ? 'bg-white' : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="border-b pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Address Details</h3>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {locationLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Detecting...
                          </>
                        ) : (
                          <>
                            <Navigation className="w-4 h-4" />
                            Use Current Location
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Address
                      </label>
                      <textarea
                        name="current_address"
                        value={isEditing ? editFormData.current_address : (user.current_address || '')}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Enter your current full address or use location button"
                        rows="3"
                        className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                          isEditing ? 'bg-white' : 'bg-gray-50'
                        }`}
                      />
                      <p className="text-xs text-gray-500 mt-1">Your complete current residential address</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address_line1"
                        value={isEditing ? editFormData.address_line1 : (user.address_line1 || '')}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Street address, house number"
                        className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                          isEditing ? 'bg-white' : 'bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="address_line2"
                        value={isEditing ? editFormData.address_line2 : (user.address_line2 || '')}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                          isEditing ? 'bg-white' : 'bg-gray-50'
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={isEditing ? editFormData.city : (user.city || '')}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          placeholder="City"
                          className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                            isEditing ? 'bg-white' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={isEditing ? editFormData.state : (user.state || '')}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          placeholder="State/Province"
                          className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                            isEditing ? 'bg-white' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          value={isEditing ? editFormData.postal_code : (user.postal_code || '')}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          placeholder="Postal Code"
                          className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                            isEditing ? 'bg-white' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={isEditing ? editFormData.country : (user.country || 'Pakistan')}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Country"
                        className={`w-full text-black px-3 py-2 border border-gray-300 rounded-lg ${
                          isEditing ? 'bg-white' : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User ID
                      </label>
                      <input
                        type="text"
                        value={user.id}
                        readOnly
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Created
                      </label>
                      <input
                        type="text"
                        value={new Date(user.created_at).toLocaleDateString()}
                        readOnly
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

              </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order History</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="inline-block px-6 py-2 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">Order #{order.order_id}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.order_status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                          order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.order_items?.length || 0} item(s) • {order.payment_method || 'COD'}
                      </p>
                      <p className="font-semibold text-gray-800">Rs {Number(order.total_amount).toLocaleString()}</p>
                      {order.shipping_address && (
                        <p className="text-sm text-gray-500 mt-2">
                          Ship to: {order.shipping_address}, {order.shipping_city}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Wishlist</h2>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Your Wishlist is Empty</h3>
                    <p className="text-gray-500 mb-6">Save items you love to your wishlist.</p>
                    <Link
                      href="/products"
                      className="inline-block px-6 py-2 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlistItems.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Product Image */}
                        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                          <Image
                            src={product.featured_image || product.image || "/next.svg"}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                            onError={(e) => {
                              e.target.src = "/next.svg";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#6dc1c9] transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Brand */}
                          {product.brand && (
                            <p className="text-xs text-gray-500 mb-2">
                              Brand: {product.brand}
                            </p>
                          )}

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-gray-900">
                              Rs:{product.price?.toLocaleString() || '0'}
                            </span>
                            {product.original_price && (
                              <span className="text-sm text-gray-500 line-through">
                                Rs:{product.original_price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div className="mb-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <span className={`w-1 h-1 rounded-full mr-1 ${
                                product.is_active ? 'bg-green-500' : 'bg-red-500'
                              }`}></span>
                              {product.is_active ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.id}`}
                              className="flex-1 bg-[#6dc1c9] text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-teal-700 transition-colors"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Remove from wishlist"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}