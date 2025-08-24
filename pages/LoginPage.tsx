import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isLoginView) {
      const { user, error } = await login(email, password);
      if (user) {
        navigate(user.role === 'admin' ? '/admin' : '/');
      } else {
        setError(error || 'Invalid email or password.');
      }
    } else {
      if (!name || !phone || !email || !password) {
        setError("All fields are required for signup.");
        setIsLoading(false);
        return;
      }
      const { success, error } = await signup({ name, email, phone, password });
      if (error) {
          setError(error);
      } else {
          navigate('/');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-primary mb-6">{isLoginView ? 'Login' : 'Create Account'}</h1>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
          <form onSubmit={handleSubmit}>
            {!isLoginView && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 mb-3"
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit" isLoading={isLoading} className="w-full">
                {isLoginView ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-bold text-primary hover:text-secondary ml-1">
              {isLoginView ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;