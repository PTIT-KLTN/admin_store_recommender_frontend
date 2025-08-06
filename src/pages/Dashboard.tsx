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
  fetchSummary,
  fetchUserTrend,
  fetchRecentDishes,
  fetchRecentCrawls,
} from '../services/dashboard';

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [recentDishes, setRecentDishes] = useState<RecentItem[]>([]);
  const [recentCrawls, setRecentCrawls] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext)!;
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    (async () => {
      try {
        const calls = [fetchSummary(), fetchUserTrend(4), fetchRecentDishes(5)];
        if (!isAdmin) calls.push(fetchRecentCrawls(5));

        const [sum, tr, dishes, crawls] = await Promise.all(calls as any);
        setSummary(sum);
        setTrend(tr);
        setRecentDishes(dishes);
        if (!isAdmin) setRecentCrawls(crawls);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  if (loading || !summary) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='p-4 ms-4 mt-4'>
        <header className="pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </header>
      </div>
      <div className="pt-2 ps-8 pe-8 pb-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Tổng số người dùng" value={summary.users_total} color="green" />
          <MetricCard title="Người dùng mới (7 ngày)" value={summary.users_new_7d} color="blue" />
          <MetricCard title="Tổng số món ăn" value={summary.dishes_total} color="purple" />
          <MetricCard title="Nguyên liệu sẵn sàng" value={summary.ingredients_total} color="yellow" />
        </div>

        {/* Chart và Recent Dishes nếu ADMIN */}
        {isAdmin ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard trend={trend} />
            <RecentList
              title="5 món ăn mới nhất"
              items={recentDishes}
              renderItem={i => <span className="font-medium text-gray-700">{i.vietnamese_name || i._id}</span>}
              viewLink="/dishes"
              accent="green"
            />
          </div>
        ) : (
          <>
            {/* Trend Chart */}
            <div className='mt-8'>
              <ChartCard trend={trend} />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentList
                title="5 món ăn mới nhất"
                items={recentDishes}
                renderItem={i => <span className="font-medium text-gray-700">{i.vietnamese_name || i._id}</span>}
                viewLink="/dishes"
                accent="green"
              />
              <RecentList
                title="5 tác vụ crawl mới nhất"
                items={recentCrawls}
                renderItem={i => (
                  <span className={(i as any).result.status === 'success' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {(i as any).result.store_name || i._id} – {i.status}
                  </span>
                )}
                viewLink="/crawls"
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
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trend}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week_start" stroke="#555" />
        <YAxis stroke="#555" />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#4CAF50" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

interface MetricCardProps {
  title: string;
  value: number;
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
      <p className={`text-2xl font-bold ${textColor} mt-2`}>{value}</p>
    </div>
  );
};

interface RecentListProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  viewLink: string;
  accent: 'green' | 'blue';
}
function RecentList<T extends { _id: string }>({ title, items, renderItem, viewLink, accent }: RecentListProps<T>) {
  const borderColor = accent === 'green' ? 'border-green-300' : 'border-blue-300';
  const headerColor = accent === 'green' ? 'text-green-700' : 'text-blue-700';

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-semibold ${headerColor}`}>{title}</h3>
        <a href={viewLink} className={`font-medium hover:underline ${headerColor}`}>Xem thêm →</a>
      </div>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item._id} className="p-2 border rounded hover:bg-gray-50">
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;
