'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Minus, Info, Zap, HardDrive, Cpu } from 'lucide-react';

export default function LaptopCustomizer({ product, onCustomizationChange }) {
  const [customizations, setCustomizations] = useState({
    ramUpgrade: null,
    ssdUpgrade: null
  });

  const [totalPrice, setTotalPrice] = useState(product?.price || 0);

  // RAM upgrade options (these replace existing RAM, similar to SSD)
  const getCurrentRAMSize = useCallback(() => {
    const ramText = product?.ram || '8GB';
    const ramNumber = parseInt(ramText);
    return isNaN(ramNumber) ? 8 : ramNumber;
  }, [product?.ram]);

  // Determine generation number (best-effort parse)
  const getGenerationNumber = useCallback(() => {
    const gen = product?.generation;
    if (!gen) return null;
    const n = parseInt(String(gen));
    if (!isNaN(n)) return n;
    const match = String(gen).match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }, [product?.generation]);

  // Price lookup for a RAM module (add-on) based on CPU generation / DDR type
  const getRamModulePrice = useCallback((sizeNumber) => {
    const gen = getGenerationNumber();

    // DDR3 (3rd to 5th generation)
    if (gen && gen >= 3 && gen <= 5) {
      if (sizeNumber === 4) return 1000;
      if (sizeNumber === 8) return 2500;
      // larger modules - fallback to DDR4-like pricing
    }

    // DDR4 (6th to 11th generation) and default
    if (sizeNumber === 4) return 3200;
    if (sizeNumber === 8) return 6000;
    if (sizeNumber === 16) return 11500;
    if (sizeNumber === 32) return 25000;

    // default fallback
    return 0;
  }, [getGenerationNumber]);

  const ramModules = useMemo(() => {
    const currentRAM = getCurrentRAMSize();
    return [
      { id: 'ram-4gb', size: '4GB', sizeNumber: 4, description: 'Upgrade to 4GB RAM' },
      { id: 'ram-8gb', size: '8GB', sizeNumber: 8, description: 'Upgrade to 8GB RAM' },
      { id: 'ram-16gb', size: '16GB', sizeNumber: 16, description: 'Upgrade to 16GB RAM' },
      { id: 'ram-32gb', size: '32GB', sizeNumber: 32, description: 'Upgrade to 32GB RAM' }
    ].map(m => ({ ...m, price: getRamModulePrice(m.sizeNumber) }))
     .filter(ram => ram.sizeNumber > currentRAM); // Only show larger RAM sizes
  }, [getRamModulePrice, getCurrentRAMSize]);

  // SSD upgrade options (replaces existing drive) - show only larger capacities than current storage
  const parseStorageToGB = (storageText) => {
    if (!storageText) return 0;
    const text = String(storageText).toUpperCase().trim();
    if (text.includes('TB')) {
      const n = parseFloat(text.replace(/[^0-9\.]/g, '')) || 0;
      return Math.round(n * 1024);
    }
    // fallback to GB
    const n = parseFloat(text.replace(/[^0-9\.]/g, '')) || 0;
    return Math.round(n);
  };

  const getCurrentSSDSizeNumber = () => {
    const storageText = product?.hdd || '256GB';
    return parseStorageToGB(storageText);
  };

  const ssdUpgrades = [
    { id: 'ssd-128gb', size: '128GB', sizeNumber: 128, price: 2000, description: 'Replace with 128GB NVMe SSD' },
    { id: 'ssd-256gb', size: '256GB', sizeNumber: 256, price: 4000, description: 'Replace with 256GB NVMe SSD' },
    { id: 'ssd-512gb', size: '512GB', sizeNumber: 512, price: 7500, description: 'Replace with 512GB NVMe SSD' },
    { id: 'ssd-1tb', size: '1TB', sizeNumber: 1024, price: 15000, description: 'Replace with 1TB NVMe SSD' }
  ].filter(ssd => ssd.sizeNumber > getCurrentSSDSizeNumber()); // Show only larger sizes

  // Calculate total price when customizations change
  useEffect(() => {
    let additionalCost = 0;
    let updatedSpecs = {
      ram: product?.ram || '8GB',
      storage: product?.hdd || '256GB SSD'
    };
    
    if (customizations.ramUpgrade) {
      // Replace existing RAM: add upgrade price to cost
      additionalCost += customizations.ramUpgrade.price || 0;
      // Update RAM specification - replace with new RAM size
      updatedSpecs.ram = `${customizations.ramUpgrade.size}`;
    }
    
    if (customizations.ssdUpgrade) {
      additionalCost += customizations.ssdUpgrade.price;
      // Update storage specification
      updatedSpecs.storage = `${customizations.ssdUpgrade.size} NVMe SSD`;
    }
    
    const newTotalPrice = (product?.price || 0) + additionalCost;
    setTotalPrice(newTotalPrice);
    
    // Notify parent component of changes including updated specs
    if (onCustomizationChange) {
      const dataToSend = {
        customizations,
        additionalCost,
        totalPrice: newTotalPrice,
        updatedSpecs // Add this to communicate spec changes
      };
      console.log('Sending customization data:', dataToSend);
      onCustomizationChange(dataToSend);
    }
  }, [customizations, product?.price, product?.ram, product?.hdd, onCustomizationChange, getCurrentRAMSize]);

  const handleRamUpgrade = (ramOption) => {
    setCustomizations(prev => ({
      ...prev,
      ramUpgrade: prev.ramUpgrade?.id === ramOption.id ? null : ramOption
    }));
  };

  const handleSsdUpgrade = (ssdOption) => {
    setCustomizations(prev => ({
      ...prev,
      ssdUpgrade: prev.ssdUpgrade?.id === ssdOption.id ? null : ssdOption
    }));
  };

  const getCurrentRam = () => {
    if (customizations.ramUpgrade) {
      return customizations.ramUpgrade.size;
    }
    return product?.ram || '8GB';
  };

  const getCurrentStorage = () => {
    if (customizations.ssdUpgrade) {
      return `${customizations.ssdUpgrade.size} NVMe SSD`;
    }
    return product?.hdd || '256GB SSD';
  };

  if (!product) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Zap className="w-6 h-6 text-teal-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-800">Customize Your Laptop</h3>
      </div>

      {/* Current Configuration */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Current Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Cpu className="w-4 h-4 text-gray-500 mr-2" />
            <span><strong>RAM:</strong> {getCurrentRam()}</span>
          </div>
          <div className="flex items-center">
            <HardDrive className="w-4 h-4 text-gray-500 mr-2" />
            <span><strong>Storage:</strong> {getCurrentStorage()}</span>
          </div>
        </div>
      </div>

      {/* RAM Modules */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Cpu className="w-5 h-5 text-teal-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-800">RAM Upgrade</h4>
          <div className="group relative ml-2">
            <Info className="w-4 h-4 text-gray-400" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              RAM upgrades replace your current RAM with a larger capacity. Only sizes larger than your current RAM are shown.
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ramModules.map((ram) => (
            <div
              key={ram.id}
              onClick={() => handleRamUpgrade(ram)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                customizations.ramUpgrade?.id === ram.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-semibold text-gray-800">{ram.size} RAM</h5>
                  <p className="text-sm text-gray-600">{ram.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Upgrade from {product?.ram || '8GB'} to {ram.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-600">Rs:{ram.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Upgrade Price</p>
                </div>
              </div>
              {customizations.ramUpgrade?.id === ram.id && (
                <div className="mt-2 text-sm text-teal-600 font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SSD Upgrades */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <HardDrive className="w-5 h-5 text-teal-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-800">SSD Upgrades</h4>
          <div className="group relative ml-2">
            <Info className="w-4 h-4 text-gray-400" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              SSD upgrades replace the existing drive. Price difference will be applied.
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ssdUpgrades.map((ssd) => (
            <div
              key={ssd.id}
              onClick={() => handleSsdUpgrade(ssd)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                customizations.ssdUpgrade?.id === ssd.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-semibold text-gray-800">{ssd.size} SSD</h5>
                  <p className="text-sm text-gray-600">{ssd.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-600">Rs:{ssd.price.toLocaleString()}</p>
                </div>
              </div>
              {customizations.ssdUpgrade?.id === ssd.id && (
                <div className="mt-2 text-sm text-teal-600 font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="border-t pt-6">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Price Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>Rs:{(product?.price || 0).toLocaleString()}</span>
            </div>
            
            {customizations.ramUpgrade && (
              <div className="flex justify-between text-teal-600">
                <span>RAM Upgrade ({customizations.ramUpgrade.size}):</span>
                <span>Rs:{customizations.ramUpgrade.price.toLocaleString()}</span>
              </div>
            )}
            
            {customizations.ssdUpgrade && (
              <div className="flex justify-between text-teal-600">
                <span>SSD Upgrade ({customizations.ssdUpgrade.size}):</span>
                <span>Rs:{customizations.ssdUpgrade.price.toLocaleString()}</span>
              </div>
            )}
            
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total Price:</span>
              <span className="text-teal-600">Rs:{totalPrice.toLocaleString()}</span>
            </div>
            
            {(customizations.ramUpgrade || customizations.ssdUpgrade) && (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-green-600">
                  You save Rs:{((product?.price || 0) * 0.1).toLocaleString()} with customization!
                </p>
                <p className="text-xs mt-1">
                  Includes professional installation and 6-month warranty on upgrades.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {(customizations.ramUpgrade || customizations.ssdUpgrade) && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setCustomizations({ ramUpgrade: null, ssdUpgrade: null })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Reset to default configuration
          </button>
        </div>
      )}
    </div>
  );
}