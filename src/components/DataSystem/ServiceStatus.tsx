import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { pingService } from '../../services/dataSystem';

export const ServiceStatus: React.FC = () => {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    pingService().then(setOnline);
  }, []);

  if (online === null) return <span>Đang kiểm tra…</span>;

  return (
    <div className="flex items-center space-x-1">
      {online
        ? <CheckCircle className="text-green-600" size={18} />
        : <AlertCircle className="text-red-500" size={18} />
      }
      <span className={online ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
        {online ? 'Service Online' : 'Service Offline'}
      </span>
    </div>
  );
};
