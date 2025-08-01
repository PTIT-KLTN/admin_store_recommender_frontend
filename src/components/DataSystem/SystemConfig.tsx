import React, { useState, useEffect } from 'react';
// import api from '../../services/api';

interface Config { maxRetries: number; timeout: number; }

const SystemConfig: React.FC = () => {
  const [config, setConfig] = useState<Config>({ maxRetries: 3, timeout: 30 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // api.get<Config>('/system-config').then(setConfig);
  }, []);

  const update = async () => {
    setLoading(true);
    // await api.put('/system-config', config);
    setLoading(false);
    alert('Cập nhật thành công!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Số lần thử lại tối đa</label>
          <input
            type="number"
            value={config.maxRetries}
            onChange={e => setConfig({ ...config, maxRetries: +e.target.value })}
            className="mt-1 w-full p-3 border rounded-lg hover:border-green-500"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Timeout (s)</label>
          <input
            type="number"
            value={config.timeout}
            onChange={e => setConfig({ ...config, timeout: +e.target.value })}
            className="mt-1 w-full p-3 border rounded-lg hover:border-green-500"
            min={1}
          />
        </div>
      </div>
      <button
        onClick={update}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Đang cập nhật...' : 'Cập nhật cấu hình'}
      </button>
    </div>
  );
};

export default SystemConfig;
