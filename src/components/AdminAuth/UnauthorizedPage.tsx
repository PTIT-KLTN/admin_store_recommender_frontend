// src/components/Auth/UnauthorizedPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const UnauthorizedPage: React.FC = () => {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
        <LockClosedIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Không có quyền truy cập</h1>
        <p className="text-gray-600 mb-6">Bạn không được phép xem trang này.</p>
        <button
          onClick={() => nav(-1)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
