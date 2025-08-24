import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../contexts/AppContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transition-transform transform hover:-translate-y-2">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-64 w-full">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          <p className="text-lg font-bold text-secondary mt-2">Ksh {product.price.toLocaleString()}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button
          onClick={() => addToCart(product)}
          className="w-full flex items-center justify-center bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;