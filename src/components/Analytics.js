import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Cloud,
  Database,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
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
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('cost');

  // Sample cross-cloud analytics data
  const crossCloudData = [
    { month: 'Jan', gcp: 45000, azure: 12000, total: 57000, efficiency: 82 },
    { month: 'Feb', gcp: 48000, azure: 11000, total: 59000, efficiency: 85 },
    { month: 'Mar', gcp: 52000, azure: 13000, total: 65000, efficiency: 87 },
    { month: 'Apr', gcp: 49000, azure: 12500, total: 61500, efficiency: 84 },
    { month: 'May', gcp: 55000, azure: 14000, total: 69000, efficiency: 89 },
    { month: 'Jun', gcp: 58000, azure: 13500, total: 71500, efficiency: 91 },
  ];

  const costEfficiencyData = [
    { service: 'Compute', gcp: 78, azure: 82, industry: 75 },
    { service: 'Storage', gcp: 85, azure: 88, industry: 80 },
    { service: 'Network', gcp: 72, azure: 75, industry: 70 },
    { service: 'Database', gcp: 90, azure: 85, industry: 82 },
  ];

  const optimizationOpportunities = [
    {
      type: 'cross_cloud',
      title: 'Workload Migration',
      description: 'Move 3 Azure VMs to GCP for better pricing',
      potential_savings: '$2,400/month',
      effort: 'Medium',
      priority: 'high',
      icon: ArrowUpRight
    },
    {
      type: 'reserved_instances',
      title: 'Reserved Instance Strategy',
      description: 'Implement RI across both clouds for predictable workloads',
      potential_savings: '$8,500/month',
      effort: 'Low',
      priority: 'high',
      icon: Target
    },
    {
      type: 'storage_optimization',
      title: 'Unified Storage Strategy',
      description: 'Consolidate storage tiers across cloud providers',
      potential_savings: '$3,200/month',
      effort: 'High',
      priority: 'medium',
      icon: Database
    }
  ];

  const kpis = [
    {
      title: 'Total Cloud Spend',
      value: '$71,500',
      change: '+8.2%',
      trend: 'up',
      target: '$65,000',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Cost Efficiency Score',
      value: '91%',
      change: '+4.1%',
      trend: 'up',
      target: '85%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'GCP vs Azure Ratio',
      value: '4.3:1',
      change: '+0.2',
      trend: 'up',
      target: '4:1',
      icon: Cloud,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Optimization Savings',
      value: '$14,100',
      change: '+12.5%',
      trend: 'up',
      target: '$10,000',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const forecastData = [
    { month: 'Jul', predicted: 75000, actual: null, confidence: 85 },
    { month: 'Aug', predicted: 78000, actual: null, confidence: 82 },
    { month: 'Sep', predicted: 82000, actual: null, confidence: 78 },
    { month: 'Oct', predicted: 85000, actual: null, confidence: 75 },
  ];

  const costDistribution = [
    { name: 'GCP', value: 81, cost: 58000, color: '#4285f4' },
    { name: 'Azure', value: 19, cost: 13500, color: '#0078d4' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            </div>
            <p className="text-gray-600">Cross-cloud insights and predictive analytics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3m">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cost">Cost Analysis</option>
                <option value="efficiency">Efficiency</option>
                <option value="utilization">Utilization</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`metric-card ${kpi.bgColor} border-l-4 border-blue-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs target</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">Target: {kpi.target}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cross-Cloud Cost Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cross-Cloud Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={crossCloudData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="cost" stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="efficiency" orientation="right" stroke="#6b7280" tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'efficiency') return [`${value}%`, 'Efficiency'];
                  return [`$${value.toLocaleString()}`, name.toUpperCase()];
                }}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area yAxisId="cost" type="monotone" dataKey="gcp" stackId="1" stroke="#4285f4" fill="#4285f4" fillOpacity={0.6} />
              <Area yAxisId="cost" type="monotone" dataKey="azure" stackId="1" stroke="#0078d4" fill="#0078d4" fillOpacity={0.6} />
              <Line yAxisId="efficiency" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cost Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cloud Cost Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {costDistribution.map((entry, index) => (
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
            {costDistribution.map((cloud, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: cloud.color }}
                  ></div>
                  <span className="text-gray-600">{cloud.name}</span>
                </div>
                <span className="font-medium">${cloud.cost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Cost Efficiency Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="chart-container"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Efficiency vs Industry Benchmark</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="service" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name.replace(/([A-Z])/g, ' $1').trim()]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="gcp" fill="#4285f4" radius={[2, 2, 0, 0]} />
            <Bar dataKey="azure" fill="#0078d4" radius={[2, 2, 0, 0]} />
            <Bar dataKey="industry" fill="#6b7280" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">GCP</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Azure</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Industry Average</span>
          </div>
        </div>
      </motion.div>

      {/* Optimization Opportunities and Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimization Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Optimization Opportunities</h3>
          <div className="space-y-4">
            {optimizationOpportunities.map((opp, index) => {
              const Icon = opp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    opp.priority === 'high' 
                      ? 'bg-red-50 border-red-400' 
                      : 'bg-yellow-50 border-yellow-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <Icon className={`w-5 h-5 mt-0.5 mr-3 ${
                        opp.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{opp.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{opp.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-green-600">
                            Savings: {opp.potential_savings}
                          </span>
                          <span className="text-sm text-gray-500">Effort: {opp.effort}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opp.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {opp.priority.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Cost Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Forecast (Next 4 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...crossCloudData, ...forecastData]}>
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
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Actual</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2" style={{ background: 'repeating-linear-gradient(45deg, #10b981, #10b981 2px, transparent 2px, transparent 4px)' }}></div>
              <span className="text-sm text-gray-600">Forecast</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
