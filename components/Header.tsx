
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useCart, useAuth } from '../contexts/AppContext';
import { APP_NAME } from '../constants';

const Logo: React.FC = () => (
  <NavLink to="/" className="text-2xl font-serif font-bold text-primary hover:text-opacity-80 transition-colors">
    {APP_NAME}
  </NavLink>
);

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-accent shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-6">
          <NavLink to="/" className={({ isActive }) => `text-primary hover:text-secondary transition-colors ${isActive ? 'font-bold' : ''}`}>Home</NavLink>
          
          <div className="flex items-center space-x-4">
            <NavLink to="/cart" className="relative text-primary hover:text-secondary transition-colors">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {user ? (
              <div className="group relative">
                <button className="flex items-center text-primary hover:text-secondary transition-colors">
                  <UserIcon size={24} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm text-gray-700 font-semibold">{user.name}</div>
                  {user.role === 'admin' && (
                     <NavLink to="/admin" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <Shield size={16} className="mr-2" />
                        Admin Panel
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <NavLink to="/login" className="text-primary hover:text-secondary transition-colors">
                <UserIcon size={24} />
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
