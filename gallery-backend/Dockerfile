# Railway Dockerfile for Gallery API
FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    vips-dev

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with platform-specific sharp
RUN npm ci --include=optional

# Rebuild sharp for the current platform
RUN npm rebuild sharp

# Copy source code
COPY . .

# Create directory for database
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/gallery.db

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]