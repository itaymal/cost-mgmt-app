#!/usr/bin/env node

/**
 * Simple GCP API Proxy Server
 * This server acts as a proxy to avoid CORS issues when calling GCP APIs from the browser
 */

const express = require('express');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Auth
let auth;
try {
  const serviceAccountKey = process.env.REACT_APP_GCP_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    const credentials = JSON.parse(serviceAccountKey);
    auth = new GoogleAuth({
      credentials: credentials,
      scopes: [
        'https://www.googleapis.com/auth/cloud-billing.readonly',
        'https://www.googleapis.com/auth/cloud-platform.read-only',
        'https://www.googleapis.com/auth/compute.readonly'
      ]
    });
    console.log('✅ Service account authentication initialized');
  } else {
    console.log('⚠️ No service account key found, using API key fallback');
  }
} catch (error) {
  console.error('❌ Failed to initialize service account auth:', error.message);
}

// GCP API endpoints
const GCP_APIS = {
  billing: 'https://cloudbilling.googleapis.com/v1',
  resourceManager: 'https://cloudresourcemanager.googleapis.com/v1',
  compute: 'https://compute.googleapis.com/v1',
  storage: 'https://storage.googleapis.com/storage/v1',
  sql: 'https://sqladmin.googleapis.com/v1',
  recommender: 'https://recommender.googleapis.com/v1'
};

// Specific endpoints to avoid wildcard issues
app.get('/api/gcp/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ error: 'Service account authentication not configured' });
    }

    const targetUrl = `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`;
    console.log(`🌐 Proxying request to: ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    res.json(response.data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gcp/billingAccounts', async (req, res) => {
  try {
    if (!auth) {
      return res.status(400).json({ error: 'Service account authentication not configured' });
    }

    const targetUrl = 'https://cloudbilling.googleapis.com/v1/billingAccounts';
    console.log(`🌐 Proxying request to: ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    res.json(response.data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gcp/projects/:projectId/zones', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!auth) {
      return res.status(400).json({ error: 'Service account authentication not configured' });
    }

    const targetUrl = `https://compute.googleapis.com/v1/projects/${projectId}/zones`;
    console.log(`🌐 Proxying request to: ${targetUrl}`);

    const client = await auth.getClient();
    const response = await client.request({
      url: targetUrl,
      method: 'GET'
    });

    res.json(response.data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GCP Proxy Server running on port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET /api/gcp/projects/{projectId}`);
  console.log(`   - GET /api/gcp/billingAccounts`);
  console.log(`   - GET /api/gcp/projects/{projectId}/zones`);
  console.log(`   - GET /api/gcp/projects/{projectId}/aggregated/instances`);
  console.log(`   - GET /health`);
  console.log(`\n🔧 Make sure to set REACT_APP_GCP_API_KEY in your .env file`);
});

module.exports = app;
