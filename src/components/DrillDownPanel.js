import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Server, 
  HardDrive, 
  Network, 
  Database,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Info,
  ExternalLink
} from 'lucide-react';

const DrillDownPanel = ({ 
  data, 
  onResourceSelect, 
  selectedResource,
  title = "Resource Details"
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'compute':
        return Server;
      case 'storage':
        return HardDrive;
      case 'network':
        return Network;
      case 'database':
        return Database;
      default:
        return Server;
    }
  };

  const formatCost = (cost) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cost);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const ResourceItem = ({ resource, level = 0 }) => {
    const Icon = getResourceIcon(resource.type);
    const isExpanded = expandedItems.has(resource.id);
    const hasChildren = resource.children && resource.children.length > 0;
    const isSelected = selectedResource?.id === resource.id;

    return (
      <div className={`${level > 0 ? 'ml-4' : ''}`}>
        <motion.div
          whileHover={{ x: 4 }}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
            isSelected 
              ? 'bg-blue-50 border border-blue-200' 
              : 'hover:bg-gray-50 border border-transparent'
          }`}
          onClick={() => onResourceSelect(resource)}
        >
          <div className="flex items-center space-x-3 flex-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(resource.id);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            
            <div className={`p-2 rounded-lg ${
              resource.type === 'compute' ? 'bg-blue-100' :
              resource.type === 'storage' ? 'bg-green-100' :
              resource.type === 'network' ? 'bg-orange-100' :
              resource.type === 'database' ? 'bg-purple-100' :
              'bg-gray-100'
            }`}>
              <Icon className={`w-4 h-4 ${
                resource.type === 'compute' ? 'text-blue-600' :
                resource.type === 'storage' ? 'text-green-600' :
                resource.type === 'network' ? 'text-orange-600' :
                resource.type === 'database' ? 'text-purple-600' :
                'text-gray-600'
              }`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{resource.name}</h4>
                {resource.status && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    resource.status === 'running' ? 'bg-green-100 text-green-800' :
                    resource.status === 'stopped' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {resource.status}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{resource.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {formatCost(resource.cost)}
              </div>
              <div className="flex items-center text-xs">
                {resource.costChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                )}
                <span className={resource.costChange > 0 ? 'text-red-600' : 'text-green-600'}>
                  {Math.abs(resource.costChange)}%
                </span>
              </div>
            </div>
            
            {resource.utilization && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Utilization</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPercentage(resource.utilization)}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              {resource.children.map((child) => (
                <ResourceItem key={child.id} resource={child} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ResourceDetails = ({ resource }) => {
    if (!resource) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resource Details</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium text-gray-900">{resource.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{resource.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Region:</span>
                <span className="text-sm font-medium text-gray-900">{resource.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${
                  resource.status === 'running' ? 'text-green-600' :
                  resource.status === 'stopped' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {resource.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cost Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Cost:</span>
                <span className="text-sm font-medium text-gray-900">{formatCost(resource.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cost Change:</span>
                <span className={`text-sm font-medium ${
                  resource.costChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {resource.costChange > 0 ? '+' : ''}{resource.costChange}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Utilization:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(resource.utilization || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency Score:</span>
                <span className="text-sm font-medium text-gray-900">
                  {resource.efficiencyScore || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {resource.recommendations && resource.recommendations.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
            <div className="space-y-2">
              {resource.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">{rec.description}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Potential savings: {formatCost(rec.potentialSavings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          {Array.isArray(data) ? data.length : 0} resources
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {(Array.isArray(data) ? data : []).map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </div>

        <div>
          <ResourceDetails resource={selectedResource} />
        </div>
      </div>
    </div>
  );
};

export default DrillDownPanel;
