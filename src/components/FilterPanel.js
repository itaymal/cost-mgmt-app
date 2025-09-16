import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Calendar, 
  ChevronDown, 
  X,
  Cloud,
  Database,
  Server,
  HardDrive,
  Network
} from 'lucide-react';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  availableProjects = [], 
  availableServices = [],
  availableRegions = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const filterTypes = [
    {
      id: 'timeRange',
      label: 'Time Range',
      icon: Calendar,
      options: [
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: '90d', label: 'Last 90 days' },
        { value: '6m', label: 'Last 6 months' },
        { value: '1y', label: 'Last year' },
        { value: 'custom', label: 'Custom range' }
      ]
    },
    {
      id: 'project',
      label: 'Project',
      icon: Cloud,
      options: availableProjects.map(project => ({
        value: project.id,
        label: project.name
      }))
    },
    {
      id: 'service',
      label: 'Service',
      icon: Server,
      options: availableServices.map(service => ({
        value: service.id,
        label: service.name
      }))
    },
    {
      id: 'region',
      label: 'Region',
      icon: Database,
      options: availableRegions.map(region => ({
        value: region.id,
        label: region.name
      }))
    },
    {
      id: 'resourceType',
      label: 'Resource Type',
      icon: HardDrive,
      options: [
        { value: 'compute', label: 'Compute' },
        { value: 'storage', label: 'Storage' },
        { value: 'network', label: 'Network' },
        { value: 'database', label: 'Database' },
        { value: 'other', label: 'Other' }
      ]
    }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    onFiltersChange(newFilters);
    setActiveFilter(null);
  };

  const clearFilter = (filterType) => {
    const newFilters = { ...filters };
    delete newFilters[filterType];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {getActiveFiltersCount() > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all
            </motion.button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {Object.entries(filters).map(([key, value]) => {
            const filterType = filterTypes.find(f => f.id === key);
            const option = filterType?.options.find(opt => opt.value === value);
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full"
              >
                <span className="text-xs text-blue-700">{option?.label || value}</span>
                <button
                  onClick={() => clearFilter(key)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterTypes.map((filterType) => {
                const Icon = filterType.icon;
                const isActive = activeFilter === filterType.id;
                
                return (
                  <div key={filterType.id} className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveFilter(isActive ? null : filterType.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{filterType.label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                        >
                          <div className="max-h-48 overflow-y-auto">
                            {filterType.options.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => handleFilterChange(filterType.id, option.value)}
                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                                  filters[filterType.id] === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
