'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: []
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUserId(userData.id);
      // Load wishlist from database
      loadWishlistFromDatabase(token);
    } else {
      // Load wishlist from localStorage for non-logged-in users
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
      }
    }
  }, []);

  // Load wishlist from database
  const loadWishlistFromDatabase = async (token) => {
    try {
      const response = await fetch('/api/user/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // data.wishlist contains product IDs, fetch full product details
        const productIds = data.wishlist || [];
        if (productIds.length > 0) {
          await fetchProductDetails(productIds);
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist from database:', error);
    }
  };

  // Fetch full product details from product IDs
  const fetchProductDetails = async (productIds) => {
    try {
      console.log('Fetching product details for IDs:', productIds);
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        console.log('Products API response:', result);
        // API returns data in 'data' property, not 'products'
        const products = result.data || result.products || [];
        console.log('All products:', products.length);
        // Filter products that are in wishlist
        const wishlistProducts = products.filter(p => {
          // Convert both to strings for comparison
          const matches = productIds.includes(p.id) || productIds.includes(String(p.id));
          if (matches) {
            console.log('Found wishlist product:', p.name, p.id);
          }
          return matches;
        });
        console.log('Filtered wishlist products:', wishlistProducts.length);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistProducts });
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    }
  };

  // Save wishlist to localStorage for non-logged-in users
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    }
  }, [state.items, isLoggedIn]);

  // Sync localStorage wishlist to database when user logs in
  const syncWishlistOnLogin = async () => {
    const savedWishlist = localStorage.getItem('wishlist');
    const token = localStorage.getItem('token');

    if (savedWishlist && token) {
      try {
        const localItems = JSON.parse(savedWishlist);
        for (const product of localItems) {
          await fetch('/api/user/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId: product.id })
          });
        }
        // Clear localStorage after sync
        localStorage.removeItem('wishlist');
        // Reload from database
        await loadWishlistFromDatabase(token);
      } catch (error) {
        console.error('Failed to sync wishlist:', error);
      }
    }
  };

  const addToWishlist = async (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });

    // If logged in, sync to database
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product.id })
        });
      } catch (error) {
        console.error('Failed to add to wishlist in database:', error);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });

    // If logged in, sync to database
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('/api/user/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: productId })
        });
      } catch (error) {
        console.error('Failed to remove from wishlist in database:', error);
      }
    }
  };

  const clearWishlist = async () => {
    dispatch({ type: 'CLEAR_WISHLIST' });

    // If logged in, clear from database
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/user/wishlist', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const productIds = data.wishlist || [];

          // Remove all items
          for (const productId of productIds) {
            await fetch('/api/user/wishlist', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ productId: productId })
            });
          }
        }
      } catch (error) {
        console.error('Failed to clear wishlist in database:', error);
      }
    }
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const value = {
    wishlistItems: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    syncWishlistOnLogin
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};