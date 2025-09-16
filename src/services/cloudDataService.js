// Simple Cloud Data Service using the backend server
import gcpService from './gcpService';

class CloudDataService {
  constructor() {
    this.useMockData = process.env.REACT_APP_ENABLE_MOCK_DATA === 'true';
    console.log('🔧 CloudDataService initialized with mock data:', this.useMockData);
  }

  async getProviderData(provider, dataType, params = {}) {
    console.log(`📊 Fetching ${dataType} for ${provider}`, params);
    
    if (this.useMockData) {
      console.log('🎭 Using mock data');
      return this.getMockData(provider, dataType, params);
    }

    try {
      switch (provider.toLowerCase()) {
        case 'gcp':
          return await this.getGCPData(dataType, params);
        case 'azure':
          return await this.getAzureData(dataType, params);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${dataType} for ${provider}:`, error);
      console.log('🔄 Falling back to mock data');
      return this.getMockData(provider, dataType, params);
    }
  }

  async getGCPData(dataType, params) {
    switch (dataType) {
      case 'costs':
        return await this.getCostData(params);
      case 'projects':
        return await this.getProjects();
      case 'resources':
        return await this.getResources(params);
      case 'recommendations':
        return await this.getRecommendations(params);
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
  }

  async getCostData(params) {
    try {
      const billingAccounts = await gcpService.getBillingAccounts();
      // For now, return mock cost data structure
      return {
        totalCost: 58000,
        currency: 'USD',
        services: [
          { name: 'Compute Engine', cost: 35000 },
          { name: 'Cloud Storage', cost: 10000 },
          { name: 'Cloud SQL', cost: 7000 },
          { name: 'Cloud Functions', cost: 6000 }
        ],
        billingAccounts: billingAccounts
      };
    } catch (error) {
      console.error('Error fetching cost data:', error);
      throw error;
    }
  }

  async getProjects() {
    try {
      const project = await gcpService.getProject();
      return [project];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getResources(params) {
    try {
      const [instances, storage, sql] = await Promise.all([
        gcpService.getInstances().catch(() => ({ items: [] })),
        gcpService.getStorage().catch(() => []),
        gcpService.getSQL().catch(() => ({ items: [] }))
      ]);

      // Return a flat array of all resources
      const allResources = [];
      
      // Add compute instances
      if (instances.items) {
        instances.items.forEach(instance => {
          allResources.push({
            id: instance.id || instance.name,
            name: instance.name,
            type: 'compute',
            status: instance.status,
            zone: instance.zone,
            machineType: instance.machineType
          });
        });
      }
      
      // Add storage buckets
      if (storage && Array.isArray(storage)) {
        storage.forEach(bucket => {
          allResources.push({
            id: bucket.id || bucket.name,
            name: bucket.name,
            type: 'storage',
            location: bucket.location,
            storageClass: bucket.storageClass
          });
        });
      }
      
      // Add SQL instances
      if (sql.items) {
        sql.items.forEach(sqlInstance => {
          allResources.push({
            id: sqlInstance.id || sqlInstance.name,
            name: sqlInstance.name,
            type: 'database',
            databaseVersion: sqlInstance.databaseVersion,
            region: sqlInstance.region
          });
        });
      }

      return allResources;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  }

  async getRecommendations(params) {
    try {
      const recommendations = await gcpService.getRecommendations();
      return recommendations || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  async getAzureData(dataType, params) {
    // Placeholder for Azure - will be implemented later
    return this.getMockData('azure', dataType, params);
  }

  getMockData(provider, dataType, params) {
    const mockData = {
      gcp: {
        costs: {
          totalCost: 58000,
          currency: 'USD',
          services: [
            { name: 'Compute Engine', cost: 35000 },
            { name: 'Cloud Storage', cost: 10000 },
            { name: 'Cloud SQL', cost: 7000 },
            { name: 'Cloud Functions', cost: 6000 }
          ]
        },
        projects: [
          { projectId: 'prod-project', name: 'Production Project' },
          { projectId: 'dev-project', name: 'Development Project' }
        ],
        resources: [],
        recommendations: [
          {
            name: 'resize-instances',
            category: 'cost_optimization',
            priority: 'HIGH',
            costImpact: { amount: 3200 }
          }
        ]
      },
      azure: {
        costs: {
          totalCost: 13500,
          currency: 'USD',
          services: [
            { name: 'Virtual Machines', cost: 7500 },
            { name: 'Storage Accounts', cost: 2500 },
            { name: 'SQL Database', cost: 2000 },
            { name: 'App Service', cost: 1500 }
          ]
        },
        projects: [
          { id: 'prod-rg', name: 'Production Resource Group' },
          { id: 'dev-rg', name: 'Development Resource Group' }
        ],
        resources: [],
        recommendations: [
          {
            name: 'reserved-instances',
            category: 'cost_optimization',
            priority: 'HIGH',
            costImpact: { amount: 2100 }
          }
        ]
      }
    };

    return mockData[provider]?.[dataType] || {};
  }
}

export default new CloudDataService();