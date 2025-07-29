import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/AdminAuth/Login';
import DashboardPage from './pages/Dashboard';
import DishManagementPage from './pages/DishManagementPage';


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dishes" element={<DishManagementPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;