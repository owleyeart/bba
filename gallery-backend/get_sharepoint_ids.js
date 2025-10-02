// Script to get SharePoint Site ID, Drive ID, and Gallery Folder ID
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

async function getAccessToken() {
  try {
    const clientCredentialRequest = {
      scopes: ['https://graph.microsoft.com/.default'],
    };

    const response = await msalClient.acquireTokenByClientCredential(clientCredentialRequest);
    return response.accessToken;
  } catch (error) {
    console.error('❌ Error acquiring access token:', error.message);
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
    console.error(`❌ Graph API request failed for ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

async function getSiteId(token, siteName) {
  try {
    // Get all sites
    const sites = await makeGraphRequest('/sites?search=*', token);
    
    console.log('\n📂 Available SharePoint Sites:');
    sites.value.forEach((site, index) => {
      console.log(`${index + 1}. ${site.displayName || site.name}`);
      console.log(`   ID: ${site.id}`);
      console.log(`   URL: ${site.webUrl}\n`);
    });
    
    // Look for site with "BobBakerArt" or "Gallery"
    const gallerySite = sites.value.find(site => 
      (site.displayName && (
        site.displayName.toLowerCase().includes('bobbaker') ||
        site.displayName.toLowerCase().includes('gallery') ||
        site.displayName.toLowerCase().includes('owl eye')
      )) ||
      (site.name && (
        site.name.toLowerCase().includes('bobbaker') ||
        site.name.toLowerCase().includes('gallery') ||
        site.name.toLowerCase().includes('owl eye')
      ))
    );
    
    if (gallerySite) {
      console.log('✅ Found potential gallery site:', gallerySite.displayName || gallerySite.name);
      return gallerySite.id;
    }
    
    console.log('⚠️  Could not auto-detect gallery site. Please choose from the list above.');
    return null;
  } catch (error) {
    console.error('Error getting site ID:', error.message);
    throw error;
  }
}

async function getDriveId(token, siteId) {
  try {
    // Get drives for the site
    const drives = await makeGraphRequest(`/sites/${siteId}/drives`, token);
    
    console.log('\n💾 Available Drives:');
    drives.value.forEach((drive, index) => {
      console.log(`${index + 1}. ${drive.name}`);
      console.log(`   ID: ${drive.id}`);
      console.log(`   Type: ${drive.driveType}\n`);
    });
    
    // Usually the Documents library is the main drive
    const docsDrive = drives.value.find(drive => 
      drive.name === 'Documents' || 
      drive.driveType === 'documentLibrary'
    );
    
    if (docsDrive) {
      console.log('✅ Using drive:', docsDrive.name);
      return docsDrive.id;
    }
    
    // Fallback to first drive
    if (drives.value.length > 0) {
      console.log('✅ Using first available drive:', drives.value[0].name);
      return drives.value[0].id;
    }
    
    throw new Error('No drives found');
  } catch (error) {
    console.error('Error getting drive ID:', error.message);
    throw error;
  }
}

async function findGalleryFolder(token, siteId, driveId) {
  try {
    // Get root items
    console.log('\n🔍 Searching for "BobBakerArt - Gallery" folder...');
    const rootItems = await makeGraphRequest(`/sites/${siteId}/drives/${driveId}/root/children`, token);
    
    console.log('\n📁 Root folders:');
    const folders = rootItems.value.filter(item => item.folder);
    folders.forEach((folder, index) => {
      console.log(`${index + 1}. ${folder.name} (${folder.folder?.childCount || 0} items)`);
    });
    
    // Look for gallery folder
    const galleryFolder = folders.find(folder => 
      folder.name.toLowerCase().includes('bobbaker') ||
      folder.name.toLowerCase().includes('gallery')
    );
    
    if (galleryFolder) {
      console.log(`\n✅ Found gallery folder: "${galleryFolder.name}"`);
      console.log(`   ID: ${galleryFolder.id}`);
      console.log(`   Items: ${galleryFolder.folder?.childCount || 0}`);
      
      // List subfolders (galleries)
      const subItems = await makeGraphRequest(`/sites/${siteId}/drives/${driveId}/items/${galleryFolder.id}/children`, token);
      const galleries = subItems.value.filter(item => item.folder);
      
      if (galleries.length > 0) {
        console.log(`\n📸 Found ${galleries.length} galleries:`);
        galleries.slice(0, 5).forEach(g => {
          console.log(`   - ${g.name} (${g.folder?.childCount || 0} items)`);
        });
        if (galleries.length > 5) {
          console.log(`   ... and ${galleries.length - 5} more`);
        }
      }
      
      return galleryFolder.id;
    }
    
    console.log('\n⚠️  Gallery folder not found in root. Showing all folders above.');
    console.log('Please check which folder contains your galleries.');
    return null;
  } catch (error) {
    console.error('Error finding gallery folder:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Getting SharePoint IDs for Gallery Backend\n');
  console.log('Azure Configuration:');
  console.log(`   Client ID: ${process.env.AZURE_CLIENT_ID}`);
  console.log(`   Tenant ID: ${process.env.AZURE_TENANT_ID}`);
  console.log(`   Secret: ${process.env.AZURE_CLIENT_SECRET ? '✓ Set' : '✗ Missing'}\n`);
  
  try {
    // Step 1: Get access token
    console.log('📝 Step 1: Acquiring access token...');
    const token = await getAccessToken();
    console.log('✅ Access token acquired\n');
    
    // Step 2: Get Site ID
    console.log('📝 Step 2: Finding SharePoint site...');
    const siteId = await getSiteId(token);
    
    if (!siteId) {
      console.log('\n❌ Could not determine site ID automatically.');
      console.log('Please update SHAREPOINT_SITE_ID in your .env file with one of the Site IDs listed above.');
      return;
    }
    
    // Step 3: Get Drive ID
    console.log('\n📝 Step 3: Finding document drive...');
    const driveId = await getDriveId(token, siteId);
    
    // Step 4: Find Gallery Folder
    console.log('\n📝 Step 4: Finding gallery folder...');
    const folderId = await findGalleryFolder(token, siteId, driveId);
    
    // Output results
    console.log('\n' + '='.repeat(60));
    console.log('📋 COPY THESE VALUES TO YOUR .env FILE:');
    console.log('='.repeat(60));
    console.log(`\nSHAREPOINT_SITE_ID=${siteId}`);
    console.log(`SHAREPOINT_DRIVE_ID=${driveId}`);
    if (folderId) {
      console.log(`SHAREPOINT_GALLERY_FOLDER_ID=${folderId}`);
    } else {
      console.log('SHAREPOINT_GALLERY_FOLDER_ID=<see folder IDs above>');
    }
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. Your Azure credentials are correct in .env');
    console.error('2. The app has proper permissions in Azure AD');
    console.error('3. You have access to the SharePoint site');
  }
}

main();
