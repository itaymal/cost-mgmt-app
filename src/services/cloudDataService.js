// Generic Cloud Data Service
// This service provides a unified interface for different cloud providers

import GCPService from './gcpService';

class CloudDataService {
  constructor() {
    this.providers = {
      gcp: GCPService,
      azure: null, // Will be implemented later
      aws: null    // Future implementation
    };
  }

  // Get data for a specific provider
  async getProviderData(provider, dataType, options = {}) {
    const service = this.providers[provider];
    
    if (!service) {
      throw new Error(`Provider ${provider} not supported`);
    }

    switch (dataType) {
      case 'costs':
        return await this.getCostData(provider, options);
      case 'projects':
        return await this.getProjects(provider, options);
      case 'resources':
        return await this.getResources(provider, options);
      case 'recommendations':
        return await this.getRecommendations(provider, options);
      case 'utilization':
        return await this.getUtilization(provider, options);
      default:
        throw new Error(`Data type ${dataType} not supported`);
    }
  }

  // Get cost data for a provider
  async getCostData(provider, options) {
    const { startDate, endDate, projectId, filters = {} } = options;
    
    try {
      let data;
      
      switch (provider) {
        case 'gcp':
          data = await this.providers.gcp.getCostData(startDate, endDate, projectId);
          break;
        case 'azure':
          // Azure implementation will go here
          data = this.getMockAzureCostData();
          break;
        default:
          throw new Error(`Cost data not available for ${provider}`);
      }

      return this.transformCostData(data, provider);
    } catch (error) {
      console.error(`Error fetching cost data for ${provider}:`, error);
      // Return mock data for development
      return this.getMockCostData(provider);
    }
  }

  // Get projects for a provider
  async getProjects(provider, options = {}) {
    try {
      let data;
      
      switch (provider) {
        case 'gcp':
          data = await this.providers.gcp.getProjects();
          break;
        case 'azure':
          data = this.getMockAzureProjects();
          break;
        default:
          throw new Error(`Projects not available for ${provider}`);
      }

      return this.transformProjectsData(data, provider);
    } catch (error) {
      console.error(`Error fetching projects for ${provider}:`, error);
      return this.getMockProjectsData(provider);
    }
  }

  // Get resources for a provider
  async getResources(provider, options = {}) {
    const { projectId, resourceType, filters = {} } = options;
    
    try {
      let data;
      
      switch (provider) {
        case 'gcp':
          data = await this.getGCPResources(projectId, resourceType);
          break;
        case 'azure':
          data = this.getMockAzureResources();
          break;
        default:
          throw new Error(`Resources not available for ${provider}`);
      }

      return this.transformResourcesData(data, provider);
    } catch (error) {
      console.error(`Error fetching resources for ${provider}:`, error);
      return this.getMockResourcesData(provider);
    }
  }

  // Get GCP resources
  async getGCPResources(projectId, resourceType) {
    const gcpService = this.providers.gcp;
    
    switch (resourceType) {
      case 'compute':
        return await gcpService.getComputeInstances(projectId);
      case 'storage':
        return await gcpService.getStorageBuckets(projectId);
      case 'database':
        return await gcpService.getSQLInstances(projectId);
      default:
        // Get all resource types
        const [compute, storage, database] = await Promise.all([
          gcpService.getComputeInstances(projectId).catch(() => ({ items: [] })),
          gcpService.getStorageBuckets(projectId).catch(() => ({ items: [] })),
          gcpService.getSQLInstances(projectId).catch(() => ({ items: [] }))
        ]);
        
        return {
          compute: compute.items || [],
          storage: storage.items || [],
          database: database.items || []
        };
    }
  }

  // Get recommendations for a provider
  async getRecommendations(provider, options = {}) {
    const { projectId } = options;
    
    try {
      let data;
      
      switch (provider) {
        case 'gcp':
          data = await this.providers.gcp.getCostRecommendations(projectId);
          break;
        case 'azure':
          data = this.getMockAzureRecommendations();
          break;
        default:
          throw new Error(`Recommendations not available for ${provider}`);
      }

      return this.transformRecommendationsData(data, provider);
    } catch (error) {
      console.error(`Error fetching recommendations for ${provider}:`, error);
      return this.getMockRecommendationsData(provider);
    }
  }

  // Get utilization data for a provider
  async getUtilization(provider, options = {}) {
    const { projectId, resourceId, resourceType } = options;
    
    try {
      let data;
      
      switch (provider) {
        case 'gcp':
          data = await this.providers.gcp.getResourceUtilization(projectId, resourceType, resourceId);
          break;
        case 'azure':
          data = this.getMockAzureUtilization();
          break;
        default:
          throw new Error(`Utilization data not available for ${provider}`);
      }

      return this.transformUtilizationData(data, provider);
    } catch (error) {
      console.error(`Error fetching utilization for ${provider}:`, error);
      return this.getMockUtilizationData(provider);
    }
  }

  // Transform cost data to unified format
  transformCostData(data, provider) {
    const baseFormat = {
      provider,
      totalCost: 0,
      currency: 'USD',
      timeRange: {},
      services: [],
      projects: [],
      trends: []
    };

    switch (provider) {
      case 'gcp':
        return {
          ...baseFormat,
          totalCost: data.totalCost || 0,
          services: data.services || [],
          projects: data.projects || []
        };
      case 'azure':
        return {
          ...baseFormat,
          totalCost: data.totalCost || 0,
          services: data.services || [],
          projects: data.projects || []
        };
      default:
        return baseFormat;
    }
  }

  // Transform projects data to unified format
  transformProjectsData(data, provider) {
    return data.projects?.map(project => ({
      id: project.projectId || project.id,
      name: project.name || project.displayName,
      provider,
      status: project.lifecycleState || 'ACTIVE',
      cost: project.cost || 0
    })) || [];
  }

  // Transform resources data to unified format
  transformResourcesData(data, provider) {
    const resources = [];
    
    if (data.compute) {
      resources.push(...data.compute.map(resource => ({
        ...resource,
        provider,
        type: 'compute'
      })));
    }
    
    if (data.storage) {
      resources.push(...data.storage.map(resource => ({
        ...resource,
        provider,
        type: 'storage'
      })));
    }
    
    if (data.database) {
      resources.push(...data.database.map(resource => ({
        ...resource,
        provider,
        type: 'database'
      })));
    }

    return resources;
  }

  // Transform recommendations data to unified format
  transformRecommendationsData(data, provider) {
    return data.recommendations?.map(rec => ({
      ...rec,
      provider,
      id: rec.name || rec.id,
      type: rec.category || 'optimization',
      priority: this.mapPriority(rec.priority),
      potential_savings: this.formatSavings(rec.costImpact)
    })) || [];
  }

  // Transform utilization data to unified format
  transformUtilizationData(data, provider) {
    return {
      provider,
      metrics: data.timeSeries || [],
      summary: data.summary || {}
    };
  }

  // Map priority levels
  mapPriority(priority) {
    const priorityMap = {
      'HIGH': 'high',
      'MEDIUM': 'medium',
      'LOW': 'low',
      'CRITICAL': 'high'
    };
    
    return priorityMap[priority] || 'medium';
  }

  // Format savings amount
  formatSavings(costImpact) {
    if (!costImpact) return '$0';
    
    const amount = Math.abs(costImpact.amount || costImpact);
    return `$${amount.toLocaleString()}`;
  }

  // Mock data methods for development
  getMockCostData(provider) {
    const mockData = {
      gcp: {
        totalCost: 58000,
        services: [
          { name: 'Compute Engine', cost: 35000 },
          { name: 'Cloud Storage', cost: 10000 },
          { name: 'Cloud SQL', cost: 7000 },
          { name: 'Cloud Functions', cost: 6000 }
        ]
      },
      azure: {
        totalCost: 13500,
        services: [
          { name: 'Virtual Machines', cost: 7500 },
          { name: 'Storage Accounts', cost: 2500 },
          { name: 'SQL Database', cost: 2000 },
          { name: 'App Service', cost: 1500 }
        ]
      }
    };

    return this.transformCostData(mockData[provider] || mockData.gcp, provider);
  }

  getMockProjectsData(provider) {
    const mockData = {
      gcp: [
        { projectId: 'prod-project', name: 'Production Project' },
        { projectId: 'dev-project', name: 'Development Project' },
        { projectId: 'staging-project', name: 'Staging Project' }
      ],
      azure: [
        { id: 'prod-rg', name: 'Production Resource Group' },
        { id: 'dev-rg', name: 'Development Resource Group' },
        { id: 'staging-rg', name: 'Staging Resource Group' }
      ]
    };

    return this.transformProjectsData({ projects: mockData[provider] || mockData.gcp }, provider);
  }

  getMockResourcesData(provider) {
    // Return empty array for now - will be populated by specific provider methods
    return [];
  }

  getMockRecommendationsData(provider) {
    const mockData = {
      gcp: [
        {
          name: 'resize-instances',
          category: 'cost_optimization',
          priority: 'HIGH',
          costImpact: { amount: 3200 }
        }
      ],
      azure: [
        {
          name: 'reserved-instances',
          category: 'cost_optimization',
          priority: 'HIGH',
          costImpact: { amount: 2100 }
        }
      ]
    };

    return this.transformRecommendationsData({ recommendations: mockData[provider] || mockData.gcp }, provider);
  }

  getMockUtilizationData(provider) {
    return {
      provider,
      metrics: [],
      summary: {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        storage: Math.random() * 100
      }
    };
  }

  // Azure mock data methods
  getMockAzureCostData() {
    return {
      totalCost: 13500,
      services: [
        { name: 'Virtual Machines', cost: 7500 },
        { name: 'Storage Accounts', cost: 2500 },
        { name: 'SQL Database', cost: 2000 },
        { name: 'App Service', cost: 1500 }
      ]
    };
  }

  getMockAzureProjects() {
    return {
      projects: [
        { id: 'prod-rg', name: 'Production Resource Group' },
        { id: 'dev-rg', name: 'Development Resource Group' },
        { id: 'staging-rg', name: 'Staging Resource Group' }
      ]
    };
  }

  getMockAzureResources() {
    return {
      compute: [],
      storage: [],
      database: []
    };
  }

  getMockAzureRecommendations() {
    return {
      recommendations: [
        {
          name: 'reserved-instances',
          category: 'cost_optimization',
          priority: 'HIGH',
          costImpact: { amount: 2100 }
        }
      ]
    };
  }

  getMockAzureUtilization() {
    return {
      timeSeries: [],
      summary: {
        cpu: 65,
        memory: 70,
        storage: 45
      }
    };
  }
}

export default new CloudDataService();
