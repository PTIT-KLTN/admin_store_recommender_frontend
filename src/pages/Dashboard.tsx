import React from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';

const DashboardPage: React.FC = () => (
  <DashboardLayout>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="text-3xl font-bold text-green-600">1,234</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <p className="text-3xl font-bold text-green-600">567</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold">Dishes</h2>
        <p className="text-3xl font-bold text-green-600">89</p>
      </div>
    </div>
  </DashboardLayout>
);

export default DashboardPage;