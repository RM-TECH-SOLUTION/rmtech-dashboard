import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ toggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b px-2 sm:px-4 md:px-6 py-3 sm:py-4 sticky top-0 z-40 overflow-x-hidden w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            onClick={toggleSidebar}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-end">
          {/* Search */}
          <div className={`relative flex-shrink-0 transition-all duration-200 ${searchOpen ? 'w-28 sm:w-40 md:w-64' : 'w-8'}`}>
            <div className="relative">
              <Search 
                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer flex-shrink-0" 
                size={16}
                onClick={() => setSearchOpen(!searchOpen)}
              />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 text-xs sm:text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  searchOpen ? 'opacity-100' : 'opacity-0 invisible w-0'
                }`}
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Help */}
          <button className="p-2 hover:bg-gray-100 rounded-lg hidden md:block flex-shrink-0">
            <HelpCircle size={16} />
          </button>

          {/* Home Button */}
          <button
            onClick={() => navigate('/')}
            className="px-3 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            Home
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;