import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash2 } from 'lucide-react';
import ConfirmModal from '../components/Common/ConfirmModal';
import {
  getSchedules,
  createSchedule,
  deleteSchedule,
  Schedule,
} from '../services/scheduleApi';

type ScheduleForm = {
  name: string;
  chains: ('BHX' | 'WM')[];
  scheduleType: 'daily' | 'hourly' | 'weekly';
  hours: number;
  minutes: number;
  dayOfWeek: number;
  concurrency: number;
};

const DAY_LABELS: Record<number, string> = {
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
  7: 'Chủ nhật',
};

export const ScheduleConfigSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ScheduleForm>({
    name: '',
    chains: ['BHX'],
    scheduleType: 'daily',
    hours: 0,
    minutes: 0,
    dayOfWeek: 1,
    concurrency: 5,
  });
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const activeSchedules = schedules.filter(({ is_active }) => is_active);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const data = await getSchedules();
      setSchedules(data);
    } catch (e: any) {
      toast.error(e.message || 'Không thể tải lịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSchedules(); }, []);

  useEffect(() => {
    setForm(f => ({
      ...f,
      concurrency: f.chains.includes('WM') ? 2 : 5,
    }));
  }, [form.chains]);

  const handleChange = (field: keyof ScheduleForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleChain = (chain: 'BHX' | 'WM') => {
    setForm(prev => {
      const has = prev.chains.includes(chain);
      const next = has
        ? prev.chains.filter(c => c !== chain)
        : [...prev.chains, chain];
      return { ...prev, chains: next.length ? next : prev.chains };
    });
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createSchedule({
        name: form.name,
        chains: form.chains,
        scheduleType: form.scheduleType,
        hour: form.hours || null,
        dayOfWeek: form.dayOfWeek || null,
        minute: form.minutes || null,
        concurrency: form.concurrency,
      });
      toast.success('Tạo schedule thành công');
      setShowModal(false);
      loadSchedules();
    } catch (e: any) {
      toast.error(e.message || 'Tạo schedule thất bại');
    }
  };

  const confirmDelete = (id: string) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!targetId) return;
    try {
      await deleteSchedule(targetId);
      toast.success('Đã inactive');
      loadSchedules();
    } catch (e: any) {
      toast.error(e.message || 'Inactive thất bại');
    } finally {
      setConfirmOpen(false);
      setTargetId(null);
    }
  };

  const onCancelDelete = () => {
    setConfirmOpen(false);
    setTargetId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Tạo schedule mới
        </button>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        message="Bạn có chắc muốn xóa tác vụ schedule này?"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Thêm Lịch Thu Thập</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 mb-1">Tên schedule</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-200"
                />
              </div>

              {/* Chains */}
              <div>
                <span className="block text-gray-700 mb-1">Chuỗi</span>
                <div className="flex gap-4">
                  {(['BHX', 'WM'] as const).map(chain => (
                    <label key={chain} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.chains.includes(chain)}
                        onChange={() => toggleChain(chain)}
                        className="h-4 w-4"
                      />
                      <span className="text-gray-800">{chain}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-gray-700 mb-1">Loại</label>
                <select
                  value={form.scheduleType}
                  onChange={e => handleChange('scheduleType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-200"
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="hourly">Hàng giờ</option>
                  <option value="weekly">Hàng tuần</option>
                </select>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Giờ (0-23)</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={form.hours}
                    onChange={e => handleChange('hours', +e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Phút (0-59)</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={form.minutes}
                    onChange={e => handleChange('minutes', +e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-200"
                  />
                </div>
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-gray-700 mb-1">Ngày trong tuần</label>
                <select
                  value={form.dayOfWeek}
                  onChange={e => handleChange('dayOfWeek', +e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-200"
                >
                  {Object.entries(DAY_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Concurrency */}
              <div>
                <label className="block text-gray-700 mb-1">Số luồng (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.concurrency}
                  onChange={e => handleChange('concurrency', +e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-200"
                />
                <small className="text-sm text-gray-500">Khuyến cáo: WM=2, BHX=5</small>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Chuỗi</th>
              <th className="px-4 py-2 text-left">Loại</th>
              <th className="px-4 py-2 text-left">Giờ</th>
              <th className="px-4 py-2 text-left">Phút</th>
              <th className="px-4 py-2 text-left">Ngày</th>
              <th className="px-4 py-2 text-left">Số luồng</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading &&
              activeSchedules.map(s => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.chains.join(', ')}</td>
                  <td className="px-4 py-2">{s.schedule_type}</td>
                  <td className="px-4 py-2">{s.schedule_config.hour ?? '-'}</td>
                  <td className="px-4 py-2">{s.schedule_config.minute ?? '-'}</td>
                  <td className="px-4 py-2">
                    {s.schedule_config.day_of_week != null
                      ? DAY_LABELS[s.schedule_config.day_of_week]
                      : '-'}
                  </td>
                  <td className="px-4 py-2">{s.parameters.concurrency}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => confirmDelete(s.schedule_id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
