import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Cloud, 
  Database, 
  BarChart3, 
  TrendingUp,
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'gcp', label: 'Google Cloud', icon: Cloud },
    { id: 'azure', label: 'Microsoft Azure', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings (Coming Soon)', icon: Settings, disabled: true },
    { id: 'help', label: 'Help (Coming Soon)', icon: HelpCircle, disabled: true },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg border-r border-gray-200 z-40"
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-200 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <div
                key={item.id}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  item.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={item.disabled ? 'Feature coming soon' : ''}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
