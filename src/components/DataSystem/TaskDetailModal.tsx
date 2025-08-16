import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, Clock, Loader2 } from 'lucide-react'; // đổi icon đúng theo trạng thái
import { useNavigate } from 'react-router-dom';
import { getTaskDetail } from '../../services/dataSystem';

interface TaskDetail {
  id: string;
  store_id: string | number;
  chain: string;
  status: string;
  created_at: string;
  success: boolean; // giữ nguyên, không dùng để render icon nữa để không ảnh hưởng bố cục/logic khác
}

interface TaskDetailModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

const normalizeStatus = (raw: string) => {
  const s = (raw || '').toLowerCase();
  if (s === 'queued' || s === 'queue') return 'queue';
  if (s === 'proccessing' || s === 'processing') return 'processing';
  if (s === 'completed') return 'completed';
  return 'unknown';
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, isOpen, onClose }) => {
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [otherInfo, setOtherInfo] = useState<Record<string, any> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    getTaskDetail(taskId)
      .then((data: any) => {
        const mapped: TaskDetail = {
          id: data.task_id,
          chain: data.chain,
          store_id: data.store_id,
          status: data.status,
          created_at: data.created_at,
          success: data.result?.status === 'success',
        };
        setDetail(mapped);

        const res = data?.result || {};
        const { status, ...rest } = res || {};
        const cleaned = Object.fromEntries(
          Object.entries(rest || {}).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        setOtherInfo(Object.keys(cleaned).length > 0 ? cleaned : null);
      })
      .catch(() => {
        setDetail(null);
        setOtherInfo(null);
      });
  }, [isOpen, taskId]);

  if (!isOpen) return null;

  const statusLower = (detail?.status || '').toLowerCase();
  const hideProductBtn =
    statusLower === 'queue' ||
    statusLower === 'queued' ||
    statusLower === 'processing' ||
    statusLower === 'proccessing';

  // === Chỉ sửa phần render trạng thái (không đổi bố cục) ===
  const norm = normalizeStatus(detail?.status || '');
  const statusColor =
    norm === 'queue' ? 'text-yellow-600'
    : norm === 'processing' ? 'text-blue-600'
    : norm === 'completed' ? 'text-green-600'
    : 'text-gray-600';

  const StatusIcon =
    norm === 'queue' ? Clock
    : norm === 'processing' ? Loader2
    : norm === 'completed' ? CheckCircle2
    : Clock;

  const statusLabel =
    norm === 'queue' ? 'Queue'
    : norm === 'processing' ? 'Processing'
    : norm === 'completed' ? 'Completed'
    : (detail?.status || 'Unknown');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-green-600 rounded-t-2xl px-6 py-4">
          <h3 className="text-white text-lg font-semibold">Chi tiết Task</h3>
          <button onClick={onClose} className="text-white hover:text-green-200 transition" aria-label="Đóng">
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
                <div className="text-gray-900 font-medium capitalize">
                  {detail.chain === 'WM' ? 'Winmart' : 'Bách hóa xanh'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Cửa hàng</div>
                <div className="text-gray-900 font-medium break-all">{detail.store_id}</div>
              </div>

              {/* Trạng thái – GIỮ nguyên bố cục: chỉ thay icon + màu + nhãn */}
              <div>
                <div className="text-xs text-gray-500">Trạng thái</div>
                <div className="flex items-center space-x-2">
                  <StatusIcon
                    size={20}
                    className={`${statusColor} ${norm === 'processing' ? 'animate-spin' : ''}`}
                  />
                  <span className={`${statusColor} font-medium`}>
                    {statusLabel}
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

              {/* Thông tin khác */}
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500 mb-1">Thông tin khác</div>
                {otherInfo ? (
                  <div className="space-y-1 text-sm text-gray-800">
                    {Object.entries(otherInfo).map(([k, v]) => (
                      <div key={k} className="flex">
                        <span className="w-40 text-gray-500">{k}</span>
                        <span className="flex-1 break-all">
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="italic text-gray-500">Chưa có thông tin</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 px-6 pb-6">
          {!hideProductBtn && (
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
          )}
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
