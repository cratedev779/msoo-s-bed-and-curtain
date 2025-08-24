
import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/AppContext';
import { Search } from 'lucide-react';
import type { Product } from '../types';

const HeroSection: React.FC = () => (
  <div className="bg-accent py-20 px-4 text-center">
    <div className="container mx-auto">
      <h1 className="text-5xl font-serif font-bold text-primary mb-4">Elegance & Comfort for Your Home</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Discover our curated collection of luxurious beddings and exquisite curtains, designed to transform your space into a sanctuary.
      </p>
      <a href="#products" className="bg-primary text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
        Shop Now
      </a>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const allProducts = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Curtains' | 'Beddings'>('All');

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <HeroSection />

      <div id="products" className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-serif font-bold text-center text-primary mb-8">Our Collection</h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="flex space-x-2 p-1 bg-gray-200 rounded-md">
            {(['All', 'Curtains', 'Beddings'] as const).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">No products found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
