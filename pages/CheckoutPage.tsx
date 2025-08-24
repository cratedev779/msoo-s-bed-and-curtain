
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth, useCheckout } from '../contexts/AppContext';
import { DELIVERY_LOCATIONS_KENYA } from '../constants';
import { getCurrentLocation, Coordinates } from '../services/locationService';
import Button from '../components/Button';
import Modal from '../components/Modal';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useCheckout();
  const navigate = useNavigate();

  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'prompt' | 'processing' | 'success'>('prompt');
  const [locationMessage, setLocationMessage] = useState<string>('');
  
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleLocationRequest = async () => {
    setLocationMessage('Requesting location...');
    try {
      const coords: Coordinates = await getCurrentLocation();
      setLocationMessage(`Location captured: Lat ${coords.latitude.toFixed(4)}, Lon ${coords.longitude.toFixed(4)}`);
    } catch (error: any) {
      setLocationMessage(`Error: ${error.message}`);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryLocation || !phone) {
        alert("Please fill in all required fields.");
        return;
    }
    setIsMpesaModalOpen(true);
  };
  
  const handleMpesaPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      
      const newOrder = {
        user: user!,
        items: cart,
        total: cartTotal,
        deliveryLocation: deliveryLocation,
        status: 'Processing' as const,
      };
      createOrder(newOrder);

      setTimeout(() => {
          setIsMpesaModalOpen(false);
          clearCart();
          navigate('/order-confirmation');
      }, 2000);
    }, 4000); // Simulate processing time
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" value={user?.name || ''} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" value={user?.email || ''} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
          </div>
          <div className="mt-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Delivery County</label>
            <select id="location" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary">
              <option value="">Select a county</option>
              {DELIVERY_LOCATIONS_KENYA.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-medium text-gray-700">Precise Location (Optional)</h3>
            <p className="text-sm text-gray-500 mb-2">Click to share your current location for more accurate delivery.</p>
            <Button type="button" variant="secondary" onClick={handleLocationRequest}>Use My Current Location</Button>
            {locationMessage && <p className="mt-2 text-sm text-gray-600">{locationMessage}</p>}
          </div>
          <div className="mt-8 text-right">
             <Button type="submit">Place Order</Button>
          </div>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold border-b pb-4 mb-4">Your Order</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 text-sm">
              <span className="text-gray-600">{item.name} x {item.quantity}</span>
              <span className="font-medium">Ksh {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
            <span>Total</span>
            <span>Ksh {cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* M-Pesa Modal */}
      <Modal isOpen={isMpesaModalOpen} onClose={() => setIsMpesaModalOpen(false)} title="M-Pesa Payment">
         {paymentStep === 'prompt' && (
             <div>
                 <p className="mb-4">You will pay <span className="font-bold">Ksh {cartTotal.toLocaleString()}</span> using M-Pesa.</p>
                 <p className="mb-4">Your M-Pesa number is <span className="font-bold">{phone}</span>.</p>
                 <p className="text-sm text-gray-600 mb-6">Click "Confirm" to receive a payment prompt on your phone. Enter your PIN to authorize the payment.</p>
                 <Button onClick={handleMpesaPayment} className="w-full">Confirm & Pay</Button>
             </div>
         )}
         {paymentStep === 'processing' && (
             <div className="text-center">
                  <div className="flex justify-center items-center mb-4">
                     <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                  </div>
                 <p className="font-semibold">Processing Payment...</p>
                 <p className="text-sm text-gray-600">Please check your phone and enter your M-Pesa PIN.</p>
             </div>
         )}
         {paymentStep === 'success' && (
             <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                 <p className="font-semibold text-lg">Payment Successful!</p>
                 <p className="text-sm text-gray-600">Your order has been placed. Redirecting...</p>
             </div>
         )}
      </Modal>
    </div>
  );
};

export default CheckoutPage;
