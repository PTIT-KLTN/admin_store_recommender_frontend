import React, { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
// import api from '../../services/api';

const frequencies = [
  { label: 'Hàng ngày', value: 'daily' },
  { label: 'Hàng tuần', value: 'weekly' },
  { label: 'Hàng tháng', value: 'monthly' },
];

const ScheduleSettings: React.FC = () => {
  const [freq, setFreq] = useState(frequencies[0]);
  const [sources, setSources] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // api.get<string[]>('/data-sources').then(setAvailableSources);
  }, []);

  const save = async () => {
    setLoading(true);
    // await api.post('/schedule', { frequency: freq.value, sources });
    setLoading(false);
    alert('Lưu thành công!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tần suất thu thập</label>
          <Listbox value={freq} onChange={setFreq}>
            <div className="relative">
              <Listbox.Button className="w-full p-3 border rounded-lg flex justify-between items-center hover:border-green-500">
                {freq.label} <ChevronDown className="w-5 h-5 text-gray-500" />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                {frequencies.map(option => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none p-3 ${
                        active ? 'bg-green-100 text-green-700' : 'text-gray-700'
                      }`
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn dữ liệu</label>
          <div className="space-y-2 max-h-40 overflow-y-auto border p-3 rounded-lg">
            {availableSources.map(src => (
              <div key={src} className="flex items-center">
                <input
                  type="checkbox"
                  checked={sources.includes(src)}
                  onChange={() =>
                    setSources(prev =>
                      prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
                    )
                  }
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">{src}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={save}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Đang lưu...' : 'Lưu thiết lập'}
      </button>
    </div>
  );
};

export default ScheduleSettings;