
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
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar
      isMobileOpen={isMobileSidebarOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
       />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Topbar  toggleSidebar={toggleMobileSidebar} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="border-t bg-white px-2 sm:px-4 md:px-6 py-4 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} RM Tech Solution. All rights reserved.</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;