// src/components/Layout/Sidebar.tsx
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UserCircleIcon,
  UsersIcon,
  CubeIcon,
  ClipboardIcon,
  CloudIcon,
  PowerIcon as LogoutIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

const items = [
  { name: 'Account Info', to: '/account', Icon: UserCircleIcon },
  { name: 'Manage Accounts', to: '/accounts', Icon: UsersIcon },
  { name: 'Manage Ingredients', to: '/ingredients', Icon: CubeIcon },
  { name: 'Manage Dishes', to: '/dishes', Icon: ClipboardIcon },
  { name: 'Data System', to: '/data-system', Icon: CloudIcon },
];

export const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useContext(AuthContext)!;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(prev => !prev);

  return (
    <aside
      className={`
        bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg h-full
        flex flex-col items-center
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header: User Info & Toggle */}
      <div className="w-full px-4 pt-6 pb-4 flex flex-col items-center border-b border-gray-200">
        <UserCircleIcon className="w-14 h-14 text-green-500 mb-2" />

        {!collapsed && (
          <>
            <h3
              className="text-base font-semibold text-gray-900 truncate w-full text-center"
              title={user?.fullname}
            >
              {user?.fullname}
            </h3>
            <p
              className="text-sm text-gray-500 truncate w-full text-center"
              title={user?.email}
            >
              {user?.email}
            </p>
          </>
        )}

        <button
          onClick={toggleCollapsed}
          className="mt-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>


      {/* Navigation */}
      <nav className="flex-1 w-full px-2 mt-4">
        {items.map(({ name, to, Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex items-center w-full p-3 mb-2 rounded-lg transition-colors
                ${active ? 'bg-green-200 text-gray-800' : 'text-gray-700 hover:bg-green-100'}
              `}
            >
              <Icon className="w-6 h-6" />
              {!collapsed && <span className="ml-3 font-medium truncate">{name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="w-full p-4">
        <button
          onClick={signOut}
          className={`
            flex items-center w-full p-3 rounded-lg transition-colors
            hover:bg-red-100
            ${collapsed ? 'justify-center' : 'text-red-600 hover:bg-red-100'}
          `}
        >
          <LogoutIcon className="w-6 h-6 text-red-600" />
          {!collapsed && <span className="ml-3 font-medium text-red-600 truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
