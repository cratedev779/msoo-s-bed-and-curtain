import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts, useCart } from '../contexts/AppContext';
import { ShoppingCart } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const products = useProducts();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="container mx-auto px-6 py-12 text-center">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div>
          <span className="text-sm font-semibold text-secondary">{product.category}</span>
          <h1 className="text-4xl font-serif font-bold text-primary mt-2 mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mb-6">Ksh {product.price.toLocaleString()}</p>
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
          
          <button
            onClick={() => addToCart(product)}
            className="w-full md:w-auto flex items-center justify-center bg-primary text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition-colors font-semibold"
          >
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;