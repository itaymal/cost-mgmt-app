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

    const targetUrl = `https://compute.googleapis.com/v1/projects/${projectId}/zones`;
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
