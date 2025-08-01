import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
// import api from '../../services/api';

interface LogEntry { timestamp: string; level: 'INFO' | 'ERROR'; message: string; }

const LogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // api.get<LogEntry[]>('/logs').then(setLogs);
  }, []);

  const filtered = logs.filter(l => l.message.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Tìm kiếm log..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full p-2 border rounded-lg hover:border-green-500"
        />
      </div>
      <div className="overflow-y-auto max-h-96 border rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Thời gian</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Mức độ</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, idx) => (
              <tr key={idx} className={idx % 2 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2 text-sm text-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
                <td className={`px-4 py-2 text-sm font-semibold ${log.level === 'ERROR' ? 'text-red-600' : 'text-green-600'}`}>
                  {log.level}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsViewer;