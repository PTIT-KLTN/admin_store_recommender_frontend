import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterBar } from '../components/DataSystem/FilterBar';
import { TaskTable } from '../components/DataSystem/TaskTable';
import { TaskDetailModal } from '../components/DataSystem/TaskDetailModal';
import { getTasks, Task } from '../services/dataSystem';
import { CreateCrawlTaskForm } from '../components/DataSystem/CreateTaskForm';

export const TaskManagementSection: React.FC = () => {
  const [filterChain, setFilterChain] = useState<string>('');
  const [filterStoreId, setFilterStoreId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: tasks = [], isFetching, refetch } = useQuery<Task[], Error, Task[]>({
    queryKey: ['tasks', filterChain, filterStoreId, status, dateFrom, dateTo],
    queryFn: async () => {
      const data = await getTasks();
      let filtered = data;

      if (filterChain) filtered = filtered.filter(t => t.chain === filterChain);

      if (filterStoreId) {
        filtered = filtered.filter(t => String(t.store_id).includes(filterStoreId));
      }

      if (status) {
        filtered = filtered.filter(
          t => (t.status || '').toLowerCase() === status.toLowerCase()
        );
      }

      if (dateFrom) filtered = filtered.filter(t => new Date(t.created_at) >= new Date(dateFrom));
      if (dateTo)   filtered = filtered.filter(t => new Date(t.created_at) <= new Date(dateTo));

      return filtered;
    },
    refetchInterval: isPolling ? 5000 : false,
  });

  return (
    <div className="space-y-6">
      {/* Toolbar: chỉ còn FilterBar */}
      <div className="mb-2">
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
          onSearch={() => refetch()}
          onReset={() => {
            setFilterChain('');
            setFilterStoreId('');
            setStatus('');
            setDateFrom('');
            setDateTo('');
          }}
        />
      </div>

      {/* Danh sách + Polling + Khởi tạo Task mới */}
      <div className="bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4 px-4 pt-4">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách Task</h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPolling(p => !p)}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition"
            >
              {isPolling ? 'Dừng Polling' : 'Bật Polling'}
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Khởi tạo Task mới
            </button>
          </div>
        </div>

        {isFetching ? (
          <p className="text-center text-gray-500 pb-4">Đang tải danh sách…</p>
        ) : (
          <TaskTable tasks={tasks} onView={setSelectedTaskId} />
        )}
      </div>

      {isModalOpen && (
        <CreateCrawlTaskForm
          onCancel={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      )}

      {selectedTaskId && (
        <TaskDetailModal taskId={selectedTaskId} isOpen onClose={() => setSelectedTaskId(null)} />
      )}
    </div>
  );
};
