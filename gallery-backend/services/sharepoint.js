// services/sharepoint.js
const { ConfidentialClientApplication } = require('@azure/msal-node');
const axios = require('axios');

class SharePointService {
  constructor() {
    this.msalConfig = {
      auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`
      }
    };
    
    this.msalClient = new ConfidentialClientApplication(this.msalConfig);
    this.accessToken = null;
    this.tokenExpiry = null;
    
    this.siteId = process.env.SHAREPOINT_SITE_ID;
    this.driveId = process.env.SHAREPOINT_DRIVE_ID;
    this.galleryFolderId = process.env.SHAREPOINT_GALLERY_FOLDER_ID;
  }

  async getAccessToken() {
    // Check if current token is still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    try {
      const clientCredentialRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
      };

      const response = await this.msalClient.acquireTokenByClientCredential(clientCredentialRequest);
      
      this.accessToken = response.accessToken;
      this.tokenExpiry = response.expiresOn.getTime();
      
      return this.accessToken;
    } catch (error) {
      console.error('Error acquiring access token:', error);
      throw new Error('Failed to authenticate with SharePoint');
    }
  }

  async makeGraphRequest(endpoint, options = {}) {
    const token = await this.getAccessToken();
    
    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await axios(`https://graph.microsoft.com/v1.0${endpoint}`, config);
      return response.data;
    } catch (error) {
      console.error('Graph API request failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getGalleries() {
    try {
      // Get all folders in the gallery directory
      const endpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${this.galleryFolderId}/children?$filter=folder ne null&$orderby=name asc`;
      
      const response = await this.makeGraphRequest(endpoint);
      
      return response.value.map(folder => {
        const name = folder.name;
        const dateMatch = name.match(/^(\d{8})/);
        const date = dateMatch ? this.parseDate(dateMatch[1]) : null;
        const description = name.replace(/^\d{8}\s*/, '') || 'Untitled Gallery';
        
        return {
          id: folder.id,
          name: folder.name,
          displayName: description,
          date: date,
          dateString: dateMatch ? dateMatch[1] : null,
          itemCount: folder.folder?.childCount || 0,
          lastModified: folder.lastModifiedDateTime,
          webUrl: folder.webUrl
        };
      }).sort((a, b) => {
        // Sort by date descending, then by name
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error fetching galleries:', error);
      throw new Error('Failed to fetch galleries from SharePoint');
    }
  }

async getGalleryImages(galleryId) {
  try {
    // Simplest possible query - just get all children, no filtering
    const endpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${galleryId}/children`;
    
    const response = await this.makeGraphRequest(endpoint);
    
    // Filter for files only and then for image files in JavaScript
    const imageFiles = response.value
      .filter(item => item.file) // Only files, not folders
      .filter(file => this.isImageFile(file.name)) // Only image files
      .sort((a, b) => b.name.localeCompare(a.name)); // Sort by name descending
    
    return imageFiles.map(file => {
      const metadata = this.parseFilename(file.name);
      
      return {
        id: file.id,
        name: file.name,
        displayName: metadata.displayName,
        dateTaken: metadata.dateTaken,
        signature: metadata.signature,
        originalFilename: metadata.originalFilename,
        size: file.size,
        lastModified: file.lastModifiedDateTime,
        downloadUrl: file['@microsoft.graph.downloadUrl'],
        webUrl: file.webUrl,
        thumbnails: file.thumbnails,
        galleryId: galleryId
      };
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw new Error('Failed to fetch images from gallery');
  }
}

  async searchImages({ query = '', startDate, endDate, page = 1, limit = 20, galleries = [] }) {
    try {
      let searchQuery = '';
      
      // Build search query
      if (query) {
        searchQuery += `filename:${query}* OR `;
      }
      
      // Add file type filter
      searchQuery += '(filetype:jpg OR filetype:jpeg OR filetype:png OR filetype:tiff OR filetype:tif)';
      
      let endpoint = `/sites/${this.siteId}/drives/${this.driveId}/search(q='${encodeURIComponent(searchQuery)}')`;
      
      const response = await this.makeGraphRequest(endpoint);
      
      let results = response.value.filter(item => item.file && this.isImageFile(item.name));
      
      // Filter by date range if provided
      if (startDate || endDate) {
        results = results.filter(item => {
          const metadata = this.parseFilename(item.name);
          if (!metadata.dateTaken) return false;
          
          const itemDate = new Date(metadata.dateTaken);
          
          if (startDate && itemDate < new Date(startDate)) return false;
          if (endDate && itemDate > new Date(endDate)) return false;
          
          return true;
        });
      }
      
      // Filter by galleries if specified
      if (galleries.length > 0) {
        const galleryData = await this.getGalleries();
        const galleryIds = galleryData
          .filter(g => galleries.includes(g.name) || galleries.includes(g.id))
          .map(g => g.id);
        
        results = results.filter(item => {
          // Check if item is in one of the specified galleries
          return galleryIds.some(gId => item.parentReference?.id === gId);
        });
      }
      
      // Sort by date taken (newest first)
      results.sort((a, b) => {
        const aDate = this.parseFilename(a.name).dateTaken;
        const bDate = this.parseFilename(b.name).dateTaken;
        return new Date(bDate || 0) - new Date(aDate || 0);
      });
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = results.slice(startIndex, endIndex);
      
      // Transform results
      const images = paginatedResults.map(file => {
        const metadata = this.parseFilename(file.name);
        
        return {
          id: file.id,
          name: file.name,
          displayName: metadata.displayName,
          dateTaken: metadata.dateTaken,
          signature: metadata.signature,
          originalFilename: metadata.originalFilename,
          size: file.size,
          lastModified: file.lastModifiedDateTime,
          downloadUrl: file['@microsoft.graph.downloadUrl'],
          webUrl: file.webUrl,
          galleryId: file.parentReference?.id
        };
      });
      
      return {
        images,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(results.length / limit),
          totalImages: results.length,
          hasNext: endIndex < results.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error searching images:', error);
      throw new Error('Failed to search images');
    }
  }

  async getImageBuffer(imageId) {
    try {
      const token = await this.getAccessToken();
      
      const endpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${imageId}/content`;
      
      const response = await axios.get(`https://graph.microsoft.com/v1.0${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'arraybuffer'
      });
      
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error fetching image buffer:', error);
      throw new Error('Failed to fetch image');
    }
  }

  async getImageData(imageId) {
    try {
      const endpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${imageId}`;
      return await this.makeGraphRequest(endpoint);
    } catch (error) {
      console.error('Error fetching image data:', error);
      throw new Error('Failed to fetch image data');
    }
  }

  // Helper methods
  parseFilename(filename) {
    // Parse format: 20240502_303_OWL6042.jpg
    const match = filename.match(/^(\d{8})_(\d{3})_(.+?)\.(jpg|jpeg|png|tiff|tif)$/i);
    
    if (match) {
      const [, dateStr, signature, originalName, extension] = match;
      const date = this.parseDate(dateStr);
      
      return {
        dateTaken: date,
        signature: signature,
        originalFilename: `${originalName}.${extension}`,
        displayName: originalName,
        extension: extension.toLowerCase()
      };
    }
    
    // Fallback for non-standard filenames
    return {
      dateTaken: null,
      signature: null,
      originalFilename: filename,
      displayName: filename.replace(/\.[^/.]+$/, ''),
      extension: filename.split('.').pop()?.toLowerCase()
    };
  }

  parseDate(dateString) {
    // Parse YYYYMMDD format
    if (dateString && dateString.length === 8) {
      const year = dateString.substr(0, 4);
      const month = dateString.substr(4, 2);
      const day = dateString.substr(6, 2);
      
      return `${year}-${month}-${day}`;
    }
    
    return null;
  }

  isImageFile(filename) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'tiff', 'tif'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  }
}

module.exports = new SharePointService();