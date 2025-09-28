const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const NodeCache = require('node-cache');

const sharePointService = require('./services/sharepoint');
const imageService = require('./services/images');
const databaseService = require('./services/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cache setup (1 hour TTL)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // requests
  duration: 60, // per 60 seconds
});

// Middleware
app.use(helmet());

// OPTION 2: Simple wildcard CORS for testing
app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' });
  }
});

// Initialize database
databaseService.init().catch(console.error);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all galleries (SharePoint folders)
app.get('/api/galleries', async (req, res) => {
  try {
    const cacheKey = 'galleries_list';
    let galleries = cache.get(cacheKey);
    
    if (!galleries) {
      galleries = await sharePointService.getGalleries();
      cache.set(cacheKey, galleries, 1800); // 30 min cache
    }
    
    res.json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

// Get images from a specific gallery
app.get('/api/galleries/:galleryId/images', async (req, res) => {
  try {
    const { galleryId } = req.params;
    const { page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = req.query;
    
    const cacheKey = `gallery_${galleryId}_${page}_${limit}_${sortBy}_${sortOrder}`;
    let result = cache.get(cacheKey);
    
    if (!result) {
      const images = await sharePointService.getGalleryImages(galleryId);
      const processedImages = await Promise.all(
        images.map(async (img) => {
          const metadata = await imageService.extractMetadata(img);
          return { ...img, ...metadata };
        })
      );
      
      // Sort images
      processedImages.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedImages = processedImages.slice(startIndex, endIndex);
      
      result = {
        images: paginatedImages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(processedImages.length / limit),
          totalImages: processedImages.length,
          hasNext: endIndex < processedImages.length,
          hasPrev: page > 1
        }
      };
      
      cache.set(cacheKey, result, 600); // 10 min cache
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Search images across all galleries
app.get('/api/search', async (req, res) => {
  try {
    const { 
      q = '', 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20,
      galleries = [] 
    } = req.query;
    
    const cacheKey = `search_${q}_${startDate}_${endDate}_${page}_${limit}_${galleries.join('_')}`;
    let result = cache.get(cacheKey);
    
    if (!result) {
      result = await sharePointService.searchImages({
        query: q,
        startDate,
        endDate,
        page: parseInt(page),
        limit: parseInt(limit),
        galleries: Array.isArray(galleries) ? galleries : galleries.split(',').filter(Boolean)
      });
      
      cache.set(cacheKey, result, 300); // 5 min cache for searches
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error searching images:', error);
    res.status(500).json({ error: 'Failed to search images' });
  }
});

// Get optimized image
app.get('/api/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { size = 'medium', quality = 85 } = req.query;
    
    const cacheKey = `image_${imageId}_${size}_${quality}`;
    let imageBuffer = cache.get(cacheKey);
    
    if (!imageBuffer) {
      const originalImage = await sharePointService.getImageBuffer(imageId);
      imageBuffer = await imageService.optimizeImage(originalImage, {
        size,
        quality: parseInt(quality)
      });
      
      cache.set(cacheKey, imageBuffer, 7200); // 2 hour cache
    }
    
    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
      'ETag': `"${imageId}-${size}-${quality}"`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Get image metadata
app.get('/api/images/:imageId/metadata', async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const cacheKey = `metadata_${imageId}`;
    let metadata = cache.get(cacheKey);
    
    if (!metadata) {
      const imageData = await sharePointService.getImageData(imageId);
      metadata = await imageService.extractMetadata(imageData);
      cache.set(cacheKey, metadata, 3600); // 1 hour cache
    }
    
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// Refresh cache (webhook for SharePoint changes)
app.post('/api/refresh-cache', async (req, res) => {
  try {
    // Verify webhook secret
    const signature = req.headers['x-sharepoint-signature'];
    if (!signature || signature !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    cache.flushAll();
    await databaseService.refreshCache();
    
    res.json({ message: 'Cache refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    res.status(500).json({ error: 'Failed to refresh cache' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Gallery API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});