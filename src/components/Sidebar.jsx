// src/components/Layout.jsx (or Sidebar.jsx if separate)
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Image,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: 'admin@rmtechsolution.com' };


  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/dashboard/posts', icon: <FileText size={20} />, label: 'Posts' },
    { path: '/dashboard/content-models', icon: <Layers size={20} />, label: 'Content Models' },
    { path: '/dashboard/media', icon: <Image size={20} />, label: 'Media' },
    { path: '/dashboard/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Check if the current path matches or starts with the nav item path
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-blue-400">RM</span> Tech CMS
              </h1>
              <p className="text-gray-400 text-xs">Admin Dashboard</p>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <span className="text-2xl font-bold text-blue-400">RM</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'} // Use "end" for exact match on dashboard
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`
            }
            title={collapsed ? item.label : ''}
          >
            <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className={`p-4 border-t border-gray-800 ${collapsed ? 'px-3' : ''}`}>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="font-semibold">{user.name.charAt(0)}</span>
          </div>
          {!collapsed && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`mt-4 flex items-center ${collapsed ? 'justify-center' : 'px-4'} w-full py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={18} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;