// Upgrade pricing configuration for laptop products
// Prices are now fetched from database instead of hardcoded values
// This file provides helper functions to work with upgrade pricing

// Default/fallback prices (used if database fetch fails)
const DEFAULT_PRICES = {
  ram_ddr3_4gb: 1000,
  ram_ddr3_8gb: 2500,
  ram_ddr4_4gb: 3200,
  ram_ddr4_8gb: 6000,
  ram_ddr4_16gb: 11500,
  ram_ddr4_32gb: 25000,
  ssd_128_to_256: 3000,
  ssd_128_to_512: 8000,
  ssd_128_to_1tb: 18500,
  ssd_256_to_512: 5500,
  ssd_256_to_1tb: 15500,
  ssd_512_to_1tb: 10000
};

// Cache for pricing data (to avoid repeated API calls)
let pricingCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch pricing from database
export const fetchUpgradePricing = async () => {
  // Return cached data if still valid
  if (pricingCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return pricingCache;
  }

  try {
    const response = await fetch('/api/upgrade-pricing');
    if (response.ok) {
      const data = await response.json();
      pricingCache = data;
      cacheTimestamp = Date.now();
      return data;
    }
  } catch (error) {
    console.error('Failed to fetch upgrade pricing:', error);
  }

  // Return default prices if fetch fails
  return DEFAULT_PRICES;
};

// Helper function to get RAM options based on processor generation
export const getRAMOptionsByGeneration = async (generation) => {
  if (!generation) return [];

  const pricing = await fetchUpgradePricing();

  const ddr3Generations = ['3rd Gen', '4th Gen', '5th Gen'];
  const ddr4Generations = ['6th Gen', '7th Gen', '8th Gen', '9th Gen', '10th Gen', '11th Gen'];

  // Check if generation matches DDR3 (3rd-5th Gen)
  if (ddr3Generations.includes(generation)) {
    return [
      { capacity: '4GB', price: pricing.ram_ddr3_4gb, label: '4GB DDR3' },
      { capacity: '8GB', price: pricing.ram_ddr3_8gb, label: '8GB DDR3' }
    ];
  }

  // Check if generation matches DDR4 (6th-11th Gen)
  if (ddr4Generations.includes(generation)) {
    return [
      { capacity: '4GB', price: pricing.ram_ddr4_4gb, label: '4GB DDR4' },
      { capacity: '8GB', price: pricing.ram_ddr4_8gb, label: '8GB DDR4' },
      { capacity: '16GB', price: pricing.ram_ddr4_16gb, label: '16GB DDR4' },
      { capacity: '32GB', price: pricing.ram_ddr4_32gb, label: '32GB DDR4' }
    ];
  }

  return [];
};

// Helper function to get RAM type based on generation
export const getRAMTypeByGeneration = (generation) => {
  if (!generation) return 'DDR4';

  const ddr3Generations = ['3rd Gen', '4th Gen', '5th Gen'];
  const ddr4Generations = ['6th Gen', '7th Gen', '8th Gen', '9th Gen', '10th Gen', '11th Gen'];

  if (ddr3Generations.includes(generation)) {
    return 'DDR3/DDR3L';
  }

  if (ddr4Generations.includes(generation)) {
    return 'DDR4';
  }

  return 'DDR4';
};

// Helper function to get SSD upgrade options based on current storage
export const getSSDUpgradeOptions = async (currentStorage) => {
  if (!currentStorage) return [];

  const pricing = await fetchUpgradePricing();

  // Normalize storage string (e.g., "128GB SSD" -> "128GB", "125 GB" -> "125GB")
  const storageMatch = currentStorage.match(/(\d+)\s*(GB|TB)/i);
  if (!storageMatch) return [];

  let normalizedStorage = storageMatch[1] + storageMatch[2].toUpperCase();

  const upgrades = [];

  // From 128GB or 125GB
  if (normalizedStorage === '128GB' || normalizedStorage === '125GB') {
    return [
      { capacity: '256GB', price: pricing.ssd_128_to_256, label: 'Upgrade to 256GB SSD', from: normalizedStorage },
      { capacity: '512GB', price: pricing.ssd_128_to_512, label: 'Upgrade to 512GB SSD', from: normalizedStorage },
      { capacity: '1TB', price: pricing.ssd_128_to_1tb, label: 'Upgrade to 1TB SSD', from: normalizedStorage }
    ];
  }

  // From 256GB
  if (normalizedStorage === '256GB') {
    return [
      { capacity: '512GB', price: pricing.ssd_256_to_512, label: 'Upgrade to 512GB SSD', from: normalizedStorage },
      { capacity: '1TB', price: pricing.ssd_256_to_1tb, label: 'Upgrade to 1TB SSD', from: normalizedStorage }
    ];
  }

  // From 512GB
  if (normalizedStorage === '512GB') {
    return [
      { capacity: '1TB', price: pricing.ssd_512_to_1tb, label: 'Upgrade to 1TB SSD', from: normalizedStorage }
    ];
  }

  return upgrades;
};

// Helper function to get ALL SSD options for any laptop (shows all options regardless of current storage)
export const getAllSSDOptions = async () => {
  const pricing = await fetchUpgradePricing();
  
  return [
    { capacity: '256GB', price: pricing.ssd_128_to_256, label: '256GB SSD' },
    { capacity: '512GB', price: pricing.ssd_128_to_512, label: '512GB SSD' },
    { capacity: '1TB', price: pricing.ssd_128_to_1tb, label: '1TB SSD' }
  ];
};

// Helper function to calculate upgrade price
export const calculateUpgradePrice = async (currentStorage, targetStorage) => {
  if (!currentStorage || !targetStorage) return 0;

  const pricing = await fetchUpgradePricing();

  const currentMatch = currentStorage.match(/(\d+)\s*(GB|TB)/i);
  const targetMatch = targetStorage.match(/(\d+)\s*(GB|TB)/i);

  if (!currentMatch || !targetMatch) return 0;

  let normalizedCurrent = currentMatch[1] + currentMatch[2].toUpperCase();
  const normalizedTarget = targetMatch[1] + targetMatch[2].toUpperCase();

  // From 128GB/125GB
  if ((normalizedCurrent === '128GB' || normalizedCurrent === '125GB')) {
    if (normalizedTarget === '256GB') return pricing.ssd_128_to_256;
    if (normalizedTarget === '512GB') return pricing.ssd_128_to_512;
    if (normalizedTarget === '1TB') return pricing.ssd_128_to_1tb;
  }

  // From 256GB
  if (normalizedCurrent === '256GB') {
    if (normalizedTarget === '512GB') return pricing.ssd_256_to_512;
    if (normalizedTarget === '1TB') return pricing.ssd_256_to_1tb;
  }

  // From 512GB
  if (normalizedCurrent === '512GB') {
    if (normalizedTarget === '1TB') return pricing.ssd_512_to_1tb;
  }

  return 0;
};

// Helper function to get all available storage capacities for SSD upgrades
export const getAvailableStorageCapacities = () => {
  return ['125GB', '128GB', '256GB', '512GB', '1TB'];
};

// Helper function to validate if upgrade path exists
export const isValidUpgradePath = async (currentStorage, targetStorage) => {
  const currentMatch = currentStorage.match(/(\d+)\s*(GB|TB)/i);
  const targetMatch = targetStorage.match(/(\d+)\s*(GB|TB)/i);

  if (!currentMatch || !targetMatch) return false;

  let normalizedCurrent = currentMatch[1] + currentMatch[2].toUpperCase();
  const normalizedTarget = targetMatch[1] + targetMatch[2].toUpperCase();

  // Valid upgrade paths
  const validPaths = {
    '125GB': ['256GB', '512GB', '1TB'],
    '128GB': ['256GB', '512GB', '1TB'],
    '256GB': ['512GB', '1TB'],
    '512GB': ['1TB']
  };

  const allowedUpgrades = validPaths[normalizedCurrent];
  if (!allowedUpgrades) return false;

  return allowedUpgrades.includes(normalizedTarget);
};
