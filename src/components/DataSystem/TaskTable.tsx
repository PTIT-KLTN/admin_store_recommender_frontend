import React, { useState } from 'react';
import { Eye } from 'lucide-react';

interface Task {
  id: string;
  chain: string;
  store_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

interface TaskTableProps {
  tasks: Task[];
  onView: (id: string) => void;
}

// Bảng màu cho từng trạng thái
const statusStyles: Record<Task['status'], string> = {
  queued: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const pagedTasks = tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>

      <div className="rounded-2xl shadow-lg border border-gray-200">
        <div className="rounded-2xl max-h-[520px] overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed divide-y divide-gray-300">
            <colgroup>
              <col className="w-36" /> 
              <col className="w-28" /> 
              <col className="w-36" /> 
              <col className="w-36" /> 
              <col className="w-44" />
              <col className="w-36" /> 
            </colgroup>

            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {['ID', 'Chuỗi', 'Cửa hàng', 'Trạng thái', 'Tạo lúc', 'Hành động'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {pagedTasks.map((task, idx) => (
                <tr
                  key={task.id}
                  className={`transition-colors duration-150 ${idx % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 truncate text-sm font-medium text-gray-900">
                    {task.id}...
                  </td>

                  <td className="px-6 py-4 truncate text-sm text-gray-700 capitalize">
                    {task.chain}
                  </td>

                  <td className="px-6 py-4 truncate text-sm text-gray-700">
                    {task.store_id}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[task.status]}`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(task.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    <span className="text-gray-500">
                      {new Date(task.created_at).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>

                  {/* Nút Xem chi tiết */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onView(task.id)}
                      className="flex items-center gap-1 px-3 py-1 border border-green-600 text-green-600 rounded-full text-sm hover:bg-green-600 hover:text-white transition-colors duration-150"
                    >
                      <Eye size={16} /> Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang kiểu số */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ‹ Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next ›
        </button>
      </div>
    </>
  );
};
