
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAuth, useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { state: { isLoading } } = useAppContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral font-sans text-primary">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
           <Route path="/order-confirmation" element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;