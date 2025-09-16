#!/usr/bin/env node

/**
 * JSON Fixer for GCP Service Account Key
 */

const fs = require('fs');
const path = require('path');

function fixJSON() {
  console.log('🔧 GCP Service Account JSON Fixer\n');
  
  console.log('📝 Instructions:');
  console.log('1. Copy your service account JSON key from GCP Console');
  console.log('2. Paste it below (press Enter twice when done)');
  console.log('3. I\'ll format it correctly for your .env file\n');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let jsonInput = '';
  let emptyLines = 0;
  
  console.log('Paste your JSON key here:');
  
  rl.on('line', (line) => {
    if (line.trim() === '') {
      emptyLines++;
      if (emptyLines >= 2) {
        rl.close();
        processJSON(jsonInput.trim());
      }
    } else {
      emptyLines = 0;
      jsonInput += line + '\n';
    }
  });
}

function processJSON(jsonInput) {
  try {
    // Try to parse the JSON first
    const parsed = JSON.parse(jsonInput);
    
    // Convert back to string with proper formatting
    const fixedJSON = JSON.stringify(parsed);
    
    console.log('\n✅ JSON is valid!');
    console.log('\n📋 Add this line to your .env file:');
    console.log(`REACT_APP_GCP_SERVICE_ACCOUNT_KEY=${fixedJSON}`);
    
    // Ask if they want to update the .env file
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('\n🤔 Do you want me to update your .env file automatically? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        updateEnvFile(fixedJSON);
      } else {
        console.log('\n📝 Copy the line above to your .env file manually');
      }
      rl.close();
    });
    
  } catch (error) {
    console.log('\n❌ JSON parsing error:', error.message);
    console.log('\n🔧 Let me try to fix common issues...');
    
    let fixedJSON = jsonInput;
    
    // Fix common issues
    fixedJSON = fixedJSON.replace(/\n/g, '\\n'); // Escape newlines
    fixedJSON = fixedJSON.replace(/\r/g, ''); // Remove carriage returns
    fixedJSON = fixedJSON.trim(); // Remove leading/trailing whitespace
    
    try {
      const parsed = JSON.parse(fixedJSON);
      const properlyFormatted = JSON.stringify(parsed);
      
      console.log('\n✅ Fixed! Here\'s the corrected JSON:');
      console.log(`REACT_APP_GCP_SERVICE_ACCOUNT_KEY=${properlyFormatted}`);
      
    } catch (secondError) {
      console.log('\n❌ Still invalid. Please check your JSON manually.');
      console.log('\n🔍 Common issues:');
      console.log('- Missing quotes around property names');
      console.log('- Missing commas between properties');
      console.log('- Unescaped quotes in string values');
      console.log('- Invalid characters');
    }
  }
}

function updateEnvFile(jsonKey) {
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found');
    return;
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if the key already exists
  if (envContent.includes('REACT_APP_GCP_SERVICE_ACCOUNT_KEY=')) {
    // Replace existing line
    envContent = envContent.replace(
      /REACT_APP_GCP_SERVICE_ACCOUNT_KEY=.*/,
      `REACT_APP_GCP_SERVICE_ACCOUNT_KEY=${jsonKey}`
    );
  } else {
    // Add new line
    envContent += `\nREACT_APP_GCP_SERVICE_ACCOUNT_KEY=${jsonKey}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Updated .env file successfully!');
  console.log('\n🚀 Next steps:');
  console.log('1. Restart your development server: npm start');
  console.log('2. Check the browser console for debug messages');
  console.log('3. Look for the Environment Test panel in the dashboard');
}

// Run the fixer
fixJSON();
