// src/components/Layout/DashboardLayout.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if ((location.state as any)?.success) {
      // toast.success('Đăng nhập thành công!');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />

      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">

          {children}
        </main>
      </div>
    </>
  );
};
