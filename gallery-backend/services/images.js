// services/images.js
const sharp = require('sharp');
const exifr = require('exifr');

class ImageService {
  constructor() {
    this.sizePresets = {
      thumbnail: { width: 300, height: 200, quality: 80 },
      small: { width: 600, height: 400, quality: 85 },
      medium: { width: 1200, height: 800, quality: 90 },
      large: { width: 2000, height: 1333, quality: 95 },
      original: { quality: 100 }
    };
  }

  async optimizeImage(imageBuffer, options = {}) {
    try {
      const { size = 'medium', quality = 85, format = 'jpeg' } = options;
      
      let sharpInstance = sharp(imageBuffer);
      
      // Get image metadata
      const metadata = await sharpInstance.metadata();
      
      // Apply size preset if specified
      if (this.sizePresets[size] && size !== 'original') {
        const preset = this.sizePresets[size];
        
        sharpInstance = sharpInstance.resize({
          width: preset.width,
          height: preset.height,
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      // Apply format and quality
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          sharpInstance = sharpInstance.jpeg({ 
            quality: quality,
            progressive: true,
            mozjpeg: true
          });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ 
            quality: quality,
            compressionLevel: 9,
            progressive: true
          });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ 
            quality: quality,
            effort: 6
          });
          break;
        default:
          sharpInstance = sharpInstance.jpeg({ quality: quality });
      }
      
      return await sharpInstance.toBuffer();
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw new Error('Failed to optimize image');
    }
  }

  async extractMetadata(imageData) {
    try {
      let buffer;
      
      // Handle different input types
      if (Buffer.isBuffer(imageData)) {
        buffer = imageData;
      } else if (imageData.downloadUrl) {
        // Fetch image from URL
        const response = await fetch(imageData.downloadUrl);
        buffer = Buffer.from(await response.arrayBuffer());
      } else {
        throw new Error('Invalid image data provided');
      }

      // Extract EXIF data
      const exifData = await exifr.parse(buffer, {
        pick: [
          'DateTimeOriginal',
          'DateTime',
          'CreateDate',
          'Make',
          'Model',
          'LensModel',
          'FocalLength',
          'FNumber',
          'ExposureTime',
          'ISO',
          'Flash',
          'WhiteBalance',
          'ColorSpace',
          'ExifImageWidth',
          'ExifImageHeight',
          'Orientation',
          'GPS',
          'GPSLatitude',
          'GPSLongitude',
          'GPSAltitude'
        ]
      });

      // Get basic image info using Sharp
      const sharpMetadata = await sharp(buffer).metadata();

      // Process and normalize the metadata
      const metadata = {
        // Basic file info
        width: sharpMetadata.width,
        height: sharpMetadata.height,
        format: sharpMetadata.format,
        fileSize: buffer.length,
        
        // Camera info
        camera: {
          make: exifData?.Make || null,
          model: exifData?.Model || null,
          lens: exifData?.LensModel || null
        },
        
        // Shooting parameters
        settings: {
          focalLength: exifData?.FocalLength ? `${exifData.FocalLength}mm` : null,
          aperture: exifData?.FNumber ? `f/${exifData.FNumber}` : null,
          shutterSpeed: this.formatShutterSpeed(exifData?.ExposureTime),
          iso: exifData?.ISO || null,
          flash: this.formatFlash(exifData?.Flash),
          whiteBalance: exifData?.WhiteBalance || null
        },
        
        // Date info
        dateTaken: this.extractDateTaken(exifData),
        
        // Location info
        location: this.extractLocation(exifData),
        
        // Technical details
        technical: {
          colorSpace: exifData?.ColorSpace || null,
          orientation: exifData?.Orientation || 1,
          hasExif: !!exifData
        }
      };

      return metadata;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      
      // Return basic metadata if EXIF extraction fails
      return {
        width: null,
        height: null,
        format: null,
        fileSize: null,
        camera: { make: null, model: null, lens: null },
        settings: { 
          focalLength: null, 
          aperture: null, 
          shutterSpeed: null, 
          iso: null, 
          flash: null, 
          whiteBalance: null 
        },
        dateTaken: null,
        location: null,
        technical: { colorSpace: null, orientation: 1, hasExif: false }
      };
    }
  }

  extractDateTaken(exifData) {
    if (!exifData) return null;
    
    // Try multiple date fields in order of preference
    const dateFields = ['DateTimeOriginal', 'DateTime', 'CreateDate'];
    
    for (const field of dateFields) {
      if (exifData[field]) {
        try {
          return new Date(exifData[field]).toISOString();
        } catch (error) {
          console.warn(`Invalid date format in ${field}:`, exifData[field]);
        }
      }
    }
    
    return null;
  }

  extractLocation(exifData) {
    if (!exifData?.GPS && !exifData?.GPSLatitude) {
      return null;
    }
    
    try {
      const lat = exifData.GPSLatitude || exifData.GPS?.latitude;
      const lon = exifData.GPSLongitude || exifData.GPS?.longitude;
      const alt = exifData.GPSAltitude || exifData.GPS?.altitude;
      
      if (lat && lon) {
        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          altitude: alt ? parseFloat(alt) : null
        };
      }
    } catch (error) {
      console.warn('Error parsing GPS data:', error);
    }
    
    return null;
  }

  formatShutterSpeed(exposureTime) {
    if (!exposureTime) return null;
    
    const speed = parseFloat(exposureTime);
    if (speed >= 1) {
      return `${speed}s`;
    } else {
      return `1/${Math.round(1 / speed)}`;
    }
  }

  formatFlash(flashValue) {
    if (flashValue === undefined || flashValue === null) return null;
    
    const flashModes = {
      0: 'No Flash',
      1: 'Flash Fired',
      5: 'Flash Fired, Return not detected',
      7: 'Flash Fired, Return detected',
      9: 'Flash Fired, Compulsory',
      13: 'Flash Fired, Compulsory, Return not detected',
      15: 'Flash Fired, Compulsory, Return detected',
      16: 'No Flash, Compulsory',
      24: 'No Flash, Auto',
      25: 'Flash Fired, Auto',
      29: 'Flash Fired, Auto, Return not detected',
      31: 'Flash Fired, Auto, Return detected',
      32: 'No Flash Available',
      65: 'Flash Fired, Red-eye reduction',
      69: 'Flash Fired, Red-eye reduction, Return not detected',
      71: 'Flash Fired, Red-eye reduction, Return detected',
      73: 'Flash Fired, Compulsory, Red-eye reduction',
      77: 'Flash Fired, Compulsory, Red-eye reduction, Return not detected',
      79: 'Flash Fired, Compulsory, Red-eye reduction, Return detected',
      89: 'Flash Fired, Auto, Red-eye reduction',
      93: 'Flash Fired, Auto, Red-eye reduction, Return not detected',
      95: 'Flash Fired, Auto, Red-eye reduction, Return detected'
    };
    
    return flashModes[flashValue] || `Flash Mode ${flashValue}`;
  }

  async generateThumbnail(imageBuffer, size = 'thumbnail') {
    const preset = this.sizePresets[size] || this.sizePresets.thumbnail;
    
    return await sharp(imageBuffer)
      .resize({
        width: preset.width,
        height: preset.height,
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: preset.quality, progressive: true })
      .toBuffer();
  }

  async getImageDimensions(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        aspectRatio: metadata.width / metadata.height
      };
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return { width: null, height: null, aspectRatio: null };
    }
  }
}

module.exports = new ImageService();