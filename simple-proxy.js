#!/usr/bin/env node

/**
 * SIMPLE GCP API Proxy Server
 * No complex authentication - just basic API key forwarding
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
    const apiKey = process.env.REACT_APP_GCP_API_KEY;
    
    if (!apiKey || apiKey === 'your-actual-api-key') {
      return res.status(400).json({ 
        error: 'GCP API key not configured properly',
        hint: 'Make sure REACT_APP_GCP_API_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}?key=${apiKey}`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const response = await fetch(targetUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ GCP API Error (${response.status}):`, data);
      return res.status(response.status).json(data);
    }

    console.log(`✅ Success: ${response.status}`);
    res.json(data);

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
    const apiKey = process.env.REACT_APP_GCP_API_KEY;
    
    if (!apiKey || apiKey === 'your-actual-api-key') {
      return res.status(400).json({ 
        error: 'GCP API key not configured properly',
        hint: 'Make sure REACT_APP_GCP_API_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://cloudbilling.googleapis.com/v1/billingAccounts?key=${apiKey}`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const response = await fetch(targetUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ GCP API Error (${response.status}):`, data);
      return res.status(response.status).json(data);
    }

    console.log(`✅ Success: ${response.status}`);
    res.json(data);

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
    const apiKey = process.env.REACT_APP_GCP_API_KEY;
    
    if (!apiKey || apiKey === 'your-actual-api-key') {
      return res.status(400).json({ 
        error: 'GCP API key not configured properly',
        hint: 'Make sure REACT_APP_GCP_API_KEY is set in your .env file'
      });
    }

    const targetUrl = `https://compute.googleapis.com/v1/projects/${projectId}/zones?key=${apiKey}`;
    console.log(`🌐 Proxying: ${req.url} → ${targetUrl}`);

    const response = await fetch(targetUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ GCP API Error (${response.status}):`, data);
      return res.status(response.status).json(data);
    }

    console.log(`✅ Success: ${response.status}`);
    res.json(data);

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
