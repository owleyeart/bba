// Script to check inside the Gallery folder
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

const SITE_ID = 'owleyeart.sharepoint.com,3f29802b-adad-446f-b18a-8dc0b6e6f2c2,5d5e466b-995e-4d3c-9cba-721ee75a0724';
const DRIVE_ID = 'b!K4ApP62tb0Sxio3AtubywmtGXl1emTxNnLpyHudaByQ6zyqoBYXnQZ21AP_Sgtjo';
const GALLERY_FOLDER_ID = '01A7MP53IBSY55NSNPJVBK4GZ6FFVEXE2Z';

async function getAccessToken() {
  const response = await msalClient.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });
  return response.accessToken;
}

async function makeGraphRequest(endpoint, token) {
  const response = await axios.get(`https://graph.microsoft.com/v1.0${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}

async function main() {
  console.log('🔍 Checking Gallery Folder Contents\n');
  console.log('Folder: Gallery');
  console.log('ID:', GALLERY_FOLDER_ID);
  console.log('');
  
  try {
    const token = await getAccessToken();
    
    // Get contents of Gallery folder
    const endpoint = `/sites/${SITE_ID}/drives/${DRIVE_ID}/items/${GALLERY_FOLDER_ID}/children`;
    const response = await makeGraphRequest(endpoint, token);
    
    console.log('📂 Contents of Gallery folder:');
    console.log('═'.repeat(60));
    
    const folders = response.value.filter(item => item.folder);
    const files = response.value.filter(item => item.file);
    
    if (folders.length > 0) {
      console.log('\n📁 Folders (Galleries):');
      folders.forEach((folder, index) => {
        console.log(`${index + 1}. ${folder.name}`);
        console.log(`   ID: ${folder.id}`);
        console.log(`   Items: ${folder.folder?.childCount || 0}`);
        console.log(`   Created: ${new Date(folder.createdDateTime).toLocaleDateString()}`);
        console.log(`   Modified: ${new Date(folder.lastModifiedDateTime).toLocaleDateString()}`);
        
        // Check if it matches our expected gallery
        if (folder.name.includes('Barracca') || folder.name.includes('20250823')) {
          console.log('   ⭐⭐⭐ THIS IS YOUR NEW GALLERY! ⭐⭐⭐');
        }
        console.log('');
      });
    }
    
    if (files.length > 0) {
      console.log(`\n📄 Files: ${files.length}`);
      files.slice(0, 3).forEach(file => {
        console.log(`   - ${file.name}`);
      });
      if (files.length > 3) {
        console.log(`   ... and ${files.length - 3} more`);
      }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('📋 CONFIGURATION FOR .env FILE:');
    console.log('═'.repeat(60));
    console.log(`\nSHAREPOINT_SITE_ID=${SITE_ID}`);
    console.log(`SHAREPOINT_DRIVE_ID=${DRIVE_ID}`);
    console.log(`SHAREPOINT_GALLERY_FOLDER_ID=${GALLERY_FOLDER_ID}`);
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ If you see your galleries listed above, these are the correct IDs!');
    console.log('Copy them to your .env file and redeploy to Railway.');
    console.log('═'.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

main();
