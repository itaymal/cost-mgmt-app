// Simple GCP Service using the backend server
class GCPService {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api/gcp';
  }

  async makeRequest(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }

  async getProject() {
    return this.makeRequest('/project');
  }

  async getBillingAccounts() {
    return this.makeRequest('/billing-accounts');
  }

  async getInstances() {
    return this.makeRequest('/instances');
  }

  async getStorage() {
    return this.makeRequest('/storage');
  }

  async getSQL() {
    return this.makeRequest('/sql');
  }

  async getRecommendations() {
    return this.makeRequest('/recommendations');
  }
}

export default new GCPService();