
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been placed successfully. You will receive an email confirmation shortly.
          We have started processing it and will notify you once it's shipped.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-primary text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition-colors font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
