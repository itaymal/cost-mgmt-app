#!/usr/bin/env node

/**
 * SIMPLE GCP API Proxy Server
 * No complex authentication - just basic API key forwarding
 */

const express = require('express');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Auth
let auth;
try {
  const serviceAccountKey = process.env.REACT_APP_GCP_SERVICE_ACCOUNT_KEY;
  
  console.log('🔍 Debug - Service Account Key Check:');
  console.log(`   - Key exists: ${!!serviceAccountKey}`);
  console.log(`   - Key length: ${serviceAccountKey ? serviceAccountKey.length : 0}`);
  console.log(`   - Key starts with: ${serviceAccountKey ? serviceAccountKey.substring(0, 50) + '...' : 'N/A'}`);
  
  if (serviceAccountKey) {
    try {
      const credentials = JSON.parse(serviceAccountKey);
      console.log('✅ Service account JSON parsed successfully');
      console.log(`   - Project ID: ${credentials.project_id}`);
      console.log(`   - Client Email: ${credentials.client_email}`);
      
      auth = new GoogleAuth({
        credentials: credentials,
        scopes: [
          'https://www.googleapis.com/auth/cloud-billing.readonly',
          'https://www.googleapis.com/auth/cloud-platform.read-only',
          'https://www.googleapis.com/auth/compute.readonly',
          'https://www.googleapis.com/auth/sqlservice.readonly',
          'https://www.googleapis.com/auth/devstorage.read_only',
          'https://www.googleapis.com/auth/recommender.readonly'
        ]
      });
      console.log('✅ Service account authentication initialized');
    } catch (parseError) {
      console.error('❌ Failed to parse service account JSON:', parseError.message);
      console.log('   - Raw key (first 100 chars):', serviceAccountKey.substring(0, 100));
    }
  } else {
    console.log('⚠️ No service account key found, using API key fallback');
  }
} catch (error) {
  console.error('❌ Failed to initialize service account auth:', error.message);
}

// Simple health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Simple GCP Proxy Server is running'
  });
});

// Specific endpoints to avoid wildcard issues
app.get('/api/gcp/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

app.get('/api/gcp/billingAccounts', async (req, res) => {
  try {
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    const targetUrl = 'https://cloudbilling.googleapis.com/v1/billingAccounts';
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

app.get('/api/gcp/projects/:projectId/zones', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    // Try the correct Compute API endpoint
    const targetUrl = `https://compute.googleapis.com/compute/v1/projects/${projectId}/zones`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    
    // If zones endpoint fails, try a simpler compute endpoint
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      try {
        console.log('🔄 Trying alternative compute endpoint...');
        const altUrl = `https://compute.googleapis.com/compute/v1/projects/${req.params.projectId}`;
        const client = await auth.getClient();
        const response = await client.request({
          url: altUrl,
          method: 'GET'
        });
        console.log(`✅ Alternative endpoint success: ${response.status}`);
        res.json(response.data);
        return;
      } catch (altError) {
        console.error('❌ Alternative endpoint also failed:', altError.message);
      }
    }
    
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

// Alternative compute endpoint - get instances instead of zones
app.get('/api/gcp/projects/:projectId/instances', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    // Try to get compute instances (aggregated across all zones)
    const targetUrl = `https://compute.googleapis.com/compute/v1/projects/${projectId}/aggregated/instances`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

// SQL Admin API endpoint
app.get('/api/gcp/projects/:projectId/sql/instances', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://sqladmin.googleapis.com/v1/projects/${projectId}/instances`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

// Storage API endpoint
app.get('/api/gcp/projects/:projectId/storage/buckets', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://storage.googleapis.com/storage/v1/b?project=${projectId}`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

// Recommender API endpoint
app.get('/api/gcp/projects/:projectId/recommendations', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://recommender.googleapis.com/v1/projects/${projectId}/locations/global/recommenders/google.compute.instance.MachineTypeRecommender/recommendations`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

// Billing cost data endpoint
app.get('/api/gcp/billingAccounts/:billingAccountId/cost', async (req, res) => {
  try {
    const { billingAccountId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!auth) {
      return res.status(400).json({ 
        error: 'Service account authentication not configured',
        hint: 'Make sure REACT_APP_GCP_SERVICE_ACCOUNT_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://cloudbilling.googleapis.com/v1/billingAccounts/${billingAccountId}/billingInfo`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    console.log(`✅ Success: ${response.status}`);
    res.json(response.data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple GCP Proxy Server running on port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET /health`);
  console.log(`   - GET /api/gcp/projects/{projectId}`);
  console.log(`   - GET /api/gcp/billingAccounts`);
  console.log(`   - GET /api/gcp/projects/{projectId}/zones`);
  console.log(`\n🔧 Make sure REACT_APP_GCP_API_KEY is set in your .env file`);
  console.log(`\n💡 This is a SIMPLE proxy - no complex authentication!`);
});

module.exports = app;
