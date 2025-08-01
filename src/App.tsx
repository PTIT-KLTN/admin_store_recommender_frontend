import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/AdminAuth/Login';
import DashboardPage from './pages/Dashboard';
import DishManagementPage from './pages/DishManagementPage';
import IngredientManagementPage from './pages/IngredientManagementPage';
import AccountManagementPage from './pages/AccountManagementPage';
import AccountPage from './pages/AccountPage';
import DataSystemPage from './pages/DataSystemPage';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => (
  <>
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dishes" element={<DishManagementPage />} />
        <Route path="/ingredients" element={<IngredientManagementPage />} />  
        <Route path="/accounts" element={<AccountManagementPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/data-system" element={<DataSystemPage />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>

    {/* Toast container for notifications */}
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </>
);

export default App;
