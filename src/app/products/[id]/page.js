'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, GitCompareArrows, Truck, Shield, RotateCcw, Award, Plus, Minus } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCompare } from '../../../context/CompareContext';
import { products } from '../../../lib/data';
import ProductCard from '../../../components/ProductCard';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  useEffect(() => {
    if (params.id) {
      const foundProduct = products.find(p => p.id === parseInt(params.id));
      setProduct(foundProduct);
      
      if (foundProduct) {
        // Get related products from same category
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Reset quantity after adding
    setQuantity(1);
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompare = () => {
    addToCompare(product);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productImages = [
    '/next.png', // Main image
    '/next.png', // Additional images would go here
    '/next.png',
    '/next.png'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Teal Background */}
      <div className="bg-teal-500 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Product Image */}
            <div className="flex justify-center">
              <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-md">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  width={350}
                  height={250}
                  className="object-contain w-full h-auto"
                />
                {/* Zoom Icon */}
                <button className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="text-white space-y-6">
              {/* Category */}
              <div className="text-white text-sm">
                <span className="font-medium">Category</span> 
                <span className="capitalize ml-2">{product.category === 'used-laptop' ? 'Hp' : product.category}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-4xl font-bold leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-teal-100 leading-relaxed">
                A business laptop powered by the latest Intel Tiger Lake i5 10th Gen, featuring strong 
                graphics and fast performance with a 13.3&quot; screen and 16GB RAM.
              </p>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  {product.originalPrice && (
                    <span className="text-xl text-teal-200 line-through">
                      Rs {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-white">
                    Rs {product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                {/* Quantity */}
                <div className="flex items-center bg-white rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-800 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Add to cart
                </button>

                {/* Compare */}
                <button
                  onClick={handleCompare}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isInCompare(product.id)
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-800'
                  }`}
                >
                  ⚖ Compare
                </button>
              </div>

              {/* Wishlist */}
              <div className="pt-2">
                <button
                  onClick={handleWishlist}
                  className={`flex items-center space-x-2 text-sm ${
                    isInWishlist(product.id) ? 'text-red-300' : 'text-teal-200 hover:text-white'
                  } transition-colors`}
                >
                  <svg className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{isInWishlist(product.id) ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specification')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'specification'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Specification
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Reviews (0)
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Wrap your laptop in a snug, colorful sleeve. The durable neoprene material helps keep your PC safe from the elements, as well as from bumps and scrapes. Easily reversible so you can change colors to suit your mood.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Features:</strong> Its reversible design lets you change up the color whenever you want. And with its sleek, zipper-less enclosure your laptop can enjoy a convenient, reliable fit.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This flexible and durable neoprene sleeve helps protect your PC from the elements, as well as from bumps and scrapes. Take your laptop along with confidence.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Fits up to 35.56 cm (14&rdquo;) diagonal laptops
                </p>
                <div className="mt-6">
                  <p className="text-gray-700">
                    <strong>Specifications:</strong> • Weight: 0.19 kg • Minimum dimensions (W x D x H): 265 x 365 x 10 mm
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specification' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <span className="font-medium text-gray-800">Brand:</span>
                      <span className="ml-2 text-gray-600">{product.brand}</span>
                    </div>
                    {product.processor && (
                      <div className="border-b pb-2">
                        <span className="font-medium text-gray-800">Processor:</span>
                        <span className="ml-2 text-gray-600">{product.processor}</span>
                      </div>
                    )}
                    {product.ram && (
                      <div className="border-b pb-2">
                        <span className="font-medium text-gray-800">RAM:</span>
                        <span className="ml-2 text-gray-600">{product.ram}</span>
                      </div>
                    )}
                    {product.storage && (
                      <div className="border-b pb-2">
                        <span className="font-medium text-gray-800">Storage:</span>
                        <span className="ml-2 text-gray-600">{product.storage}</span>
                      </div>
                    )}
                    {product.display && (
                      <div className="border-b pb-2">
                        <span className="font-medium text-gray-800">Display:</span>
                        <span className="ml-2 text-gray-600">{product.display}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <span className="font-medium text-gray-800">Condition:</span>
                      <span className="ml-2 text-gray-600">{product.condition || 'Excellent'}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium text-gray-800">Warranty:</span>
                      <span className="ml-2 text-gray-600">{product.warranty || '6 months'}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium text-gray-800">Category:</span>
                      <span className="ml-2 text-gray-600 capitalize">{product.category.replace('-', ' ')}</span>
                    </div>
                    {product.specifications?.weight && (
                      <div className="border-b pb-2">
                        <span className="font-medium text-gray-800">Weight:</span>
                        <span className="ml-2 text-gray-600">{product.specifications.weight}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to review this product!</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}