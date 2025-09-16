const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Google Cloud clients - using default credentials
const { CloudBillingClient } = require('@google-cloud/billing');
const { ProjectsClient } = require('@google-cloud/resource-manager');
const { InstancesClient } = require('@google-cloud/compute');
const { Storage } = require('@google-cloud/storage');
// const { SqlAdminServiceClient } = require('@google-cloud/sql-admin');
const { RecommenderClient } = require('@google-cloud/recommender');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const projectId = process.env.REACT_APP_GCP_PROJECT_ID;

// Initialize clients with explicit project
const billingClient = new CloudBillingClient({ projectId });
const projectsClient = new ProjectsClient({ projectId });
const computeClient = new InstancesClient({ projectId });
const storageClient = new Storage({ projectId });
// const sqlClient = new SqlAdminServiceClient({ projectId });
const recommenderClient = new RecommenderClient({ projectId });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get project info
app.get('/api/gcp/project', async (req, res) => {
  try {
    const [project] = await projectsClient.getProject({ name: `projects/${projectId}` });
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get billing accounts
app.get('/api/gcp/billing-accounts', async (req, res) => {
  try {
    const [billingAccounts] = await billingClient.listBillingAccounts();
    res.json(billingAccounts);
  } catch (error) {
    console.error('Error fetching billing accounts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get compute instances
app.get('/api/gcp/instances', async (req, res) => {
  try {
    const [instances] = await computeClient.aggregatedList({
      project: projectId,
    });
    res.json(instances);
  } catch (error) {
    console.error('Error fetching instances:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get storage buckets
app.get('/api/gcp/storage', async (req, res) => {
  try {
    const [buckets] = await storageClient.getBuckets({ project: projectId });
    res.json(buckets);
  } catch (error) {
    console.error('Error fetching storage:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get SQL instances (placeholder)
app.get('/api/gcp/sql', async (req, res) => {
  try {
    // Placeholder - SQL client not available
    res.json({ items: [] });
  } catch (error) {
    console.error('Error fetching SQL instances:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recommendations
app.get('/api/gcp/recommendations', async (req, res) => {
  try {
    const [recommendations] = await recommenderClient.listRecommendations({
      parent: `projects/${projectId}/locations/global/recommenders/google.compute.instance.MachineTypeRecommender`,
    });
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 GCP Project: ${projectId || 'Not set'}`);
});
