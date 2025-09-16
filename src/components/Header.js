import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, User, Search } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Cloud Cost Management</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <span>•</span>
            <span>Executive Dashboard</span>
            <span>•</span>
            <span>Real-time Analytics</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search resources, projects, services..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
              title="Search functionality - Coming soon"
            />
          </div>
          
          <div className="relative p-2 text-gray-300 cursor-not-allowed" title="Notifications - Coming soon">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full"></span>
          </div>
          
          <div className="p-2 text-gray-300 cursor-not-allowed" title="Settings - Coming soon">
            <Settings className="w-5 h-5" />
          </div>
          
          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">Viewer</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
