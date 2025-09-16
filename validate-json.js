#!/usr/bin/env node

/**
 * JSON Validator for GCP Service Account Key
 */

const fs = require('fs');
const path = require('path');

function validateAndFixJSON() {
  console.log('🔍 GCP Service Account JSON Validator\n');
  
  // Read the .env file
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found. Run: node create-env.js');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  let serviceAccountLine = null;
  let serviceAccountIndex = -1;
  
  // Find the service account line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('REACT_APP_GCP_SERVICE_ACCOUNT_KEY=')) {
      serviceAccountLine = lines[i];
      serviceAccountIndex = i;
      break;
    }
  }
  
  if (!serviceAccountLine) {
    console.log('❌ REACT_APP_GCP_SERVICE_ACCOUNT_KEY not found in .env file');
    console.log('\n📝 To add your service account key:');
    console.log('1. Download the JSON key from GCP Console');
    console.log('2. Copy the entire content');
    console.log('3. Add this line to your .env file:');
    console.log('   REACT_APP_GCP_SERVICE_ACCOUNT_KEY=<paste-json-here>');
    return;
  }
  
  // Extract the JSON part
  const jsonPart = serviceAccountLine.substring('REACT_APP_GCP_SERVICE_ACCOUNT_KEY='.length);
  
  if (!jsonPart || jsonPart.trim() === '') {
    console.log('❌ Service account key is empty');
    return;
  }
  
  console.log('🔍 Found service account key, validating...\n');
  
  try {
    // Try to parse the JSON
    const parsed = JSON.parse(jsonPart);
    
    console.log('✅ JSON is valid!');
    console.log(`📋 Service Account Details:`);
    console.log(`   - Type: ${parsed.type}`);
    console.log(`   - Project ID: ${parsed.project_id}`);
    console.log(`   - Client Email: ${parsed.client_email}`);
    console.log(`   - Private Key: ${parsed.private_key ? 'Present' : 'Missing'}`);
    
    if (parsed.type !== 'service_account') {
      console.log('⚠️  Warning: This doesn\'t look like a service account key');
    }
    
  } catch (error) {
    console.log('❌ JSON parsing error:', error.message);
    console.log('\n🔧 Common fixes:');
    console.log('1. Make sure the entire JSON is on one line');
    console.log('2. Escape newlines in private_key as \\n');
    console.log('3. Remove any extra spaces or characters');
    console.log('4. Make sure all quotes are properly escaped');
    
    console.log('\n📝 Example of correct format:');
    console.log('REACT_APP_GCP_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",...}');
    
    console.log('\n🛠️  Try this:');
    console.log('1. Copy your JSON key from GCP Console');
    console.log('2. Use an online JSON validator to check it');
    console.log('3. Make sure it\'s all on one line in the .env file');
    console.log('4. Escape the newlines in the private_key field');
  }
}

// Run the validator
validateAndFixJSON();
