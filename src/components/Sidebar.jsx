import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Layers,
  ShoppingBag,
  Merchant,
  X,
  Megaphone,
  Bell,
  Ticket,
  Receipt,
  RefreshCw
} from 'lucide-react';
import { getMerchant } from '../redux/actions/cmsActions';
import { getPlanDataFromStorage } from '../utils/planExpiry';

const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = { name: 'Admin', email: 'admin@rmtechsolution.com', ...JSON.parse(localStorage.getItem('user') || '{}') };
  const token = localStorage.getItem('token');
  const planData = getPlanDataFromStorage();
  const merchantList = useSelector((state) => state.cms.merchantList || []);
  const currentMerchant = merchantList.find((m) => String(m.merchantId || m.merchant_id) === String(token));

  const getCurrentMerchantAccess = () => {
    const raw = currentMerchant?.dashboardAccess ?? currentMerchant?.dashboard_access ?? [];
    if (Array.isArray(raw)) {
      return raw.map((item) => String(item).trim()).filter(Boolean);
    }
    if (!raw) return [];
    try {
      const parsed = JSON.parse(String(raw));
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (err) {
      // fall back to comma split
    }
    return String(raw).split(',').map((item) => item.trim()).filter(Boolean);
  };

  const currentMerchantAccess = getCurrentMerchantAccess();
  const currentMerchantAccessKeys = currentMerchantAccess.map((value) =>
    String(value).trim().toLowerCase().replace(/\s+/g, ' ')
  );

  const navAccessMap = {
    dashboard: { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    pos: { path: '/dashboard/pos', icon: <Receipt size={20} />, label: 'Point of Sale (POS)' },
    'point of sale': { path: '/dashboard/pos', icon: <Receipt size={20} />, label: 'Point of Sale (POS)' },
    'order history': { path: '/dashboard/posts', icon: <FileText size={20} />, label: 'Order Status' },
    campaign: { path: '/dashboard/campaign', icon: <Megaphone size={20} />, label: 'Campaign' },
    coupons: { path: '/dashboard/coupons', icon: <Ticket size={20} />, label: 'Coupons' },
    'content models': { path: '/dashboard/content-models', icon: <Layers size={20} />, label: 'Content Models' },
    catalogue: { path: '/dashboard/catalogue', icon: <ShoppingBag size={20} />, label: 'Catalogue' },
    users: { path: '/dashboard/users', icon: <Users size={20} />, label: 'Users' },
    'renew plan': { path: '/dashboard/renew-plan', icon: <RefreshCw size={20} />, label: 'Renew Plan' },
  };

  const dynamicNavItems = currentMerchantAccessKeys
    .map((key) => navAccessMap[key])
    .filter(Boolean);

  const sidebarItems = [
    navAccessMap.dashboard,
    ...dynamicNavItems,
  ].filter(Boolean);

  useEffect(() => {
    if (!merchantList.length) {
      dispatch(getMerchant());
    }
  }, [dispatch, merchantList.length]);

  // Close mobile sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      if (isMobileOpen && sidebar && !sidebar.contains(event.target)) {
        toggleMobileSidebar();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen, toggleMobileSidebar]);

  // Close mobile sidebar on window resize (when switching to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileOpen) {
        toggleMobileSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, toggleMobileSidebar]);

   const navItemsMerchant = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/dashboard/pos', icon: <Receipt size={20} />, label: 'Point of Sale (POS)' },
    { path: '/dashboard/posts', icon: <FileText size={20} />, label: 'Order Status' },
    { path: '/dashboard/campaign', icon: <Megaphone size={20} />, label: 'Campaign' },
    { path: '/dashboard/coupons', icon: <Ticket size={20} />, label: 'Coupons' },
    { path: '/dashboard/merchantList', icon: <Users size={20} />, label: 'Merchants' },
    { path: '/dashboard/content-models', icon: <Layers size={20} />, label: 'Content Models' },
    { path: '/dashboard/catalogue', icon: <ShoppingBag size={20} />, label: 'Catalogue' },
    { path: '/dashboard/media', icon: <Image size={20} />, label: 'Media' },
    { path: '/dashboard/renew-plan', icon: <RefreshCw size={20} />, label: 'Renew Plan' },
    // { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
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

  // Close sidebar on mobile when clicking a link
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      toggleMobileSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar
        fixed md:relative
        inset-y-0 left-0 z-50
        bg-gray-900 text-white flex flex-col transition-all duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${collapsed ? 'w-16 md:w-20' : 'w-56 md:w-64'}
        h-screen
        max-h-screen
        overflow-y-auto
      `}>
        {/* Logo & Close Button for Mobile */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex-1">
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
            
            <div className="flex items-center space-x-2">
              {/* Mobile Close Button */}
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-1 hover:bg-gray-800 rounded"
              >
                <X size={20} />
              </button>
              
              {/* Desktop Collapse Button */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:block p-1 hover:bg-gray-800 rounded"
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {(token == "0" ? navItemsMerchant : sidebarItems).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={handleNavClick}
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

        {currentMerchant && !collapsed && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-800 text-sm text-gray-300">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Current Merchant</div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
              <p className="text-white font-medium truncate">{currentMerchant.name || currentMerchant.company_name || 'Unnamed Merchant'}</p>
              <p className="text-gray-400 text-xs truncate">ID: {currentMerchant.merchantId || currentMerchant.merchant_id || '-'}</p>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className={`p-4 border-t border-gray-800 ${collapsed ? 'px-3' : ''}`}>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="font-semibold">{user.name.charAt(0)}</span>
            </div>
            {!collapsed && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{user.name}</p>
              </div>
            )}
          </div>
            <p className="text-xs text-gray-400 truncate" style={{textAlign:"center"}}>{user.email}</p>
          
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
    </>
  );
};

export default Sidebar;