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
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8 flex items-center justify-between relative">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="relative">
              <button
                onClick={() => setShowList(prev => !prev)}
                className="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Notifications"
              >
                <BellIcon className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showList && (
                <>
                  <div className="absolute right-3 top-full mt-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white" />
                  <ul className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {notifications.map(item => (
                      <li
                        key={item.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                        onClick={() => handleSelect(item)}
                      >
                        <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                      </li>
                    ))}
                    {notifications.length === 0 && (
                      <li className="px-4 py-3 text-gray-500">Không có thông báo</li>
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>

          {children}
        </main>
      </div>
    </>
  );
};
