// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { AdminLogin } from './components/AdminAuth/Login';
import DashboardPage from './pages/Dashboard';
import DishManagementPage from './pages/DishManagementPage';
import IngredientManagementPage from './pages/IngredientManagementPage';
import AccountManagementPage from './pages/AccountManagementPage';
import AccountPage from './pages/AccountPage';
import DataSystemPage from './pages/DataSystemPage';
import StoreProductsPage from './pages/StoreProductPage';
import ForgotPasswordRequest from './components/AdminAuth/ForgotPasswordRequest';
import ResetPassword from './components/AdminAuth/ResetPassword';
import ProtectedRoute from './components/AdminAuth/ProtectedRoute';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-right" autoClose={3000} />

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* SUPER_ADMIN + ADMIN */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dishes" element={<DishManagementPage />} />
              <Route path="/ingredients" element={<IngredientManagementPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/admin/products/store/:store_id" element={<StoreProductsPage />} />
            </Route>

            {/* SUPER_ADMIN only */}
            <Route
              path="/accounts"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AccountManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-system"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <DataSystemPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
