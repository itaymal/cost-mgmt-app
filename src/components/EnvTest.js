import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const EnvTest = () => {
  const envVars = {
    'REACT_APP_ENABLE_MOCK_DATA': process.env.REACT_APP_ENABLE_MOCK_DATA,
    'REACT_APP_GCP_PROJECT_ID': process.env.REACT_APP_GCP_PROJECT_ID,
    'REACT_APP_GCP_API_KEY': process.env.REACT_APP_GCP_API_KEY,
    'REACT_APP_GCP_SERVICE_ACCOUNT_KEY': process.env.REACT_APP_GCP_SERVICE_ACCOUNT_KEY,
  };

  const getStatus = (key, value) => {
    if (!value) return { icon: XCircle, color: 'text-red-600', status: 'Not Set' };
    
    if (key === 'REACT_APP_ENABLE_MOCK_DATA') {
      if (value === 'false') return { icon: CheckCircle, color: 'text-green-600', status: 'Correct (false)' };
      if (value === 'true') return { icon: AlertTriangle, color: 'text-yellow-600', status: 'Using Mock Data' };
    }
    
    if (key === 'REACT_APP_GCP_SERVICE_ACCOUNT_KEY') {
      try {
        const parsed = JSON.parse(value);
        if (parsed.type === 'service_account') {
          return { icon: CheckCircle, color: 'text-green-600', status: 'Valid JSON' };
        }
      } catch (e) {
        return { icon: XCircle, color: 'text-red-600', status: 'Invalid JSON' };
      }
    }
    
    return { icon: CheckCircle, color: 'text-green-600', status: 'Set' };
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Variables Test</h3>
      
      <div className="space-y-3">
        {Object.entries(envVars).map(([key, value]) => {
          const { icon: Icon, color, status } = getStatus(key, value);
          const displayValue = key === 'REACT_APP_GCP_SERVICE_ACCOUNT_KEY' 
            ? (value ? 'JSON Key Set' : 'Not Set')
            : value || 'Not Set';
          
          return (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <div>
                  <div className="font-medium text-gray-900">{key}</div>
                  <div className="text-sm text-gray-600">{displayValue}</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${color}`}>
                {status}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Quick Fix:</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>1. Make sure your .env file is in the root directory</p>
          <p>2. Restart the development server after changing .env</p>
          <p>3. Check that REACT_APP_ENABLE_MOCK_DATA=false</p>
          <p>4. Verify your GCP credentials are properly formatted</p>
        </div>
      </div>
    </div>
  );
};

export default EnvTest;
