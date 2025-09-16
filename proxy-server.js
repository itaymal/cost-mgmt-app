#!/usr/bin/env node

/**
 * Simple GCP API Proxy Server
 * This server acts as a proxy to avoid CORS issues when calling GCP APIs from the browser
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GCP API endpoints
const GCP_APIS = {
  billing: 'https://cloudbilling.googleapis.com/v1',
  resourceManager: 'https://cloudresourcemanager.googleapis.com/v1',
  compute: 'https://compute.googleapis.com/v1',
  storage: 'https://storage.googleapis.com/storage/v1',
  sql: 'https://sqladmin.googleapis.com/v1',
  recommender: 'https://recommender.googleapis.com/v1'
};

// Generic proxy endpoint
app.get('/api/gcp/*', async (req, res) => {
  try {
    const path = req.params[0]; // Everything after /api/gcp/
    const apiKey = process.env.REACT_APP_GCP_API_KEY;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'GCP API key not configured' });
    }

    // Determine which GCP API to use based on the path
    let baseUrl;
    if (path.startsWith('billing')) {
      baseUrl = GCP_APIS.billing;
    } else if (path.startsWith('projects') && !path.includes('compute')) {
      baseUrl = GCP_APIS.resourceManager;
    } else if (path.includes('compute') || path.includes('zones') || path.includes('instances')) {
      baseUrl = GCP_APIS.compute;
    } else if (path.includes('storage') || path.includes('buckets')) {
      baseUrl = GCP_APIS.storage;
    } else if (path.includes('sql') || path.includes('instances')) {
      baseUrl = GCP_APIS.sql;
    } else if (path.includes('recommender')) {
      baseUrl = GCP_APIS.recommender;
    } else {
      return res.status(400).json({ error: 'Unknown GCP API endpoint' });
    }

    const targetUrl = `${baseUrl}/${path}?key=${apiKey}`;
    
    console.log(`🌐 Proxying request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GCP API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);

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
