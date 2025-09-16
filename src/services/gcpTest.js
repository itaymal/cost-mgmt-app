// Simple GCP API Test Service
class GCPTestService {
  constructor() {
    this.projectId = process.env.REACT_APP_GCP_PROJECT_ID;
    this.apiKey = process.env.REACT_APP_GCP_API_KEY;
    this.serviceAccountKey = this.parseServiceAccountKey();
  }

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

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  // Test basic project access
  async testProjectAccess() {
    try {
      console.log('🧪 Testing project access...');
      const response = await fetch(`https://cloudresourcemanager.googleapis.com/v1/projects/${this.projectId}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Project access successful:', data.name);
        return { success: true, data };
      } else {
        console.log('❌ Project access failed:', response.status, response.statusText);
        return { success: false, error: `${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      console.log('❌ Project access error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Test billing access
  async testBillingAccess() {
    try {
      console.log('🧪 Testing billing access...');
      const response = await fetch('https://cloudbilling.googleapis.com/v1/billingAccounts', {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Billing access successful:', data.billingAccounts?.length || 0, 'accounts');
        return { success: true, data };
      } else {
        console.log('❌ Billing access failed:', response.status, response.statusText);
        return { success: false, error: `${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      console.log('❌ Billing access error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Test compute access
  async testComputeAccess() {
    try {
      console.log('🧪 Testing compute access...');
      const response = await fetch(`https://compute.googleapis.com/v1/projects/${this.projectId}/zones`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Compute access successful:', data.items?.length || 0, 'zones');
        return { success: true, data };
      } else {
        console.log('❌ Compute access failed:', response.status, response.statusText);
        return { success: false, error: `${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      console.log('❌ Compute access error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting GCP API Tests...');
    console.log('Project ID:', this.projectId);
    console.log('API Key:', this.apiKey ? 'Set' : 'Not Set');
    console.log('Service Account:', this.serviceAccountKey ? 'Set' : 'Not Set');
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

export default new GCPTestService();
