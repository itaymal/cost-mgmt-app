import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bug, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      environment: {
        nodeEnv: process.env.NODE_ENV,
        enableMockData: process.env.REACT_APP_ENABLE_MOCK_DATA,
        gcpProjectId: process.env.REACT_APP_GCP_PROJECT_ID ? 'Set' : 'Not Set',
        gcpApiKey: process.env.REACT_APP_GCP_API_KEY ? 'Set' : 'Not Set',
        gcpServiceAccount: process.env.REACT_APP_GCP_SERVICE_ACCOUNT_KEY ? 'Set' : 'Not Set',
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    setDebugInfo(info);
  }, []);

  const getStatusIcon = (value) => {
    if (value === 'Set' || value === 'production') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (value === 'Not Set') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (value) => {
    if (value === 'Set' || value === 'production') {
      return 'text-green-600';
    } else if (value === 'Not Set') {
      return 'text-red-600';
    } else {
      return 'text-yellow-600';
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Debug Information"
      >
        <Bug className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bug className="w-5 h-5 mr-2" />
            Debug Information
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Environment Variables</h4>
            <div className="space-y-2">
              {Object.entries(debugInfo.environment || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(value)}
                    <span className={getStatusColor(value)}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">System Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span className="text-gray-900">{debugInfo.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">URL:</span>
                <span className="text-gray-900 text-xs">{debugInfo.url}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">To use real GCP data:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Set REACT_APP_ENABLE_MOCK_DATA=false</li>
                  <li>Configure GCP credentials</li>
                  <li>Enable required GCP APIs</li>
                  <li>Check browser console for errors</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Current Status:</p>
                <p>
                  {debugInfo.environment?.enableMockData === 'true' || 
                   debugInfo.environment?.gcpApiKey === 'Not Set' && debugInfo.environment?.gcpServiceAccount === 'Not Set'
                    ? 'Using mock data' 
                    : 'Attempting to use real GCP data'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DebugPanel;
