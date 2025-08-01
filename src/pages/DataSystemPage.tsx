// src/pages/DataSystemPage.tsx
import React from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Tab } from '@headlessui/react';
import { Calendar, Cog, FileText } from 'lucide-react';
import ScheduleSettings from '../components/DataSystem/ScheduleSettings';
import SystemConfig from '../components/DataSystem/SystemConfig';
import LogsViewer from '../components/DataSystem/LogsViewer';

const tabs = [
  { name: 'Lịch thu thập', icon: Calendar, component: <ScheduleSettings /> },
  { name: 'Cấu hình hệ thống', icon: Cog, component: <SystemConfig /> },
  { name: 'Log hoạt động', icon: FileText, component: <LogsViewer /> },
];

const DataSystemPage: React.FC = () => (
  <DashboardLayout>
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Quản lý Data System</h1>
      <Tab.Group>
        <Tab.List className="flex space-x-3 border-b-2 border-gray-200 mb-3">
          {tabs.map(tab => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `flex items-center px-3 py-1 -mb-px text-base font-medium transition-colors duration-200 ${
                  selected
                    ? 'border-b-3 border-green-500 text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`
              }
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map(tab => (
            <Tab.Panel key={tab.name} className="bg-white p-4 rounded-lg shadow-sm">
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  </DashboardLayout>
);

export default DataSystemPage;
