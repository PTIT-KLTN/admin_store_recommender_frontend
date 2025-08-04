import React from 'react';
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

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onView }) => (
    <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
                <tr>
                    {['ID', 'Chuỗi', 'Cửa hàng', 'Trạng thái', 'Tạo lúc', 'Hành động'].map(header => (
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
                {tasks.map((task, idx) => (
                    <tr
                        key={task.id}
                        className={`transition-colors duration-150 ${idx % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                    >
                        {/* ID rút gọn */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {task.id}...
                        </td>

                        {/* Chain Capitalize */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                            {task.chain}
                        </td>

                        {/* Store ID rút gọn */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {(task.store_id)}
                        </td>


                        {/* Badge trạng thái */}
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[task.status]}`}
                            >
                                {task.status.replace('_', ' ')}
                            </span>
                        </td>

                        {/* Ngày giờ tạo format VN */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                        <td className="px-6 py-4 whitespace-nowrap">
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
);
