// src/components/Layout/DashboardLayout.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BellIcon } from '@heroicons/react/24/outline';
import { Toaster, toast } from 'react-hot-toast';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Cập nhật hệ thống', message: 'Hệ thống sẽ bảo trì vào 22h hôm nay.', type: 'info' },
    { id: '2', title: 'Đơn hàng mới', message: 'Bạn có đơn hàng #12345 vừa được tạo.', type: 'success' },
  ]);
  const [showList, setShowList] = useState(false);

  // Toast khi login thành công
  useEffect(() => {
    if ((location.state as any)?.success) {
      toast.success('Đăng nhập thành công!');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSelect = (item: NotificationItem) => {
    const content = item.message || item.title;
    switch (item.type) {
      case 'success':
        toast.success(content);
        break;
      case 'error':
        toast.error(content);
        break;
      case 'warning':
        toast(content);
        break;
      case 'info':
      default:
        toast(content);
    }
    setShowList(false);
  };

  return (
    <>
      {/* Toast container */}
      <Toaster position="top-right" />

      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">

          {children}
        </main>
      </div>
    </>
  );
};
