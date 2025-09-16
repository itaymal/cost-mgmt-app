// GCP Proxy Service - Uses local proxy server to avoid CORS issues
class GCPProxyService {
  constructor() {
    this.projectId = process.env.REACT_APP_GCP_PROJECT_ID;
    this.proxyUrl = process.env.REACT_APP_PROXY_URL || 'http://localhost:3001';
  }

  // Make request through proxy server
  async makeRequest(endpoint) {
    try {
      const url = `${this.proxyUrl}/api/gcp/${endpoint}`;
      console.log('🌐 Making request through proxy:', url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Proxy request error:', error);
      throw error;
    }
  }

  // Test project access
  async testProjectAccess() {
    try {
      const data = await this.makeRequest(`projects/${this.projectId}`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Test billing access
  async testBillingAccess() {
    try {
      const data = await this.makeRequest('billingAccounts');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Test compute access
  async testComputeAccess() {
    try {
      const data = await this.makeRequest(`projects/${this.projectId}/zones`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get cost data
  async getCostData(startDate, endDate, projectId = null) {
    try {
      // This would need to be implemented based on your specific cost API needs
      const data = await this.makeRequest(`billingAccounts`);
      return this.transformCostData(data);
    } catch (error) {
      console.error('Error fetching cost data:', error);
      throw error;
    }
  }

  // Get projects
  async getProjects() {
    try {
      const data = await this.makeRequest('projects');
      return this.transformProjectsData(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get compute instances
  async getComputeInstances(projectId, zone = null) {
    try {
      const endpoint = zone 
        ? `projects/${projectId}/zones/${zone}/instances`
        : `projects/${projectId}/aggregated/instances`;
      
      const data = await this.makeRequest(endpoint);
      return this.transformComputeInstances(data);
    } catch (error) {
      console.error('Error fetching compute instances:', error);
      throw error;
    }
  }

  // Transform cost data
  transformCostData(data) {
    return {
      totalCost: 0, // Would need to implement based on actual API response
      services: [],
      projects: [],
      timeRange: {},
      currency: 'USD'
    };
  }

  // Transform projects data
  transformProjectsData(data) {
    return data.projects?.map(project => ({
      id: project.projectId,
      name: project.name,
      provider: 'gcp',
      status: project.lifecycleState || 'ACTIVE',
      cost: 0
    })) || [];
  }

  // Transform compute instances
  transformComputeInstances(data) {
    const instances = [];
    
    if (data.items) {
      Object.values(data.items).forEach(zoneData => {
        if (zoneData.instances) {
          instances.push(...zoneData.instances.map(instance => ({
            id: instance.id,
            name: instance.name,
            type: 'compute',
            description: `${instance.machineType} instance`,
            region: instance.zone,
            status: instance.status,
            cost: this.calculateInstanceCost(instance),
            costChange: 0,
            utilization: this.getUtilizationFromMetadata(instance),
            efficiencyScore: this.calculateEfficiencyScore(instance),
            tags: instance.tags?.items || [],
            recommendations: this.getRecommendationsForInstance(instance)
          })));
        }
      });
    }

    return instances;
  }

  // Calculate estimated cost for an instance
  calculateInstanceCost(instance) {
    const machineType = instance.machineType;
    const pricing = {
      'n1-standard-1': 0.0475,
      'n1-standard-2': 0.0950,
      'n1-standard-4': 0.1900,
      'n1-standard-8': 0.3800,
      'n1-standard-16': 0.7600,
      'n1-highmem-2': 0.1184,
      'n1-highmem-4': 0.2368,
      'n1-highmem-8': 0.4736,
      'n1-highmem-16': 0.9472
    };

    const hourlyRate = pricing[machineType] || 0.1;
    return hourlyRate * 24 * 30; // Monthly estimate
  }

  // Get utilization from instance metadata
  getUtilizationFromMetadata(instance) {
    return Math.random() * 100; // Placeholder
  }

  // Calculate efficiency score
  calculateEfficiencyScore(instance) {
    const utilization = this.getUtilizationFromMetadata(instance);
    if (utilization < 30) return 'Low';
    if (utilization < 70) return 'Medium';
    return 'High';
  }

  // Get recommendations for an instance
  getRecommendationsForInstance(instance) {
    const recommendations = [];
    const utilization = this.getUtilizationFromMetadata(instance);

    if (utilization < 30) {
      recommendations.push({
        description: 'Consider downsizing to a smaller machine type',
        potentialSavings: this.calculateInstanceCost(instance) * 0.3
      });
    }

    return recommendations;
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting GCP API Tests with Local Proxy...');
    console.log('Project ID:', this.projectId);
    console.log('Proxy URL:', this.proxyUrl);
    console.log('---');

    const results = {
      project: await this.testProjectAccess(),
      billing: await this.testBillingAccess(),
      compute: await this.testComputeAccess(),
    };

    console.log('---');
    console.log('📊 Test Results:');
    console.log('Project Access:', results.project.success ? '✅' : '❌');
    console.log('Billing Access:', results.billing.success ? '✅' : '❌');
    console.log('Compute Access:', results.compute.success ? '✅' : '❌');

    return results;
  }
}

export default new GCPProxyService();
