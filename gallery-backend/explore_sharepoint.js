// Script to explore SharePoint folder structure
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

// Use the IDs we just found
const SITE_ID = 'owleyeart.sharepoint.com,a4daeb28-5b95-480f-b8a5-b7f77e7021f4,381757a7-6516-4830-957e-2998bccad3b9';
const DRIVE_ID = 'b!KOvapJVbD0i4pbf3fnAh9KdXFzgWZTBIlX4pmLzK07mM53rvuyGJS5k1zhjZEL28';

async function getAccessToken() {
  try {
    const response = await msalClient.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });
    return response.accessToken;
  } catch (error) {
    console.error('Error acquiring token:', error.message);
    throw error;
  }
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
    console.error(`Error on ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

async function exploreFolders(token, siteId, driveId, folderId = 'root', depth = 0, maxDepth = 3) {
  try {
    const indent = '  '.repeat(depth);
    const endpoint = folderId === 'root' 
      ? `/sites/${siteId}/drives/${driveId}/root/children`
      : `/sites/${siteId}/drives/${driveId}/items/${folderId}/children`;
    
    const response = await makeGraphRequest(endpoint, token);
    
    for (const item of response.value) {
      if (item.folder) {
        const childCount = item.folder.childCount || 0;
        console.log(`${indent}📁 ${item.name} (${childCount} items)`);
        console.log(`${indent}   ID: ${item.id}`);
        
        // Check if this looks like our gallery folder
        const name = item.name.toLowerCase();
        if (name.includes('baker') || name.includes('gallery') || name.includes('barracca') || name.match(/^\d{8}/)) {
          console.log(`${indent}   ⭐ POTENTIAL MATCH!`);
          
          // Show what's inside
          if (childCount > 0 && depth < maxDepth) {
            console.log(`${indent}   Contents:`);
            await exploreFolders(token, siteId, driveId, item.id, depth + 1, maxDepth);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error exploring folders:`, error.message);
  }
}

async function searchForGallery(token, siteId, driveId) {
  try {
    console.log('\n🔍 Searching for gallery-related folders...\n');
    
    const searchTerms = ['baker', 'gallery', 'barracca', '20250823'];
    
    for (const term of searchTerms) {
      console.log(`\nSearching for: "${term}"`);
      console.log('─'.repeat(50));
      
      try {
        const endpoint = `/sites/${siteId}/drives/${driveId}/search(q='${term}')`;
        const response = await makeGraphRequest(endpoint, token);
        
        const folders = response.value.filter(item => item.folder);
        
        if (folders.length === 0) {
          console.log(`   No folders found for "${term}"`);
        } else {
          folders.forEach(folder => {
            console.log(`   📁 ${folder.name}`);
            console.log(`      ID: ${folder.id}`);
            console.log(`      Path: ${folder.parentReference?.path || 'N/A'}`);
            console.log(`      Items: ${folder.folder?.childCount || 0}`);
            console.log('');
          });
        }
      } catch (error) {
        console.log(`   Error searching for "${term}":`, error.message);
      }
    }
  } catch (error) {
    console.error('Search error:', error.message);
  }
}

async function main() {
  console.log('🔍 Exploring SharePoint Structure\n');
  console.log('Site: Images Art Gallery');
  console.log('Drive: Documents\n');
  
  try {
    const token = await getAccessToken();
    
    // First, show root structure
    console.log('📂 ROOT FOLDER STRUCTURE:');
    console.log('═'.repeat(60));
    await exploreFolders(token, SITE_ID, DRIVE_ID, 'root', 0, 2);
    
    // Then search for gallery-related items
    console.log('\n\n═'.repeat(60));
    await searchForGallery(token, SITE_ID, DRIVE_ID);
    
    console.log('\n\n═'.repeat(60));
    console.log('💡 TIPS:');
    console.log('═'.repeat(60));
    console.log('1. Look for folders marked with ⭐ POTENTIAL MATCH');
    console.log('2. Check if "20250823 Barracca 08.23" appears in the search');
    console.log('3. The folder might be synced to a different SharePoint site');
    console.log('   (Try the "BobBakerArt" site instead of "Images Art Gallery")');
    console.log('4. Your local "D:\\Owl Eye Art\\BobBakerArt - Gallery" might sync to');
    console.log('   a different SharePoint location than expected');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

main();
