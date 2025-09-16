import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GCPDashboard from './components/GCPDashboard';
import AzureDashboard from './components/AzureDashboard';
import Analytics from './components/Analytics';
import DebugPanel from './components/DebugPanel';
import { Cloud, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for demo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard />;
      case 'gcp':
        return <GCPDashboard />;
      case 'azure':
        return <AzureDashboard />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Cloud className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Cloud Cost Management</h1>
            </div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 ml-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Debug Panel - only show in development */}
      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </div>
  );
}

export default App;
