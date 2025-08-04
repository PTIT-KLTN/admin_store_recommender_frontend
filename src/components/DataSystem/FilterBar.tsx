import React from 'react';
import { Search, Layers, Calendar } from 'lucide-react';

interface FilterBarProps {
  chain: string;
  storeId: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  onChange: (field: 'chain' | 'storeId' | 'status' | 'dateFrom' | 'dateTo', value: string) => void;
  onSearch: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ chain, storeId, status, dateFrom, dateTo, onChange, onSearch }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
    {/* Chain */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-2">
        <Layers size={16} className="text-green-600" /> Chuỗi
      </label>
      <select
        value={chain}
        onChange={e => onChange('chain', e.target.value)}
        className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
      >
        <option value="">Tất cả</option>
        <option value="BHX">Bách Hóa Xanh</option>
        <option value="WM">WinMart</option>
      </select>
    </div>

    {/* Store ID */}
    <div className="flex flex-col col-span-2">
      <label className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-2">
        <Search size={16} className="text-green-600" /> Mã cửa hàng
      </label>
      <input
        type="text"
        placeholder="Nhập mã cửa hàng..."
        value={storeId}
        onChange={e => onChange('storeId', e.target.value)}
        className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
      />
    </div>

    {/* Status */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600 mb-2">Trạng thái</label>
      <select
        value={status}
        onChange={e => onChange('status', e.target.value)}
        className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
      >
        <option value="">Tất cả</option>
        <option value="pending">Đang chờ</option>
        <option value="running">Đang chạy</option>
        <option value="done">Hoàn thành</option>
      </select>
    </div>

    {/* Date Range */}
    <div className="flex space-x-2 lg:col-span-2">
      <div className="flex-1 flex flex-col me-2">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-2">
          <Calendar size={16} className="text-green-600" /> Từ ngày
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={e => onChange('dateFrom', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-2">
          <Calendar size={16} className="text-green-600" /> Đến ngày
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={e => onChange('dateTo', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
        />
      </div>
    </div>

    {/* Search Button */}
    <div className="flex justify-end lg:col-span-5">
      <button
        onClick={onSearch}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition"
      >
        <Search size={16} /> Tìm kiếm
      </button>
    </div>
  </div>
);
