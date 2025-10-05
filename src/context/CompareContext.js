'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CompareContext = createContext();

const compareReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_COMPARE':
      // Only allow laptops (used-laptop or chromebook categories)
      if (!['used-laptop', 'chromebook'].includes(action.payload.category)) {
        console.warn('Only laptops can be compared');
        return state;
      }
      
      // Limit to 4 items for comparison
      if (state.items.length >= 4) {
        console.warn('Maximum 4 laptops can be compared at once');
        return state;
      }
      
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in compare list
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_COMPARE':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_COMPARE':
      return {
        ...state,
        items: []
      };

    case 'LOAD_COMPARE':
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

export const CompareProvider = ({ children }) => {
  const [state, dispatch] = useReducer(compareReducer, initialState);

  // Load compare list from localStorage on mount
  useEffect(() => {
    const savedCompare = localStorage.getItem('compare');
    if (savedCompare) {
      dispatch({ type: 'LOAD_COMPARE', payload: JSON.parse(savedCompare) });
    }
  }, []);

  // Save compare list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('compare', JSON.stringify(state.items));
  }, [state.items]);

  const addToCompare = (product) => {
    // Check if it's a laptop
    if (!['used-laptop', 'chromebook'].includes(product.category)) {
      alert('⚠️ Only laptops can be compared!\nPlease select laptops or Chromebooks to compare their specifications.');
      return false;
    }
    
    if (state.items.length >= 4) {
      alert('⚠️ Maximum comparison limit reached!\nYou can compare up to 4 laptops at a time. Please remove one to add another.');
      return false;
    }
    
    if (isInCompare(product.id)) {
      alert('ℹ️ This laptop is already in your comparison list!');
      return false;
    }
    
    dispatch({ type: 'ADD_TO_COMPARE', payload: product });
    
    // Success feedback
    const successMessage = `✅ ${product.name} added to comparison!\n${state.items.length + 1}/4 laptops selected.`;
    console.log(successMessage);
    
    return true;
  };

  const removeFromCompare = (productId) => {
    dispatch({ type: 'REMOVE_FROM_COMPARE', payload: productId });
  };

  const clearCompare = () => {
    if (state.items.length > 0 && !confirm('Are you sure you want to clear all laptops from comparison?')) {
      return;
    }
    dispatch({ type: 'CLEAR_COMPARE' });
  };

  const isInCompare = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const canAddMore = () => {
    return state.items.length < 4;
  };

  const getLaptopCount = () => {
    return state.items.length;
  };

  const isLaptopCategory = (category) => {
    return ['used-laptop', 'chromebook'].includes(category);
  };

  const value = {
    compareItems: state.items,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddMore,
    getLaptopCount,
    isLaptopCategory
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};