
import React,{ useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
      isMobileOpen={isMobileSidebarOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
       />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar  toggleSidebar={toggleMobileSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="border-t bg-white px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>© {new Date().getFullYear()} RM Tech Solution. All rights reserved.</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;