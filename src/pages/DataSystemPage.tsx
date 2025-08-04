import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FilterBar } from '../components/DataSystem/FilterBar';
import { ServiceStatus } from '../components/DataSystem/ServiceStatus';
import { TaskTable } from '../components/DataSystem/TaskTable';
import { TaskDetailModal } from '../components/DataSystem/TaskDetailModal';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { getTasks, startCrawl, Task } from '../services/dataSystem';
import { CreateCrawlTaskForm } from '../components/DataSystem/CreateTaskForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/Common/Dialog';

export const DataSystemPage: React.FC = () => {
  const [filterChain, setFilterChain] = useState<string>('');
  const [filterStoreId, setFilterStoreId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const data = await getTasks();
      // filter client-side
      let filtered = data;
      if (filterChain) filtered = filtered.filter(t => t.chain === filterChain);
      if (filterStoreId) filtered = filtered.filter(t => t.store_id.includes(filterStoreId));
      if (status) filtered = filtered.filter(t => t.status === status);
      if (dateFrom) filtered = filtered.filter(t => new Date(t.created_at) >= new Date(dateFrom));
      if (dateTo) filtered = filtered.filter(t => new Date(t.created_at) <= new Date(dateTo));
      setTasks(filtered);
    } catch (err) {
      toast.error('Không tải được danh sách');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPolling) {
      fetchTasks();
      interval = setInterval(fetchTasks, 5000);
    }
    return () => clearInterval(interval);
  }, [isPolling, filterChain, filterStoreId, status, dateFrom, dateTo]);

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <header className="pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Hệ thống Thu thập Dữ liệu</h1>
        </header>

        <ToastContainer position="top-right" autoClose={3000} />

        <div className="flex justify-between items-center mb-6">
          <ServiceStatus />

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Khởi tạo Task mới
          </button>
        </div>
        {isModalOpen && (
          <CreateCrawlTaskForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchTasks();
            }}
          />
        )}

        <FilterBar
          chain={filterChain}
          storeId={filterStoreId}
          status={status}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChange={(field, value) => {
            if (field === 'chain') setFilterChain(value);
            if (field === 'storeId') setFilterStoreId(value);
            if (field === 'status') setStatus(value);
            if (field === 'dateFrom') setDateFrom(value);
            if (field === 'dateTo') setDateTo(value);
          }}
          onSearch={fetchTasks}
        />

        <div className="bg-white shadow-md rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Danh sách Task</h2>
            <button
              onClick={() => setIsPolling(p => !p)}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition"
            >
              {isPolling ? 'Dừng Polling' : 'Bật Polling'}
            </button>
          </div>
          {loadingTasks ? (
            <p className="text-center text-gray-500">Đang tải danh sách…</p>
          ) : (
            <TaskTable tasks={tasks} onView={setSelectedTaskId} />
          )}
        </div>

        {selectedTaskId && (
          <TaskDetailModal taskId={selectedTaskId} isOpen onClose={() => setSelectedTaskId(null)} />
        )}
      </div>
    </DashboardLayout>
  );
};
