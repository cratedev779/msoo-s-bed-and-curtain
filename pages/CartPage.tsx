import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/AppContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  }

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-serif font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => navigate('/')} className="bg-primary text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div>
                  <h2 className="font-semibold text-lg text-primary">{item.name}</h2>
                  <p className="text-gray-500">Ksh {item.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="p-2 hover:bg-gray-100"><Minus size={16} /></button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="p-2 hover:bg-gray-100"><Plus size={16} /></button>
                </div>
                <p className="font-bold w-24 text-right">Ksh {(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold border-b pb-4 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>Ksh {cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Total</span>
            <span>Ksh {cartTotal.toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} className="mt-6 w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition-colors font-semibold">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;