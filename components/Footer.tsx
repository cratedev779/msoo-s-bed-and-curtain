
import React from 'react';
import { Facebook, Twitter, Instagram, Phone, Truck } from 'lucide-react';
import { APP_NAME, SOCIAL_LINKS, WHATSAPP_NUMBER } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-accent mt-16">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">{APP_NAME}</h3>
            <p className="text-sm text-gray-300">
              Bringing comfort and style to your home with our premium collection of curtains and beddings.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#/" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="#/cart" className="hover:text-secondary transition-colors">Your Cart</a></li>
              <li><a href="#/login" className="hover:text-secondary transition-colors">Account</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors"><Facebook size={24} /></a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors"><Twitter size={24} /></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors"><Instagram size={24} /></a>
            </div>
             <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm hover:text-secondary transition-colors">
                <Phone size={18} />
                <span>Chat on WhatsApp</span>
             </a>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
           <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Truck size={20} className="text-secondary"/>
                <span>Nationwide Delivery Across Kenya</span>
            </div>
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
