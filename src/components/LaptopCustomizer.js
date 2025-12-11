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

        // Filter by applicable RAM type based on generation
        // If applicable_to is not set or is 'all', show for all generations
        const applicableTo = opt.applicable_to || 'all';

        // Check if product has explicit RAM type support specified (especially for 12th gen)
        const supportedRamType = product?.supported_ram_type || product?.supportedRamType;

        if (genNumber && applicableTo !== 'all') {
          // If admin has specified RAM type support, use that
          if (supportedRamType) {
            if (applicableTo !== supportedRamType && applicableTo !== 'all') return false;
          } else {
            // Auto-detect based on generation
            if (genNumber >= 3 && genNumber <= 5) {
              // 3rd-5th gen uses DDR3
              if (!['ddr3', 'all'].includes(applicableTo)) return false;
            } else if (genNumber === 6) {
              // 6th gen can use DDR3 or DDR4
              if (!['ddr3', 'ddr3_6th', 'ddr4', 'all'].includes(applicableTo)) return false;
            } else if (genNumber >= 7 && genNumber <= 11) {
              // 7th-11th gen uses DDR4
              if (!['ddr4', 'all'].includes(applicableTo)) return false;
            } else if (genNumber === 12) {
              // 12th gen can use DDR4 or DDR5 - show both by default if not specified
              if (!['ddr4', 'ddr5', 'all'].includes(applicableTo)) return false;
            } else if (genNumber >= 13) {
              // 13th gen+ uses DDR5
              if (!['ddr5', 'all'].includes(applicableTo)) return false;
            }
          }
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
          label: opt.display_label,
          applicableTo: opt.applicable_to
        };
      })
      .sort((a, b) => a.sizeNumber - b.sizeNumber)
      // Deduplicate by size - keep only one option per size (prefer cheaper price)
      .reduce((acc, opt) => {
        const existing = acc.find(o => o.sizeNumber === opt.sizeNumber);
        if (!existing) {
          acc.push(opt);
        } else if (opt.price < existing.price) {
          // Replace with cheaper option
          const index = acc.indexOf(existing);
          acc[index] = opt;
        }
        return acc;
      }, []); // Sort by size
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

  // Check if this is an Apple product
  const isAppleProduct = product?.brand?.toLowerCase() === 'apple' ||
                         product?.name?.toLowerCase().includes('macbook');

  // For Apple products, don't show this customizer - they have their own AppleCustomizer
  if (isAppleProduct) return null;

  // Don't render if no options available
  if (!loading && ramModules.length === 0 && ssdUpgrades.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6dc1c9] to-teal-500 px-4 py-3">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Customize Your Laptop
        </h3>
      </div>

      <div className="p-4 space-y-5">
        {/* RAM Upgrade Section */}
        {product?.show_ram_options !== false && !loading && ramModules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6dc1c9]/10 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#6dc1c9]" />
              </div>
              <span className="font-semibold text-gray-800">RAM Upgrade</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ramModules.map((ram) => (
                <button
                  key={ram.id}
                  onClick={() => handleRamUpgrade(ram)}
                  className={`relative text-left p-3 rounded-xl transition-all ${
                    customizations.ramUpgrade?.id === ram.id
                      ? 'bg-[#6dc1c9] text-white shadow-lg shadow-[#6dc1c9]/30'
                      : 'bg-white border border-gray-200 hover:border-[#6dc1c9] hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{ram.size}</span>
                    <span className={`font-bold ${customizations.ramUpgrade?.id === ram.id ? 'text-white' : 'text-[#6dc1c9]'}`}>
                      +Rs:{ram.price.toLocaleString()}
                    </span>
                  </div>
                  <div className={`text-xs mt-1 ${customizations.ramUpgrade?.id === ram.id ? 'text-teal-100' : 'text-gray-500'}`}>
                    {product?.ram || '8GB'} → {ram.size}
                  </div>
                  {customizations.ramUpgrade?.id === ram.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                      <svg className="w-3 h-3 text-[#6dc1c9]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SSD Upgrade Section */}
        {product?.show_ssd_options !== false && !loading && ssdUpgrades.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6dc1c9]/10 flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-[#6dc1c9]" />
              </div>
              <span className="font-semibold text-gray-800">Storage Upgrade</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ssdUpgrades.map((ssd) => (
                <button
                  key={ssd.id}
                  onClick={() => handleSsdUpgrade(ssd)}
                  className={`relative text-left p-3 rounded-xl transition-all ${
                    customizations.ssdUpgrade?.id === ssd.id
                      ? 'bg-[#6dc1c9] text-white shadow-lg shadow-[#6dc1c9]/30'
                      : 'bg-white border border-gray-200 hover:border-[#6dc1c9] hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{ssd.size}</span>
                    <span className={`font-bold ${customizations.ssdUpgrade?.id === ssd.id ? 'text-white' : 'text-[#6dc1c9]'}`}>
                      +Rs:{ssd.price.toLocaleString()}
                    </span>
                  </div>
                  <div className={`text-xs mt-1 ${customizations.ssdUpgrade?.id === ssd.id ? 'text-teal-100' : 'text-gray-500'}`}>
                    {product?.hdd || 'Current'} → {ssd.size} NVMe SSD
                  </div>
                  {customizations.ssdUpgrade?.id === ssd.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                      <svg className="w-3 h-3 text-[#6dc1c9]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Summary */}
        {(customizations.ramUpgrade || customizations.ssdUpgrade) && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#6dc1c9]/10 flex items-center justify-center">
                <span className="text-[#6dc1c9] text-xs">₨</span>
              </div>
              Price Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Base Price</span>
                <span className="font-medium text-gray-800">Rs:{parseInt(product?.price || 0).toLocaleString()}</span>
              </div>
              {customizations.ramUpgrade && (
                <div className="flex justify-between">
                  <span className="text-[#6dc1c9]">+ RAM ({customizations.ramUpgrade.size})</span>
                  <span className="font-medium text-gray-800">Rs:{customizations.ramUpgrade.price.toLocaleString()}</span>
                </div>
              )}
              {customizations.ssdUpgrade && (
                <div className="flex justify-between">
                  <span className="text-[#6dc1c9]">+ SSD ({customizations.ssdUpgrade.size})</span>
                  <span className="font-medium text-gray-800">Rs:{customizations.ssdUpgrade.price.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-dashed border-gray-200">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-[#6dc1c9] text-lg">Rs:{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setCustomizations({ ramUpgrade: null, ssdUpgrade: null })}
              className="w-full text-center text-xs text-gray-400 hover:text-red-500 mt-3 transition-colors"
            >
              Reset configuration
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#6dc1c9] border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}