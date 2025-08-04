import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTaskDetail } from '../../services/dataSystem';

interface TaskDetail {
  id: string;
  store_id: string | number;
  chain: string;
  status: string;
  created_at: string;
  success: boolean;
}

interface TaskDetailModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, isOpen, onClose }) => {
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    getTaskDetail(taskId)
      .then(data => {
        setDetail({
          id: data.task_id,
          chain: data.chain,
          store_id: data.store_id,
          status: data.status,
          created_at: data.created_at,
          success: data.result.status === 'success',
        });
      })
      .catch(() => setDetail(null));
  }, [isOpen, taskId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-green-600 rounded-t-2xl px-6 py-4">
          <h3 className="text-white text-lg font-semibold">Chi tiết Task</h3>
          <button onClick={onClose} className="text-white hover:text-green-200 transition">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {!detail ? (
            <div className="col-span-full text-center text-gray-500">Đang tải chi tiết…</div>
          ) : (
            <>
              <div>
                <div className="text-xs text-gray-500">ID Task</div>
                <div className="text-gray-900 font-medium break-all">{detail.id}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Chuỗi</div>
                <div className="text-gray-900 font-medium capitalize">{detail.chain === "WM" ? "Winmart": "Bách hóa xanh"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Cửa hàng</div>
                <div className="text-gray-900 font-medium break-all">{detail.store_id}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Trạng thái</div>
                <div className="flex items-center space-x-2">
                  {detail.success ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <span className={detail.success ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                    {detail.status.charAt(0).toUpperCase() + detail.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500">Tạo lúc</div>
                <div className="text-gray-900 font-medium">
                  {new Date(detail.created_at).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 px-6 pb-6">
          <button
            onClick={() => {
              if (detail) {
                navigate(
                  `/admin/products/store/${detail.store_id}?page=0&size=50&category=&search=&min_price=&max_price=`
                );
              }
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition"
          >
            Xem sản phẩm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
