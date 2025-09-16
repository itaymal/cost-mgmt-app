#!/usr/bin/env node

/**
 * Simple script to create .env file with proper formatting
 */

const fs = require('fs');
const path = require('path');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Backing up to .env.backup');
  fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
}

// Create a basic .env file
const envContent = `# GCP Configuration
REACT_APP_GCP_PROJECT_ID=your-gcp-project-id
REACT_APP_ENABLE_MOCK_DATA=false

# Choose ONE of the following authentication methods:

# Option 1: API Key (Simpler)
# REACT_APP_GCP_API_KEY=your-gcp-api-key

# Option 2: Service Account JSON Key (More secure)
# Copy your entire JSON key content here (all on one line)
# REACT_APP_GCP_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# Dashboard Configuration
REACT_APP_DEFAULT_TIME_RANGE=6m
REACT_APP_REFRESH_INTERVAL=300000
REACT_APP_MAX_RESOURCES_PER_PAGE=100
`;

fs.writeFileSync(envPath, envContent);

console.log('✅ Created .env file!');
console.log('\n📝 Next steps:');
console.log('1. Edit the .env file with your actual GCP credentials');
console.log('2. Make sure REACT_APP_ENABLE_MOCK_DATA=false');
console.log('3. Add either REACT_APP_GCP_API_KEY or REACT_APP_GCP_SERVICE_ACCOUNT_KEY');
console.log('4. Restart your development server: npm start');
console.log('\n🔍 Check the browser console for debug messages');
console.log('🐛 Use the debug panel (bug icon) to see environment status');
