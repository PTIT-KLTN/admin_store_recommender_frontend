// App.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminLogin } from './components/AdminAuth/Login';
import DashboardPage from './pages/Dashboard';
import DishManagementPage from './pages/DishManagementPage';
import IngredientManagementPage from './pages/IngredientManagementPage';
import AccountManagementPage from './pages/AccountManagementPage';
import AccountPage from './pages/AccountPage';
import { DataSystemPage } from './pages/DataSystemPage';
import StoreProductsPage from './pages/StoreProductPage';
import ForgotPasswordRequest from './components/AdminAuth/ForgotPasswordRequest';
import ResetPassword from './components/AdminAuth/ResetPassword';
import ProtectedRoute from './components/AdminAuth/ProtectedRoute';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    {/* ToastContainer có thể nằm ở đây chung với provider */}
    <ToastContainer position="bottom-right" autoClose={3000} />

    {/* BrowserRouter bao lấy tất cả Routes */}
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dishes" element={<DishManagementPage />} />
        <Route path="/ingredients" element={<IngredientManagementPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
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

        <Route
          path="/admin/products/store/:store_id"
          element={<StoreProductsPage />}
        />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
