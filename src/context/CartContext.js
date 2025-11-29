'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // For customized products, create a unique cart ID to treat each customization as separate item
      const cartId = action.payload.hasCustomizations
        ? `${action.payload.id}-custom-${Date.now()}-${Math.random()}`
        : action.payload.id;

      // Get quantity from payload or default to 1
      const quantityToAdd = action.payload.quantity || 1;

      // Only merge if it's the same product without customizations
      if (!action.payload.hasCustomizations && !action.payload.hasRAMCustomization) {
        const existingItem = state.items.find(item =>
          item.id === action.payload.id &&
          !item.hasCustomizations &&
          !item.hasRAMCustomization
        );
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === action.payload.id && !item.hasCustomizations && !item.hasRAMCustomization
                ? { ...item, quantity: item.quantity + quantityToAdd }
                : item
            )
          };
        }
      }

      // Add as new item with unique cartId for customized products
      return {
        ...state,
        items: [...state.items, {
          ...action.payload,
          cartId, // Unique identifier for cart operations
          quantity: quantityToAdd
        }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item =>
          (item.cartId || item.id) !== action.payload
        )
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          (item.cartId || item.id) === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
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

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product) => {
    // Check stock availability before adding to cart - with fallback for existing products
    // Set defaults based on category and product name
    const category = product.category_id || product.category;
    const categoryLower = typeof category === 'string' ? category.toLowerCase() : '';
    const productNameLower = typeof product.name === 'string' ? product.name.toLowerCase() : '';
    const isAccessoryCategory = ['accessories', 'ram', 'ssd', 'chromebook', 'accessory'].some(cat =>
      categoryLower.includes(cat) || productNameLower.includes(cat)
    );

    const stockQuantity = product.stock_quantity !== undefined ? product.stock_quantity : (isAccessoryCategory ? 0 : 999);
    const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : !isAccessoryCategory);
    const isActive = product.is_active !== undefined ? product.is_active : product.inStock !== false;
    const isAvailableForPurchase = isActive && inStock && stockQuantity > 0;

    if (!isAvailableForPurchase) {
      alert('Sorry, this product is currently out of stock and cannot be added to cart.');
      return false;
    }

    // For customized products, skip stock check as each customization is unique
    if (!product.hasCustomizations && !product.hasRAMCustomization) {
      // Check if adding this item would exceed stock (only for non-customized products)
      const existingItems = state.items.filter(item =>
        item.id === product.id &&
        !item.hasCustomizations &&
        !item.hasRAMCustomization
      );
      const currentQuantityInCart = existingItems.reduce((sum, item) => sum + item.quantity, 0);

      if (currentQuantityInCart >= stockQuantity) {
        alert(`Sorry, you already have the maximum available quantity (${stockQuantity}) of this item in your cart.`);
        return false;
      }
    }

    dispatch({ type: 'ADD_TO_CART', payload: product });
    return true;
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      // Use finalPrice if available (for customized products), otherwise use regular price
      const itemPrice = item.finalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};