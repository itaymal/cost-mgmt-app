// GCP Proxy Service - Handles CORS issues by using a proxy
class GCPProxyService {
  constructor() {
    this.projectId = process.env.REACT_APP_GCP_PROJECT_ID;
    this.apiKey = process.env.REACT_APP_GCP_API_KEY;
  }

  // Use a CORS proxy to make GCP API calls
  async makeRequest(endpoint, params = {}) {
    try {
      // Use a public CORS proxy (for development only)
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = `${endpoint}?key=${this.apiKey}&${new URLSearchParams(params).toString()}`;
      const fullUrl = proxyUrl + targetUrl;

      console.log('🌐 Making request through CORS proxy:', endpoint);

      const response = await fetch(fullUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
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
      const endpoint = `https://cloudresourcemanager.googleapis.com/v1/projects/${this.projectId}`;
      const data = await this.makeRequest(endpoint);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Test billing access
  async testBillingAccess() {
    try {
      const endpoint = 'https://cloudbilling.googleapis.com/v1/billingAccounts';
      const data = await this.makeRequest(endpoint);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Test compute access
  async testComputeAccess() {
    try {
      const endpoint = `https://compute.googleapis.com/v1/projects/${this.projectId}/zones`;
      const data = await this.makeRequest(endpoint);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting GCP API Tests with CORS Proxy...');
    console.log('Project ID:', this.projectId);
    console.log('API Key:', this.apiKey ? 'Set' : 'Not Set');
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
