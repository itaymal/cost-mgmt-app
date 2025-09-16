// GCP Cost Management API Service
// This service handles integration with Google Cloud Platform APIs for cost data

class GCPService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_GCP_API_BASE_URL || 'https://cloudbilling.googleapis.com/v1';
    this.projectId = process.env.REACT_APP_GCP_PROJECT_ID;
    this.apiKey = process.env.REACT_APP_GCP_API_KEY;
    this.serviceAccountKey = this.parseServiceAccountKey();
  }

  // Parse service account key from environment
  parseServiceAccountKey() {
    const keyJson = process.env.REACT_APP_GCP_SERVICE_ACCOUNT_KEY;
    if (keyJson) {
      try {
        return JSON.parse(keyJson);
      } catch (error) {
        console.error('Error parsing service account key:', error);
        return null;
      }
    }
    return null;
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    // For browser-based access, we need to use API key in query params
    // Service account keys don't work directly in browsers due to CORS
    if (this.apiKey) {
      // Don't add Authorization header for browser requests
      // We'll add the API key as a query parameter instead
    }

    return headers;
  }

  // Get API key as query parameter
  getApiKeyParam() {
    return this.apiKey ? `key=${this.apiKey}` : '';
  }

  // Check if we have proper authentication
  hasValidAuth() {
    const hasApiKey = !!this.apiKey;
    const hasProjectId = !!this.projectId;
    
    console.log(`🔍 GCP Auth Debug:`);
    console.log(`   - API Key: ${hasApiKey}`);
    console.log(`   - Project ID: ${hasProjectId}`);
    console.log(`   - Note: Service account keys don't work in browsers due to CORS`);
    
    // For browser-based access, we only need API key + project ID
    return hasApiKey && hasProjectId;
  }

  // Fetch billing account information
  async getBillingAccounts() {
    try {
      const apiKeyParam = this.getApiKeyParam();
      const url = `${this.baseUrl}/billingAccounts${apiKeyParam ? `?${apiKeyParam}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch billing accounts: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching billing accounts:', error);
      throw error;
    }
  }

  // Fetch cost data for a specific time range
  async getCostData(startDate, endDate, projectId = null) {
    try {
      const params = new URLSearchParams({
        'filter': `start_time >= "${startDate}" AND end_time <= "${endDate}"`,
        'groupBy': 'service',
        'pageSize': '1000'
      });

      if (projectId) {
        params.append('filter', `project.id="${projectId}"`);
      }

      const response = await fetch(`${this.baseUrl}/billingAccounts/{billingAccountId}/costs?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cost data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cost data:', error);
      throw error;
    }
  }

  // Fetch project information
  async getProjects() {
    try {
      const response = await fetch(`https://cloudresourcemanager.googleapis.com/v1/projects`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Fetch Compute Engine instances
  async getComputeInstances(projectId, zone = null) {
    try {
      let url = `https://compute.googleapis.com/v1/projects/${projectId}/aggregated/instances`;
      
      if (zone) {
        url = `https://compute.googleapis.com/v1/projects/${projectId}/zones/${zone}/instances`;
      }

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch compute instances: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching compute instances:', error);
      throw error;
    }
  }

  // Fetch Cloud Storage buckets
  async getStorageBuckets(projectId) {
    try {
      const response = await fetch(`https://storage.googleapis.com/storage/v1/b?project=${projectId}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch storage buckets: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching storage buckets:', error);
      throw error;
    }
  }

  // Fetch Cloud SQL instances
  async getSQLInstances(projectId) {
    try {
      const response = await fetch(`https://sqladmin.googleapis.com/v1/projects/${projectId}/instances`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch SQL instances: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching SQL instances:', error);
      throw error;
    }
  }

  // Get resource utilization data
  async getResourceUtilization(projectId, resourceType, resourceId) {
    try {
      // This would typically use the Monitoring API
      const response = await fetch(`https://monitoring.googleapis.com/v3/projects/${projectId}/timeSeries`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch resource utilization: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching resource utilization:', error);
      throw error;
    }
  }

  // Get cost recommendations
  async getCostRecommendations(projectId) {
    try {
      const response = await fetch(`https://recommender.googleapis.com/v1/projects/${projectId}/locations/global/recommenders/google.compute.instance.MachineTypeRecommender/recommendations`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cost recommendations: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cost recommendations:', error);
      throw error;
    }
  }

  // Transform GCP API data to our dashboard format
  transformCostData(gcpData) {
    return {
      totalCost: gcpData.cost || 0,
      services: gcpData.services || [],
      projects: gcpData.projects || [],
      timeRange: gcpData.timeRange || {},
      currency: gcpData.currency || 'USD'
    };
  }

  // Transform compute instances to our resource format
  transformComputeInstances(instances) {
    return instances.items?.map(instance => ({
      id: instance.id,
      name: instance.name,
      type: 'compute',
      description: `${instance.machineType} instance`,
      region: instance.zone,
      status: instance.status,
      cost: this.calculateInstanceCost(instance),
      costChange: 0, // Would need historical data
      utilization: this.getUtilizationFromMetadata(instance),
      efficiencyScore: this.calculateEfficiencyScore(instance),
      tags: instance.tags?.items || [],
      recommendations: this.getRecommendationsForInstance(instance)
    })) || [];
  }

  // Calculate estimated cost for an instance
  calculateInstanceCost(instance) {
    // This is a simplified calculation
    // In reality, you'd need to fetch pricing data from the Cloud Billing API
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
    // This would typically come from monitoring data
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

  // Mock data for development/testing
  getMockData() {
    return {
      billingAccounts: [
        {
          name: 'billingAccounts/01ABCD-2EFGH3-4IJKL5',
          displayName: 'My Billing Account',
          open: true
        }
      ],
      projects: [
        {
          projectId: 'my-gcp-project',
          name: 'My GCP Project',
          projectNumber: '123456789012'
        }
      ],
      costData: {
        totalCost: 58000,
        services: [
          { name: 'Compute Engine', cost: 35000 },
          { name: 'Cloud Storage', cost: 10000 },
          { name: 'Cloud SQL', cost: 7000 },
          { name: 'Cloud Functions', cost: 6000 }
        ]
      }
    };
  }
}

export default new GCPService();
