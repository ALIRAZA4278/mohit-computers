'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Minus, Info, Zap, HardDrive, Cpu } from 'lucide-react';

export default function LaptopCustomizer({ product, onCustomizationChange }) {
  const [customizations, setCustomizations] = useState({
    ramUpgrade: null,
    ssdUpgrade: null
  });

  const [totalPrice, setTotalPrice] = useState(product?.price || 0);
  const [upgradeOptions, setUpgradeOptions] = useState({ ram: [], ssd: [] });
  const [loading, setLoading] = useState(true);

  // Fetch upgrade options from database
  useEffect(() => {
    const fetchUpgradeOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/laptop-upgrade-options?active=true');
        const data = await response.json();
        if (data.success) {
          const ramOpts = data.options.filter(opt => opt.option_type === 'ram');
          const ssdOpts = data.options.filter(opt => opt.option_type === 'ssd');
          setUpgradeOptions({ ram: ramOpts, ssd: ssdOpts });
          console.log('Loaded upgrade options from database:', { ramOpts, ssdOpts });
        }
      } catch (error) {
        console.error('Failed to fetch upgrade options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpgradeOptions();
  }, []);

  // Get filtered RAM options based on current RAM size and generation
  const ramModules = useMemo(() => {
    const ramText = product?.ram || '8GB';
    const ramNumber = parseInt(ramText);
    const currentRAM = isNaN(ramNumber) ? 8 : ramNumber;
    
    const gen = product?.generation;
    let genNumber = null;
    if (gen) {
      const n = parseInt(String(gen));
      if (!isNaN(n)) {
        genNumber = n;
      } else {
        const match = String(gen).match(/\d+/);
        genNumber = match ? parseInt(match[0]) : null;
      }
    }
    
    console.log('Filtering RAM options:', {
      currentRAM,
      generation: genNumber,
      totalOptions: upgradeOptions.ram.length,
      hasCustomPricing: !!product?.custom_upgrade_pricing,
      customPricingData: product?.custom_upgrade_pricing
    });

    return upgradeOptions.ram
      .filter(opt => {
        // Filter by generation
        if (opt.min_generation && genNumber && genNumber < opt.min_generation) return false;
        if (opt.max_generation && genNumber && genNumber > opt.max_generation) return false;
        
        // Filter by applicable type (ddr3/ddr4)
        if (genNumber && genNumber >= 3 && genNumber <= 5) {
          // 3rd-5th gen uses DDR3
          if (opt.applicable_to !== 'ddr3') return false;
        } else if (genNumber && genNumber >= 6) {
          // 6th gen and above uses DDR4
          if (opt.applicable_to !== 'ddr4' && opt.applicable_to !== 'all') return false;
        }
        
        // Only show larger sizes than current RAM
        return opt.size_number > currentRAM;
      })
      .map(opt => {
        // Generate option key matching ProductEditor format: ram-{id}
        const optionKey = `ram-${opt.id}`;

        // Check for custom pricing for this specific product
        const customPrice = product?.custom_upgrade_pricing?.[optionKey];
        const finalPrice = customPrice !== undefined ? customPrice : opt.price;

        console.log('RAM option pricing:', {
          optionKey,
          defaultPrice: opt.price,
          customPrice,
          finalPrice,
          hasCustomPrice: customPrice !== undefined
        });

        return {
          id: `ram-${opt.id}`,
          size: opt.size,
          sizeNumber: opt.size_number,
          description: opt.description || opt.display_label,
          price: finalPrice,
          defaultPrice: opt.price,
          isCustomPrice: customPrice !== undefined,
          label: opt.display_label
        };
      })
      .sort((a, b) => a.sizeNumber - b.sizeNumber); // Sort by size
  }, [upgradeOptions.ram, product?.ram, product?.generation, product?.custom_upgrade_pricing]);

  // SSD upgrade options (replaces existing drive) - show only larger capacities than current storage
  const ssdUpgrades = useMemo(() => {
    const storageText = product?.hdd || '256GB';
    const text = String(storageText).toUpperCase().trim();
    let currentSSDSize = 0;
    
    if (text.includes('TB')) {
      const n = parseFloat(text.replace(/[^0-9\.]/g, '')) || 0;
      currentSSDSize = Math.round(n * 1024);
    } else {
      const n = parseFloat(text.replace(/[^0-9\.]/g, '')) || 0;
      currentSSDSize = Math.round(n);
    }
    
    console.log('Filtering SSD options:', { currentSSDSize, totalOptions: upgradeOptions.ssd.length });
    
    return upgradeOptions.ssd
      .filter(opt => opt.size_number > currentSSDSize)
      .map(opt => {
        // Generate option key matching ProductEditor format: ssd-{id}
        const optionKey = `ssd-${opt.id}`;

        // Check for custom pricing for this specific product
        const customPrice = product?.custom_upgrade_pricing?.[optionKey];
        const finalPrice = customPrice !== undefined ? customPrice : opt.price;

        console.log('SSD option pricing:', {
          optionKey,
          defaultPrice: opt.price,
          customPrice,
          finalPrice,
          hasCustomPrice: customPrice !== undefined
        });

        return {
          id: `ssd-${opt.id}`,
          size: opt.size,
          sizeNumber: opt.size_number,
          description: opt.description || opt.display_label,
          price: finalPrice,
          defaultPrice: opt.price,
          isCustomPrice: customPrice !== undefined,
          label: opt.display_label
        };
      })
      .sort((a, b) => a.sizeNumber - b.sizeNumber); // Sort by size
  }, [upgradeOptions.ssd, product?.hdd, product?.custom_upgrade_pricing]);

  // Calculate total price when customizations change
  useEffect(() => {
    let additionalCost = 0;
    let updatedSpecs = {
      ram: product?.ram || '8GB',
      storage: product?.hdd || '256GB SSD'
    };

    if (customizations.ramUpgrade) {
      // Replace existing RAM: add upgrade price to cost
      additionalCost += parseFloat(customizations.ramUpgrade.price) || 0;
      // Update RAM specification - replace with new RAM size
      updatedSpecs.ram = `${customizations.ramUpgrade.size}`;
    }

    if (customizations.ssdUpgrade) {
      additionalCost += parseFloat(customizations.ssdUpgrade.price) || 0;
      // Update storage specification
      updatedSpecs.storage = `${customizations.ssdUpgrade.size} NVMe SSD`;
    }

    const basePrice = parseFloat(product?.price) || 0;
    const newTotalPrice = basePrice + additionalCost;
    setTotalPrice(newTotalPrice);

    // Notify parent component of changes including updated specs
    if (onCustomizationChange) {
      const dataToSend = {
        customizations,
        additionalCost,
        totalPrice: newTotalPrice,
        updatedSpecs // Add this to communicate spec changes
      };
      console.log('Sending customization data to parent:', dataToSend);
      console.log('Base price:', basePrice, 'Additional cost:', additionalCost, 'Total:', newTotalPrice);
      onCustomizationChange(dataToSend);
    }
  }, [customizations, product?.price, product?.ram, product?.hdd, onCustomizationChange]);

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
      {product?.show_ram_options !== false && !loading && ramModules.length > 0 && (
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
      )}

      {/* SSD Upgrades */}
      {product?.show_ssd_options !== false && (
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
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading upgrade options...</p>
          </div>
        ) : ssdUpgrades.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No SSD upgrade options available for this laptop.</p>
            <p className="text-sm text-gray-500 mt-1">Current Storage: {product?.hdd || '256GB SSD'}</p>
          </div>
        ) : (
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
        )}
      </div>
      )}

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