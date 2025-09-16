import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Server, 
  Database, 
  HardDrive, 
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  RefreshCw
} from 'lucide-react';
import FilterPanel from './FilterPanel';
import DrillDownPanel from './DrillDownPanel';
import EnvTest from './EnvTest';
import cloudDataService from '../services/cloudDataService';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const GCPDashboard = () => {
  const [filters, setFilters] = useState({});
  const [selectedResource, setSelectedResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch real GCP data
  useEffect(() => {
    const fetchGCPData = async () => {
      setIsLoading(true);
      try {
        const [costData, projectsData, resourcesData, recommendationsData] = await Promise.all([
          cloudDataService.getProviderData('gcp', 'costs', {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
          }),
          cloudDataService.getProviderData('gcp', 'projects'),
          cloudDataService.getProviderData('gcp', 'resources', { projectId: filters.project }),
          cloudDataService.getProviderData('gcp', 'recommendations', { projectId: filters.project })
        ]);

        setRealTimeData({
          costData,
          projectsData,
          resourcesData,
          recommendationsData
        });
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching GCP data:', error);
        // Fall back to mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchGCPData();
  }, [filters.project]);

  // Sample GCP data (fallback)
  const gcpCostData = [
    { month: 'Jan', compute: 25000, storage: 8000, network: 5000, database: 7000 },
    { month: 'Feb', compute: 28000, storage: 7500, network: 5500, database: 7000 },
    { month: 'Mar', compute: 30000, storage: 9000, network: 6000, database: 7000 },
    { month: 'Apr', compute: 27000, storage: 8500, network: 5500, database: 7000 },
    { month: 'May', compute: 32000, storage: 9500, network: 6500, database: 7000 },
    { month: 'Jun', compute: 35000, storage: 10000, network: 7000, database: 7000 },
  ];

  const projectData = [
    { name: 'Production', cost: 35000, percentage: 60 },
    { name: 'Staging', cost: 15000, percentage: 26 },
    { name: 'Development', cost: 8000, percentage: 14 },
  ];

  const serviceBreakdown = [
    { name: 'Compute Engine', value: 35, cost: 20300, color: '#4285f4' },
    { name: 'Cloud Storage', value: 20, cost: 11600, color: '#34a853' },
    { name: 'Cloud SQL', value: 15, cost: 8700, color: '#fbbc04' },
    { name: 'Cloud Functions', value: 12, cost: 6960, color: '#ea4335' },
    { name: 'BigQuery', value: 10, cost: 5800, color: '#9aa0a6' },
    { name: 'Other', value: 8, cost: 4640, color: '#ff6d01' },
  ];

  const metrics = [
    {
      title: 'Total GCP Spend',
      value: '$58,000',
      change: '+12.1%',
      trend: 'up',
      icon: Cloud,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Compute Engine',
      value: '$35,000',
      change: '+15.2%',
      trend: 'up',
      icon: Server,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Storage Costs',
      value: '$10,000',
      change: '+8.5%',
      trend: 'up',
      icon: HardDrive,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Network Transfer',
      value: '$7,000',
      change: '+12.8%',
      trend: 'up',
      icon: Network,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const recommendations = [
    {
      type: 'cost_optimization',
      title: 'Resize Underutilized Instances',
      description: '15 instances are running at <30% CPU utilization',
      potential_savings: '$3,200/month',
      priority: 'high',
      icon: TrendingDown,
      affected_resources: ['instance-1', 'instance-2', 'instance-3']
    },
    {
      type: 'storage_optimization',
      title: 'Archive Old Data',
      description: '2.5TB of data can be moved to Coldline storage',
      potential_savings: '$1,800/month',
      priority: 'medium',
      icon: HardDrive,
      affected_resources: ['bucket-prod-logs', 'bucket-backup-data']
    },
    {
      type: 'commitment_discount',
      title: 'Purchase Committed Use Discounts',
      description: 'Save 20% on predictable workloads',
      potential_savings: '$4,500/month',
      priority: 'high',
      icon: CheckCircle,
      affected_resources: ['instance-prod-1', 'instance-prod-2']
    }
  ];

  // Sample resource data for drill-down
  const resourceData = [
    {
      id: 'instance-1',
      name: 'production-web-server-1',
      type: 'compute',
      description: 'High-memory instance for web applications',
      region: 'us-central1',
      status: 'running',
      cost: 450,
      costChange: 12.5,
      utilization: 25,
      efficiencyScore: 'Low',
      tags: ['production', 'web', 'high-memory'],
      recommendations: [
        {
          description: 'Consider downsizing to n1-standard-2',
          potentialSavings: 180
        }
      ],
      children: [
        {
          id: 'disk-1',
          name: 'production-web-server-1-boot',
          type: 'storage',
          description: 'Boot disk',
          region: 'us-central1',
          status: 'running',
          cost: 25,
          costChange: 0,
          utilization: 45
        }
      ]
    },
    {
      id: 'bucket-prod-logs',
      name: 'company-prod-logs',
      type: 'storage',
      description: 'Production application logs',
      region: 'us-central1',
      status: 'running',
      cost: 320,
      costChange: 8.2,
      utilization: 78,
      efficiencyScore: 'Medium',
      tags: ['production', 'logs', 'storage'],
      recommendations: [
        {
          description: 'Move old logs to Coldline storage class',
          potentialSavings: 150
        }
      ]
    }
  ];

  // Sample filter options
  const availableProjects = [
    { id: 'prod-project', name: 'Production Project' },
    { id: 'dev-project', name: 'Development Project' },
    { id: 'staging-project', name: 'Staging Project' }
  ];

  const availableServices = [
    { id: 'compute-engine', name: 'Compute Engine' },
    { id: 'cloud-storage', name: 'Cloud Storage' },
    { id: 'cloud-sql', name: 'Cloud SQL' },
    { id: 'cloud-functions', name: 'Cloud Functions' }
  ];

  const availableRegions = [
    { id: 'us-central1', name: 'US Central' },
    { id: 'us-east1', name: 'US East' },
    { id: 'europe-west1', name: 'Europe West' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cloud className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Google Cloud Platform</h1>
            {isLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </motion.div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        <p className="text-gray-600">
          {realTimeData ? 'Live data from GCP APIs' : 'Detailed cost analysis and optimization insights for GCP'}
        </p>
      </motion.div>

      {/* Environment Test - Remove this after debugging */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <EnvTest />
        </motion.div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        availableProjects={realTimeData?.projectsData || availableProjects}
        availableServices={availableServices}
        availableRegions={availableRegions}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`metric-card ${metric.bgColor} ${metric.borderColor} border-l-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Cost Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={gcpCostData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value, name) => [`$${value.toLocaleString()}`, name.replace(/([A-Z])/g, ' $1').trim()]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="compute" stackId="1" stroke="#4285f4" fill="#4285f4" fillOpacity={0.6} />
              <Area type="monotone" dataKey="storage" stackId="1" stroke="#34a853" fill="#34a853" fillOpacity={0.6} />
              <Area type="monotone" dataKey="network" stackId="1" stroke="#fbbc04" fill="#fbbc04" fillOpacity={0.6} />
              <Area type="monotone" dataKey="database" stackId="1" stroke="#ea4335" fill="#ea4335" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Project Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost by Project</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value, name) => [`$${value.toLocaleString()}`, 'Cost']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="cost" fill="#4285f4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Service Breakdown and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={serviceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [
                `${value}%`, 
                props.payload.name,
                `$${props.payload.cost.toLocaleString()}`
              ]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {serviceBreakdown.map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: service.color }}
                  ></div>
                  <span className="text-gray-600">{service.name}</span>
                </div>
                <span className="font-medium">${service.cost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cost Optimization Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Optimization Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' 
                      ? 'bg-red-50 border-red-400' 
                      : 'bg-yellow-50 border-yellow-400'
                  }`}
                >
                  <div className="flex items-start">
                    <Icon className={`w-5 h-5 mt-0.5 mr-3 ${
                      rec.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm font-medium text-green-600">
                          Potential Savings: {rec.potential_savings}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rec.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      {rec.affected_resources && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Affected Resources:</p>
                          <div className="flex flex-wrap gap-1">
                            {rec.affected_resources.map((resource, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Resource Utilization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="chart-container"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Resource Utilization Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
            <div className="text-sm text-gray-600 mb-2">CPU Utilization</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">65%</div>
            <div className="text-sm text-gray-600 mb-2">Memory Utilization</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">45%</div>
            <div className="text-sm text-gray-600 mb-2">Storage Utilization</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resource Drill-Down */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="chart-container"
      >
        <DrillDownPanel
          data={realTimeData?.resourcesData || resourceData}
          onResourceSelect={setSelectedResource}
          selectedResource={selectedResource}
          title="GCP Resources"
        />
      </motion.div>
    </div>
  );
};

export default GCPDashboard;
