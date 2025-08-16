// src/pages/Dashboard.tsx
import React, { useState, useEffect, useContext } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Summary,
  TrendItem,
  RecentItem,
  CrawlItem,
  fetchSummary,
  fetchUserTrend,
  fetchRecentDishes,
  fetchRecentCrawls,
} from '../services/dashboard';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [recentDishes, setRecentDishes] = useState<RecentItem[]>([]);
  const [recentCrawls, setRecentCrawls] = useState<CrawlItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext)!;
  const isAdmin = user?.role === 'ADMIN';

  const loadData = async () => {
    setLoading(true);
    try {
      const jobs: Promise<any>[] = [
        fetchSummary(),
        fetchUserTrend(4),
        fetchRecentDishes(5),
      ];
      if (!isAdmin) jobs.push(fetchRecentCrawls(5));

      const results = await Promise.allSettled(jobs);

      // summary
      if (results[0].status === 'fulfilled') {
        setSummary(results[0].value as Summary);
      } else {
        toast.error('Không tải được số liệu tổng quan');
      }

      // trend
      if (results[1].status === 'fulfilled') {
        setTrend((results[1] as PromiseFulfilledResult<TrendItem[]>).value || []);
      } else {
        toast.error('Không tải được dữ liệu xu hướng');
      }

      // dishes
      if (results[2].status === 'fulfilled') {
        setRecentDishes((results[2] as PromiseFulfilledResult<RecentItem[]>).value || []);
      } else {
        toast.error('Không tải được danh sách món ăn mới');
      }

      // crawls (chỉ khi không phải ADMIN)
      if (!isAdmin) {
        const idx = 3;
        if (results[idx] && results[idx].status === 'fulfilled') {
          setRecentCrawls((results[idx] as PromiseFulfilledResult<CrawlItem[]>).value || []);
        } else if (results[idx]) {
          toast.error('Không tải được danh sách crawl gần đây');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // KHÔNG chặn render nếu summary null; dùng fallback 0.
  const safeSummary: Summary = summary ?? {
    users_total: 0,
    users_new_7d: 0,
    dishes_total: 0,
    ingredients_total: 0,
    crawls_failed: 0,
  };

  return (
    <DashboardLayout>
      {/* Toasts */}
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="p-4 ms-4 mt-4">
        <header className="pb-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

          <button
            onClick={loadData}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Tải lại'}
          </button>
        </header>
      </div>

      <div className="pt-2 ps-8 pe-8 pb-8 space-y-8">
        {/* Key Metrics (dùng safeSummary) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Tổng số người dùng" value={safeSummary.users_total} color="green" />
          <MetricCard title="Người dùng mới (7 ngày)" value={safeSummary.users_new_7d} color="blue" />
          <MetricCard title="Tổng số món ăn" value={safeSummary.dishes_total} color="purple" />
          <MetricCard title="Nguyên liệu sẵn sàng" value={safeSummary.ingredients_total} color="yellow" />
        </div>

        {/* Loading hint (không block UI) */}
        {loading && (
          <div className="text-sm text-gray-500">Đang tải dữ liệu…</div>
        )}

        {/* Chart + Lists */}
        {isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard trend={trend} />
            <RecentList
              title="5 món ăn mới nhất"
              items={recentDishes}
              emptyText="Chưa có món ăn nào."
              renderItem={(i) => (
                <span className="font-medium text-gray-700">{i.vietnamese_name || i._id}</span>
              )}
              viewLink="/dishes"
              accent="green"
            />
          </div>
        ) : (
          <>
            <ChartCard trend={trend} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentList
                title="5 món ăn mới nhất"
                items={recentDishes}
                emptyText="Chưa có món ăn mới."
                renderItem={(i) => (
                  <span className="font-medium text-gray-700">{i.vietnamese_name || i._id}</span>
                )}
                viewLink="/dishes"
                accent="green"
              />
              <RecentList<CrawlItem>
                title="5 tác vụ crawl mới nhất"
                items={recentCrawls}
                emptyText="Chưa có tác vụ crawl nào."
                renderItem={(item) => {
                  const crawlStatus = item.result?.status || item.status;
                  const storeName = item.result?.store_name || item._id;
                  const className =
                    crawlStatus === 'success'
                      ? 'text-green-600 font-medium'
                      : crawlStatus === 'queued'
                      ? 'text-yellow-600 font-medium'
                      : crawlStatus === 'processing'
                      ? 'text-blue-600 font-medium'
                      : 'text-red-600 font-medium';

                  return (
                    <span className={className}>
                      {storeName} – {crawlStatus}
                    </span>
                  );
                }}
                viewLink="/data-system"
                accent="blue"
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

interface ChartCardProps {
  trend: TrendItem[];
}
const ChartCard: React.FC<ChartCardProps> = ({ trend }) => (
  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Xu hướng đăng ký (tuần)</h3>

    {trend && trend.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week_start" stroke="#555" />
          <YAxis stroke="#555" />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4CAF50" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-[300px] flex items-center justify-center text-gray-500 italic border-2 border-dashed rounded-lg">
        Không có dữ liệu để hiển thị.
      </div>
    )}
  </div>
);

interface MetricCardProps {
  title: string;
  value: number | string;
  color: 'green' | 'blue' | 'purple' | 'yellow';
}
const MetricCard: React.FC<MetricCardProps> = ({ title, value, color }) => {
  const bgGrad = {
    green: 'from-green-200 to-green-100',
    blue: 'from-blue-200 to-blue-100',
    purple: 'from-purple-200 to-purple-100',
    yellow: 'from-yellow-200 to-yellow-100',
  }[color];

  const textColor = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    yellow: 'text-yellow-700',
  }[color];

  return (
    <div className={`bg-gradient-to-r ${bgGrad} rounded-2xl shadow-md p-6`}>
      <h3 className={`text-lg font-medium ${textColor}`}>{title}</h3>
      <p className={`text-2xl font-bold ${textColor} mt-2`}>{value ?? '—'}</p>
    </div>
  );
};

interface RecentListProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  viewLink: string;
  accent: 'green' | 'blue';
  emptyText?: string;
}
function RecentList<T extends { _id: string }>({
  title,
  items,
  renderItem,
  viewLink,
  accent,
  emptyText = 'Không có dữ liệu.',
}: RecentListProps<T>) {
  const borderColor = accent === 'green' ? 'border-green-300' : 'border-blue-300';
  const headerColor = accent === 'green' ? 'text-green-700' : 'text-blue-700';

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-semibold ${headerColor}`}>{title}</h3>
        <a href={viewLink} className={`font-medium hover:underline ${headerColor}`}>
          Xem thêm →
        </a>
      </div>

      {!items || items.length === 0 ? (
        <div className="p-4 text-gray-500 italic border border-dashed rounded-lg">
          {emptyText}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item._id} className="p-2 border rounded hover:bg-gray-50">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;
