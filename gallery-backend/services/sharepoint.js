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
      
      const galleries = response.value
        .filter(folder => {
          // Exclude hidden/system folders that start with .
          return !folder.name.startsWith('.');
        })
        .map(folder => {
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
        })
        .sort((a, b) => {
          // Sort by date descending, then by name
          if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
          }
          return a.name.localeCompare(b.name);
        });
      
      // Fetch first image thumbnail for each gallery
      const galleriesWithThumbnails = await Promise.all(
        galleries.map(async (gallery) => {
          try {
            // Get first image from gallery
            const imagesEndpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${gallery.id}/children?$top=1&$filter=file ne null`;
            const imagesResponse = await this.makeGraphRequest(imagesEndpoint);
            
            if (imagesResponse.value && imagesResponse.value.length > 0) {
              const firstImage = imagesResponse.value[0];
              // Get thumbnail URL if available
              if (firstImage['@microsoft.graph.downloadUrl']) {
                gallery.thumbnailUrl = firstImage['@microsoft.graph.downloadUrl'];
                gallery.thumbnailId = firstImage.id;
              }
            }
          } catch (err) {
            console.error(`Error fetching thumbnail for gallery ${gallery.name}:`, err.message);
          }
          return gallery;
        })
      );
      
      return galleriesWithThumbnails;
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

  async searchImages({ query = '', startDate, endDate, page = 1, limit = 20, year, month, orientation, collectionsOnly = false }) {
    try {
      // If collectionsOnly is true, return collections (folders)
      if (collectionsOnly) {
        return await this.searchCollections({ query, startDate, endDate, page, limit, year, month });
      }

      // Simple image search: fetch galleries, then fetch images from each
      console.log('Searching images with query:', query);
      
      // Get all galleries first
      let galleries = await this.getGalleries();
      
      // Filter galleries by date/year/month if specified
      if (year && year.length > 0) {
        galleries = galleries.filter(gallery => {
          if (!gallery.date) return false;
          const galleryYear = new Date(gallery.date).getFullYear().toString();
          return year.includes(galleryYear);
        });
      }
      
      if (month && month.length > 0) {
        galleries = galleries.filter(gallery => {
          if (!gallery.date) return false;
          const galleryMonth = (new Date(gallery.date).getMonth() + 1).toString();
          return month.includes(galleryMonth);
        });
      }
      
      if (startDate || endDate) {
        galleries = galleries.filter(gallery => {
          if (!gallery.date) return false;
          const galleryDate = new Date(gallery.date);
          if (startDate && galleryDate < new Date(startDate)) return false;
          if (endDate && galleryDate > new Date(endDate)) return false;
          return true;
        });
      }
      
      // Identify galleries that match the search query
      let matchingGalleries = [];
      let nonMatchingGalleries = [];
      
      if (query) {
        const queryLower = query.toLowerCase();
        galleries.forEach(gallery => {
          const nameMatch = gallery.name.toLowerCase().includes(queryLower);
          const displayNameMatch = gallery.displayName.toLowerCase().includes(queryLower);
          
          if (nameMatch || displayNameMatch) {
            matchingGalleries.push(gallery);
          } else {
            nonMatchingGalleries.push(gallery);
          }
        });
      } else {
        // No query, all galleries are "non-matching" (will check individual images)
        nonMatchingGalleries = galleries;
      }
      
      console.log(`Galleries matching query: ${matchingGalleries.length}`);
      console.log(`Galleries to search individually: ${nonMatchingGalleries.length}`);
      
      // Fetch images from matching galleries (all images)
      const matchingGalleryImagesPromises = matchingGalleries.map(gallery => 
        this.getGalleryImages(gallery.id).catch(err => {
          console.error(`Error fetching images from gallery ${gallery.name}:`, err.message);
          return [];
        })
      );
      
      // Fetch images from non-matching galleries (will filter by query)
      const nonMatchingGalleryImagesPromises = nonMatchingGalleries.map(gallery => 
        this.getGalleryImages(gallery.id).catch(err => {
          console.error(`Error fetching images from gallery ${gallery.name}:`, err.message);
          return [];
        })
      );
      
      const [matchingGalleryImagesArrays, nonMatchingGalleryImagesArrays] = await Promise.all([
        Promise.all(matchingGalleryImagesPromises),
        Promise.all(nonMatchingGalleryImagesPromises)
      ]);
      
      // All images from matching galleries
      let imagesFromMatchingGalleries = matchingGalleryImagesArrays.flat();
      
      // Images from non-matching galleries that match the query in their filename
      let imagesFromNonMatchingGalleries = nonMatchingGalleryImagesArrays.flat();
      
      if (query) {
        const queryLower = query.toLowerCase();
        imagesFromNonMatchingGalleries = imagesFromNonMatchingGalleries.filter(image => {
          // Search in filename, displayName, and originalFilename
          return (
            image.name.toLowerCase().includes(queryLower) ||
            image.displayName.toLowerCase().includes(queryLower) ||
            (image.originalFilename && image.originalFilename.toLowerCase().includes(queryLower))
          );
        });
      }
      
      // Combine all matching images
      let allImages = [...imagesFromMatchingGalleries, ...imagesFromNonMatchingGalleries];
      
      console.log(`Total images: ${allImages.length} (${imagesFromMatchingGalleries.length} from matching galleries, ${imagesFromNonMatchingGalleries.length} from filename matches)`);
      
      // Filter by orientation if specified
      if (orientation && orientation !== 'any') {
        // Note: We don't have dimension data without fetching each image
        // Skip orientation filter for now unless we add it to the image metadata
        console.log('Orientation filter not yet implemented');
      }
      
      // Sort by date descending (newest first)
      allImages.sort((a, b) => {
        const dateA = a.dateTaken || a.lastModified;
        const dateB = b.dateTaken || b.lastModified;
        return new Date(dateB) - new Date(dateA);
      });
      
      // Paginate
      const totalImages = allImages.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedImages = allImages.slice(startIndex, endIndex);
      
      return {
        images: paginatedImages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalImages / limit),
          totalImages: totalImages,
          hasNext: endIndex < totalImages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error searching images:', error);
      throw new Error('Failed to search images');
    }
  }
  
  async searchCollections({ query = '', startDate, endDate, page = 1, limit = 20, year, month }) {
    try {
      const galleries = await this.getGalleries();
      let results = galleries;
      
      // Filter by search query
      if (query) {
        const queryLower = query.toLowerCase();
        results = results.filter(gallery => 
          gallery.name.toLowerCase().includes(queryLower) ||
          gallery.displayName.toLowerCase().includes(queryLower)
        );
      }
      
      // Filter by date range
      if (startDate || endDate) {
        results = results.filter(gallery => {
          if (!gallery.date) return false;
          const galleryDate = new Date(gallery.date);
          if (startDate && galleryDate < new Date(startDate)) return false;
          if (endDate && galleryDate > new Date(endDate)) return false;
          return true;
        });
      }
      
      // Filter by year
      if (year && year.length > 0) {
        results = results.filter(gallery => {
          if (!gallery.date) return false;
          const galleryYear = new Date(gallery.date).getFullYear().toString();
          return year.includes(galleryYear);
        });
      }
      
      // Filter by month
      if (month && month.length > 0) {
        results = results.filter(gallery => {
          if (!gallery.date) return false;
          const galleryMonth = (new Date(gallery.date).getMonth() + 1).toString();
          return month.includes(galleryMonth);
        });
      }
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = results.slice(startIndex, endIndex);
      
      // Add type identifier
      const collections = paginatedResults.map(gallery => ({
        ...gallery,
        type: 'collection'
      }));
      
      return {
        images: collections, // Keep same key for consistency
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(results.length / limit),
          totalImages: results.length,
          hasNext: endIndex < results.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error searching collections:', error);
      throw new Error('Failed to search collections');
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