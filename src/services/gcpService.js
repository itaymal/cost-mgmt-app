// GCP Cost Management API Service
// This service handles integration with Google Cloud Platform APIs through the proxy server

class GCPService {
  constructor() {
    this.proxyUrl = process.env.REACT_APP_PROXY_URL || 'http://localhost:3001';
    this.projectId = process.env.REACT_APP_GCP_PROJECT_ID;
  }

  // Check if we have proper configuration
  hasValidAuth() {
    const hasProjectId = !!this.projectId;
    const hasProxyUrl = !!this.proxyUrl;
    
    console.log(`🔍 GCP Auth Debug:`);
    console.log(`   - Project ID: ${hasProjectId ? 'Set' : 'Not Set'}`);
    console.log(`   - Proxy URL: ${hasProxyUrl ? 'Set' : 'Not Set'}`);
    
    return hasProjectId && hasProxyUrl;
  }

  // Get project information
  async getProject() {
    try {
      if (!this.hasValidAuth()) {
        throw new Error('GCP authentication not configured');
      }

      const url = `${this.proxyUrl}/api/gcp/projects/${this.projectId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  // Get billing accounts
  async getBillingAccounts() {
    try {
      if (!this.hasValidAuth()) {
        throw new Error('GCP authentication not configured');
      }

      const url = `${this.proxyUrl}/api/gcp/billingAccounts`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch billing accounts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.billingAccounts || [];
    } catch (error) {
      console.error('Error fetching billing accounts:', error);
      throw error;
    }
  }

  // Get cost data for a specific time period
  async getCostData(startDate, endDate, billingAccountId = null) {
    try {
      if (!this.hasValidAuth()) {
        throw new Error('GCP authentication not configured');
      }

      // If no billing account specified, get the first one
      if (!billingAccountId) {
        const billingAccounts = await this.getBillingAccounts();
        if (billingAccounts.length === 0) {
          throw new Error('No billing accounts found');
        }
        billingAccountId = billingAccounts[0].name.split('/').pop();
      }

      const url = `${this.proxyUrl}/api/gcp/billingAccounts/${billingAccountId}/cost?startDate=${startDate}&endDate=${endDate}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch cost data: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cost data:', error);
      throw error;
    }
  }

  // Get compute instances
  async getComputeInstances() {
    try {
      if (!this.hasValidAuth()) {
        throw new Error('GCP authentication not configured');
      }

      const url = `${this.proxyUrl}/api/gcp/projects/${this.projectId}/instances`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch compute instances: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching compute instances:', error);
      throw error;
    }
  }

  // Get SQL instances
  async getSQLInstances() {
    try {
      if (!this.hasValidAuth()) {
        throw new Error('GCP authentication not configured');
      }

      const url = `${this.proxyUrl}/api/gcp/projects/${this.projectId}/sql/instances`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch SQL instances: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching SQL instances:', error);
      throw error;
    }
  }

  // Get storage buckets
  async getStorageBuckets() {
    try {
      if (!this.hasValidAuth()) {
        throw new Error('GCP authentication not configured');
      }

      const url = `${this.proxyUrl}/api/gcp/projects/${this.projectId}/storage/buckets`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch storage buckets: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching storage buckets:', error);
      throw error;
    }
  }

  // Get cost recommendations
  async getCostRecommendations() {
    try {
      if (!this.hasValidAuth()) {
        throw new Error('GCP authentication not configured');
      }

      const url = `${this.proxyUrl}/api/gcp/projects/${this.projectId}/recommendations`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch cost recommendations: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cost recommendations:', error);
      throw error;
    }
  }

  // Get all resources for a project
  async getAllResources() {
    try {
      const [computeInstances, sqlInstances, storageBuckets] = await Promise.all([
        this.getComputeInstances().catch(err => ({ error: err.message, items: [] })),
        this.getSQLInstances().catch(err => ({ error: err.message, items: [] })),
        this.getStorageBuckets().catch(err => ({ error: err.message, items: [] }))
      ]);

      return {
        computeInstances,
        sqlInstances,
        storageBuckets
      };
    } catch (error) {
      console.error('Error fetching all resources:', error);
      throw error;
    }
  }
}

export default new GCPService();