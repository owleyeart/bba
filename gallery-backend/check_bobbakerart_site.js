// Script to check BobBakerArt SharePoint site
const { ConfidentialClientApplication } = require('@azure/msal-node');
const axios = require('axios');
require('dotenv').config();

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`
  }
};

const msalClient = new ConfidentialClientApplication(msalConfig);

// BobBakerArt site from previous search
const SITE_ID = 'owleyeart.sharepoint.com,3f29802b-adad-446f-b18a-8dc0b6e6f2c2,5d5e466b-995e-4d3c-9cba-721ee75a0724';

async function getAccessToken() {
  const response = await msalClient.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });
  return response.accessToken;
}

async function makeGraphRequest(endpoint, token) {
  try {
    const response = await axios.get(`https://graph.microsoft.com/v1.0${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error on ${endpoint}:`, error.response?.data?.error?.message || error.message);
    throw error;
  }
}

async function exploreFolder(token, siteId, driveId, folderId, depth = 0) {
  const indent = '  '.repeat(depth);
  const endpoint = folderId === 'root'
    ? `/sites/${siteId}/drives/${driveId}/root/children`
    : `/sites/${siteId}/drives/${driveId}/items/${folderId}/children`;
  
  const response = await makeGraphRequest(endpoint, token);
  
  const folders = response.value.filter(item => item.folder);
  const files = response.value.filter(item => item.file);
  
  for (const folder of folders) {
    const childCount = folder.folder.childCount || 0;
    console.log(`${indent}📁 ${folder.name} (${childCount} items)`);
    console.log(`${indent}   ID: ${folder.id}`);
    
    // Check if this is our gallery folder
    const name = folder.name.toLowerCase();
    if (name.includes('baker') && name.includes('gallery')) {
      console.log(`${indent}   ⭐⭐⭐ THIS IS THE GALLERY FOLDER! ⭐⭐⭐`);
      
      // Show galleries inside
      if (childCount > 0 && depth < 2) {
        console.log(`${indent}   Galleries inside:`);
        await exploreFolder(token, siteId, driveId, folder.id, depth + 1);
      }
    } else if (name.match(/^\d{8}/)) {
      console.log(`${indent}   ⭐ DATE-BASED GALLERY`);
    }
  }
  
  if (files.length > 0 && depth === 0) {
    console.log(`${indent}📄 ${files.length} file(s) in root`);
  }
}

async function main() {
  console.log('🔍 Checking BobBakerArt SharePoint Site\n');
  console.log('Site: BobBakerArt');
  console.log('URL: https://owleyeart.sharepoint.com/sites/BobBakerArt\n');
  
  try {
    const token = await getAccessToken();
    
    // Get all drives
    console.log('📝 Step 1: Finding drives...\n');
    const drives = await makeGraphRequest(`/sites/${SITE_ID}/drives`, token);
    
    console.log('💾 Available Drives:');
    drives.value.forEach((drive, index) => {
      console.log(`${index + 1}. ${drive.name} (${drive.driveType})`);
      console.log(`   ID: ${drive.id}\n`);
    });
    
    // Check each drive for the gallery
    for (const drive of drives.value) {
      console.log(`\n📂 Exploring: ${drive.name}`);
      console.log('═'.repeat(60));
      
      try {
        await exploreFolder(token, SITE_ID, drive.id, 'root', 0);
      } catch (error) {
        console.log(`   ⚠️ Could not access drive: ${error.message}`);
      }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('🎯 NEXT STEPS:');
    console.log('═'.repeat(60));
    console.log('Look for folders marked with ⭐⭐⭐');
    console.log('That will be your SHAREPOINT_GALLERY_FOLDER_ID');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

main();
