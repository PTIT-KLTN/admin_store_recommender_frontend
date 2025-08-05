// src/components/Auth/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import UnauthorizedPage from './UnauthorizedPage';

interface Props {
  allowedRoles: string[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext)!;

  if (!user) {
    // chưa login -> về login
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    // login nhưng không đủ quyền -> show unauthorized
    return <UnauthorizedPage />;
  }
  // đủ quyền -> render bình thường
  return children;
}

export default ProtectedRoute;
