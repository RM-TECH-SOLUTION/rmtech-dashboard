
import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';


const Topbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
         <div className="hidden md:flex items-center ">
            
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
              > Home 
              </button>
            </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className={`relative ${searchOpen ? 'w-64' : 'w-10'}`}>
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
                size={20}
                onClick={() => setSearchOpen(!searchOpen)}
              />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  searchOpen ? 'opacity-100' : 'opacity-0 w-0'
                }`}
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Help */}
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <HelpCircle size={20} />
          </button>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
              <span className="font-medium">24</span> Posts
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              <span className="font-medium">8</span> Users
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;