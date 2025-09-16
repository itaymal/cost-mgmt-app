import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Server, 
  HardDrive, 
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';
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

const AzureDashboard = () => {
  // Sample Azure data
  const azureCostData = [
    { month: 'Jan', compute: 6000, storage: 2000, network: 1500, database: 2500 },
    { month: 'Feb', compute: 5500, storage: 1800, network: 1400, database: 2300 },
    { month: 'Mar', compute: 6500, storage: 2200, network: 1600, database: 2700 },
    { month: 'Apr', compute: 6200, storage: 2100, network: 1550, database: 2550 },
    { month: 'May', compute: 7000, storage: 2400, network: 1700, database: 2900 },
    { month: 'Jun', compute: 7500, storage: 2500, network: 1800, database: 3200 },
  ];

  const resourceGroupData = [
    { name: 'Production-RG', cost: 8000, percentage: 59 },
    { name: 'Dev-Test-RG', cost: 4000, percentage: 30 },
    { name: 'Backup-RG', cost: 1500, percentage: 11 },
  ];

  const serviceBreakdown = [
    { name: 'Virtual Machines', value: 40, cost: 5400, color: '#0078d4' },
    { name: 'Storage Accounts', value: 25, cost: 3375, color: '#8764b8' },
    { name: 'SQL Database', value: 20, cost: 2700, color: '#00bcf2' },
    { name: 'App Service', value: 10, cost: 1350, color: '#ff6900' },
    { name: 'Other', value: 5, cost: 675, color: '#107c10' },
  ];

  const metrics = [
    {
      title: 'Total Azure Spend',
      value: '$13,500',
      change: '-2.3%',
      trend: 'down',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Virtual Machines',
      value: '$7,500',
      change: '+7.1%',
      trend: 'up',
      icon: Server,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Storage Costs',
      value: '$2,500',
      change: '+4.2%',
      trend: 'up',
      icon: HardDrive,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Database Services',
      value: '$3,200',
      change: '+10.3%',
      trend: 'up',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const recommendations = [
    {
      type: 'reserved_instances',
      title: 'Purchase Reserved Instances',
      description: 'Save up to 72% on predictable VM workloads',
      potential_savings: '$2,100/month',
      priority: 'high',
      icon: CheckCircle
    },
    {
      type: 'storage_optimization',
      title: 'Optimize Storage Tiers',
      description: 'Move infrequently accessed data to Archive tier',
      potential_savings: '$800/month',
      priority: 'medium',
      icon: HardDrive
    },
    {
      type: 'auto_shutdown',
      title: 'Implement Auto-Shutdown',
      description: 'Automatically shutdown dev/test VMs during off-hours',
      potential_savings: '$1,200/month',
      priority: 'high',
      icon: Clock
    }
  ];

  const costAlerts = [
    { type: 'budget', message: 'Monthly budget 85% utilized', threshold: 85, current: 85 },
    { type: 'anomaly', message: 'Unusual spike in VM costs detected', threshold: 100, current: 120 },
    { type: 'optimization', message: '3 VMs can be downsized', threshold: 0, current: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Microsoft Azure</h1>
        </div>
        <p className="text-gray-600">Cost analysis and optimization insights for Azure resources</p>
      </motion.div>

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

      {/* Cost Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {costAlerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'budget' 
                ? 'bg-yellow-50 border-yellow-400' 
                : alert.type === 'anomaly'
                ? 'bg-red-50 border-red-400'
                : 'bg-blue-50 border-blue-400'
            }`}
          >
            <div className="flex items-center">
              <AlertTriangle className={`w-5 h-5 mr-2 ${
                alert.type === 'budget' 
                  ? 'text-yellow-600' 
                  : alert.type === 'anomaly'
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`} />
              <span className="text-sm font-medium text-gray-800">{alert.message}</span>
            </div>
            {alert.threshold > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Threshold: {alert.threshold}%</span>
                  <span>Current: {alert.current}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      alert.current > alert.threshold ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(alert.current, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </motion.div>

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
            <AreaChart data={azureCostData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
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
              <Area type="monotone" dataKey="compute" stackId="1" stroke="#0078d4" fill="#0078d4" fillOpacity={0.6} />
              <Area type="monotone" dataKey="storage" stackId="1" stroke="#8764b8" fill="#8764b8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="network" stackId="1" stroke="#00bcf2" fill="#00bcf2" fillOpacity={0.6} />
              <Area type="monotone" dataKey="database" stackId="1" stroke="#ff6900" fill="#ff6900" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Resource Group Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost by Resource Group</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceGroupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
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
              <Bar dataKey="cost" fill="#0078d4" radius={[4, 4, 0, 0]} />
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <Icon className={`w-5 h-5 mt-0.5 mr-3 ${
                        rec.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex items-center space-x-4">
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
                      </div>
                    </div>
                    <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Implement
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Azure-Specific Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Reserved Instances Analysis */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Reserved Instance Opportunities</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">Standard_D2s_v3</h4>
                <span className="text-sm text-blue-600">3 instances</span>
              </div>
              <p className="text-sm text-blue-700 mb-2">Running 24/7 for 6+ months</p>
              <div className="flex justify-between text-sm">
                <span>Current Cost: $450/month</span>
                <span className="font-medium text-green-600">RI Cost: $180/month</span>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-900">Standard_D4s_v3</h4>
                <span className="text-sm text-green-600">2 instances</span>
              </div>
              <p className="text-sm text-green-700 mb-2">Running 24/7 for 4+ months</p>
              <div className="flex justify-between text-sm">
                <span>Current Cost: $600/month</span>
                <span className="font-medium text-green-600">RI Cost: $240/month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Management Insights */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Management Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Cost per GB Storage</span>
              </div>
              <span className="text-sm font-medium text-green-600">-15% vs last month</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Network className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">Data Transfer Costs</span>
              </div>
              <span className="text-sm font-medium text-blue-600">$180 this month</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm text-gray-700">Security Services</span>
              </div>
              <span className="text-sm font-medium text-purple-600">$320 this month</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AzureDashboard;
