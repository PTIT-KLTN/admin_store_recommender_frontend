import React, { useState } from 'react';
import { ScheduleConfigSection } from '../pages/ScheduleConfigSection';
import { TaskManagementSection } from '../pages/TaskManagerSystem';
import { DashboardLayout } from '../components/Layout/DashboardLayout';

// Styles for active/inactive tabs
const tabBase = 'py-2 px-4 font-medium text-sm rounded-t-lg cursor-pointer';
const activeTab = 'border-b-2 border-green-600 text-green-600';
const inactiveTab = 'text-gray-600 hover:text-gray-800';

const DataSystemPage: React.FC = () => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    return (
        <DashboardLayout>
            <div className='p-4 ms-4 mt-4'>
                <header className="pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">Hệ thống thu thập dữ liệu</h1>
                </header>
            </div>
            <div className="min-h-screen p-6">
                <div className="bg-white rounded-t-2xl shadow-md">
                    <div className="border-b border-gray-200 p-2">
                        <nav className="flex space-x-4 px-4">
                            <button
                                className={`${tabBase} ${activeTabIndex === 0 ? activeTab : inactiveTab} px-4 py-2 text-[1.1875rem]`}
                                onClick={() => setActiveTabIndex(0)}
                            >
                                Thiết lập lịch thu thập
                            </button>
                            <button
                                className={`${tabBase} ${activeTabIndex === 1 ? activeTab : inactiveTab} px-4 py-2 text-[1.1875rem]`}
                                onClick={() => setActiveTabIndex(1)}
                            >
                                Quản lý task thu thập
                            </button>
                        </nav>
                    </div>


                    <div className="p-6">
                        {activeTabIndex === 0 ? <ScheduleConfigSection /> : <TaskManagementSection />}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DataSystemPage;