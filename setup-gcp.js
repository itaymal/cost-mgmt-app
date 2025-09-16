#!/usr/bin/env node

/**
 * GCP Setup Helper Script
 * This script helps you configure your GCP credentials for the dashboard
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupGCP() {
  console.log('🚀 GCP Setup Helper for Cloud Cost Dashboard\n');
  
  console.log('This script will help you configure your GCP credentials.\n');
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  console.log('\n📋 GCP Setup Options:\n');
  console.log('1. API Key (Simpler, but less secure)');
  console.log('2. Service Account JSON Key (More secure, recommended)\n');
  
  const option = await question('Choose option (1 or 2): ');
  
  let envContent = `# GCP Configuration
REACT_APP_GCP_PROJECT_ID=
REACT_APP_ENABLE_MOCK_DATA=false

# Dashboard Configuration
REACT_APP_DEFAULT_TIME_RANGE=6m
REACT_APP_REFRESH_INTERVAL=300000
REACT_APP_MAX_RESOURCES_PER_PAGE=100

`;

  // Get project ID
  const projectId = await question('\n📁 Enter your GCP Project ID: ');
  envContent = envContent.replace('REACT_APP_GCP_PROJECT_ID=', `REACT_APP_GCP_PROJECT_ID=${projectId}`);
  
  if (option === '1') {
    // API Key setup
    console.log('\n🔑 API Key Setup:');
    console.log('1. Go to GCP Console > APIs & Services > Credentials');
    console.log('2. Create API Key');
    console.log('3. Restrict it to these APIs:');
    console.log('   - Cloud Billing API');
    console.log('   - Cloud Resource Manager API');
    console.log('   - Compute Engine API');
    console.log('   - Cloud Storage API');
    console.log('   - Cloud SQL Admin API');
    console.log('   - Recommender API\n');
    
    const apiKey = await question('Enter your API Key: ');
    envContent += `\n# API Key Authentication
REACT_APP_GCP_API_KEY=${apiKey}
`;
    
  } else if (option === '2') {
    // Service Account setup
    console.log('\n🔐 Service Account Setup:');
    console.log('1. Go to GCP Console > IAM & Admin > Service Accounts');
    console.log('2. Create new service account with these roles:');
    console.log('   - Billing Account Viewer');
    console.log('   - Project Viewer');
    console.log('   - Compute Viewer');
    console.log('   - Storage Viewer');
    console.log('   - Cloud SQL Viewer');
    console.log('3. Create and download JSON key\n');
    
    const keyPath = await question('Enter path to your JSON key file (or paste JSON content): ');
    
    let keyContent;
    if (keyPath.endsWith('.json') && fs.existsSync(keyPath)) {
      // Read from file
      keyContent = fs.readFileSync(keyPath, 'utf8');
    } else {
      // Assume it's JSON content
      keyContent = keyPath;
    }
    
    // Validate JSON
    try {
      JSON.parse(keyContent);
      envContent += `\n# Service Account Authentication
REACT_APP_GCP_SERVICE_ACCOUNT_KEY=${keyContent.replace(/\n/g, '\\n')}
`;
    } catch (error) {
      console.error('❌ Invalid JSON format. Please check your key file.');
      rl.close();
      return;
    }
  }
  
  // Write .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Configuration saved to .env file!');
  console.log('\n📝 Next steps:');
  console.log('1. Run: npm start');
  console.log('2. Check browser console for connection status');
  console.log('3. If you see "Using mock data", check your credentials');
  console.log('4. If you see "Live data from GCP APIs", you\'re all set!\n');
  
  rl.close();
}

// Run setup
setupGCP().catch(console.error);
