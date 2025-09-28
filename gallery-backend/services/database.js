// services/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'gallery.db');
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const createGalleriesTable = `
      CREATE TABLE IF NOT EXISTS galleries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        display_name TEXT,
        date TEXT,
        date_string TEXT,
        item_count INTEGER DEFAULT 0,
        last_modified TEXT,
        web_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createImagesTable = `
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        gallery_id TEXT NOT NULL,
        name TEXT NOT NULL,
        display_name TEXT,
        date_taken TEXT,
        signature TEXT,
        original_filename TEXT,
        file_size INTEGER,
        last_modified TEXT,
        download_url TEXT,
        web_url TEXT,
        
        -- Metadata fields
        width INTEGER,
        height INTEGER,
        format TEXT,
        camera_make TEXT,
        camera_model TEXT,
        lens_model TEXT,
        focal_length TEXT,
        aperture TEXT,
        shutter_speed TEXT,
        iso INTEGER,
        flash TEXT,
        white_balance TEXT,
        color_space TEXT,
        orientation INTEGER DEFAULT 1,
        has_exif BOOLEAN DEFAULT FALSE,
        
        -- Location data
        latitude REAL,
        longitude REAL,
        altitude REAL,
        
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (gallery_id) REFERENCES galleries (id) ON DELETE CASCADE
      )
    `;

    const createSearchIndexes = `
      CREATE INDEX IF NOT EXISTS idx_images_gallery_id ON images(gallery_id);
      CREATE INDEX IF NOT EXISTS idx_images_date_taken ON images(date_taken);
      CREATE INDEX IF NOT EXISTS idx_images_name ON images(name);
      CREATE INDEX IF NOT EXISTS idx_images_display_name ON images(display_name);
      CREATE INDEX IF NOT EXISTS idx_galleries_date ON galleries(date);
      CREATE INDEX IF NOT EXISTS idx_galleries_name ON galleries(name);
    `;

    const createFullTextSearch = `
      CREATE VIRTUAL TABLE IF NOT EXISTS images_fts USING fts5(
        id UNINDEXED,
        gallery_id UNINDEXED,
        name,
        display_name,
        camera_make,
        camera_model,
        lens_model,
        content='images',
        content_rowid='rowid'
      );
      
      CREATE TRIGGER IF NOT EXISTS images_fts_insert AFTER INSERT ON images BEGIN
        INSERT INTO images_fts(rowid, id, gallery_id, name, display_name, camera_make, camera_model, lens_model)
        VALUES (NEW.rowid, NEW.id, NEW.gallery_id, NEW.name, NEW.display_name, NEW.camera_make, NEW.camera_model, NEW.lens_model);
      END;
      
      CREATE TRIGGER IF NOT EXISTS images_fts_delete AFTER DELETE ON images BEGIN
        INSERT INTO images_fts(images_fts, rowid, id, gallery_id, name, display_name, camera_make, camera_model, lens_model)
        VALUES ('delete', OLD.rowid, OLD.id, OLD.gallery_id, OLD.name, OLD.display_name, OLD.camera_make, OLD.camera_model, OLD.lens_model);
      END;
      
      CREATE TRIGGER IF NOT EXISTS images_fts_update AFTER UPDATE ON images BEGIN
        INSERT INTO images_fts(images_fts, rowid, id, gallery_id, name, display_name, camera_make, camera_model, lens_model)
        VALUES ('delete', OLD.rowid, OLD.id, OLD.gallery_id, OLD.name, OLD.display_name, OLD.camera_make, OLD.camera_model, OLD.lens_model);
        INSERT INTO images_fts(rowid, id, gallery_id, name, display_name, camera_make, camera_model, lens_model)
        VALUES (NEW.rowid, NEW.id, NEW.gallery_id, NEW.name, NEW.display_name, NEW.camera_make, NEW.camera_model, NEW.lens_model);
      END;
    `;

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(createGalleriesTable);
        this.db.run(createImagesTable);
        this.db.run(createSearchIndexes);
        this.db.run(createFullTextSearch, (err) => {
          if (err) {
            console.error('Error creating tables:', err);
            reject(err);
          } else {
            console.log('Database tables created successfully');
            resolve();
          }
        });
      });
    });
  }

  async insertGallery(gallery) {
    const sql = `
      INSERT OR REPLACE INTO galleries 
      (id, name, display_name, date, date_string, item_count, last_modified, web_url, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    return new Promise((resolve, reject) => {
      this.db.run(sql, [
        gallery.id,
        gallery.name,
        gallery.displayName,
        gallery.date,
        gallery.dateString,
        gallery.itemCount,
        gallery.lastModified,
        gallery.webUrl
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async insertImage(image, metadata = {}) {
    const sql = `
      INSERT OR REPLACE INTO images 
      (id, gallery_id, name, display_name, date_taken, signature, original_filename, 
       file_size, last_modified, download_url, web_url,
       width, height, format, camera_make, camera_model, lens_model,
       focal_length, aperture, shutter_speed, iso, flash, white_balance,
       color_space, orientation, has_exif, latitude, longitude, altitude, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    return new Promise((resolve, reject) => {
      this.db.run(sql, [
        image.id,
        image.galleryId,
        image.name,
        image.displayName,
        image.dateTaken,
        image.signature,
        image.originalFilename,
        image.size,
        image.lastModified,
        image.downloadUrl,
        image.webUrl,
        metadata.width,
        metadata.height,
        metadata.format,
        metadata.camera?.make,
        metadata.camera?.model,
        metadata.camera?.lens,
        metadata.settings?.focalLength,
        metadata.settings?.aperture,
        metadata.settings?.shutterSpeed,
        metadata.settings?.iso,
        metadata.settings?.flash,
        metadata.settings?.whiteBalance,
        metadata.technical?.colorSpace,
        metadata.technical?.orientation,
        metadata.technical?.hasExif,
        metadata.location?.latitude,
        metadata.location?.longitude,
        metadata.location?.altitude
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async getGalleries() {
    const sql = `
      SELECT * FROM galleries 
      ORDER BY date DESC, name ASC
    `;
    
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getGalleryImages(galleryId, { page = 1, limit = 20, sortBy = 'date_taken', sortOrder = 'desc' } = {}) {
    const offset = (page - 1) * limit;
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    const sql = `
      SELECT * FROM images 
      WHERE gallery_id = ?
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total FROM images WHERE gallery_id = ?
    `;
    
    return new Promise((resolve, reject) => {
      this.db.get(countSql, [galleryId], (err, countRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.db.all(sql, [galleryId, limit, offset], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              images: rows,
              pagination: {
                currentPage: page,
                totalPages: Math.ceil(countRow.total / limit),
                totalImages: countRow.total,
                hasNext: offset + limit < countRow.total,
                hasPrev: page > 1
              }
            });
          }
        });
      });
    });
  }

  async searchImages({ query = '', startDate, endDate, galleries = [], page = 1, limit = 20 }) {
    let sql = '';
    let params = [];
    
    if (query) {
      // Use full-text search
      sql = `
        SELECT i.* FROM images i
        JOIN images_fts fts ON i.rowid = fts.rowid
        WHERE images_fts MATCH ?
      `;
      params.push(query);
    } else {
      sql = 'SELECT * FROM images WHERE 1=1';
    }
    
    // Add date range filter
    if (startDate) {
      sql += ' AND date_taken >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND date_taken <= ?';
      params.push(endDate);
    }
    
    // Add gallery filter
    if (galleries.length > 0) {
      const placeholders = galleries.map(() => '?').join(',');
      sql += ` AND gallery_id IN (${placeholders})`;
      params.push(...galleries);
    }
    
    sql += ' ORDER BY date_taken DESC';
    
    // Count query
    const countSql = sql.replace('SELECT i.*', 'SELECT COUNT(*) as total').replace('SELECT *', 'SELECT COUNT(*) as total');
    
    // Add pagination
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    return new Promise((resolve, reject) => {
      this.db.get(countSql, params.slice(0, -2), (err, countRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              images: rows,
              pagination: {
                currentPage: page,
                totalPages: Math.ceil(countRow.total / limit),
                totalImages: countRow.total,
                hasNext: offset + limit < countRow.total,
                hasPrev: page > 1
              }
            });
          }
        });
      });
    });
  }

  async refreshCache() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('DELETE FROM images');
        this.db.run('DELETE FROM galleries', (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database cache cleared');
            resolve();
          }
        });
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}

module.exports = new DatabaseService();