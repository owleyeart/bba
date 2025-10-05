# Substack Integration - News Page

## Overview
The News page (`/news`) integrates with your Substack publication at https://bobbakerart.substack.com to display your latest posts and encourage newsletter subscriptions.

## Features

✅ **Live RSS Feed Integration** - Automatically fetches latest posts from Substack RSS  
✅ **Beautiful Post Display** - Clean card layout showing post title, date, excerpt, and read more link  
✅ **Subscription Widget** - Embedded Substack subscribe form  
✅ **Error Handling** - Graceful error states with retry functionality  
✅ **Loading States** - Professional loading spinner while fetching posts  
✅ **Responsive Design** - Optimized for all device sizes  
✅ **Call-to-Action** - Multiple CTAs to drive Substack subscriptions

## Architecture

### Backend (Strapi)
Located in `/backend/src/api/substack/`

**Files:**
- `routes/substack.js` - API route definition
- `controllers/substack.js` - Request handler
- `services/substack.js` - RSS feed fetching and parsing logic

**Endpoint:**
```
GET http://localhost:1337/api/substack/posts
```

**Response Format:**
```json
{
  "posts": [
    {
      "title": "Post Title",
      "link": "https://bobbakerart.substack.com/p/post-slug",
      "pubDate": "Wed, 02 Oct 2024 12:00:00 GMT",
      "author": "Bob Baker",
      "description": "<p>Full HTML content...</p>",
      "excerpt": "First 300 characters of plain text...",
      "guid": "unique-post-id"
    }
  ],
  "total": 10,
  "fetchedAt": "2024-10-05T10:00:00.000Z"
}
```

### Frontend (React)
Located in `/src/`

**Files:**
- `News.jsx` - Main component
- `News.css` - Styling

**Features:**
- Fetches posts from backend API
- Formats dates in readable format
- Displays posts in responsive grid
- Handles loading and error states
- Links directly to Substack for full posts

## Installation

### 1. Install Backend Dependencies

Navigate to the backend directory and install required packages:

```bash
cd backend
npm install axios xml2js
```

### 2. Start the Backend

```bash
npm run develop
```

The backend will run on `http://localhost:1337`

### 3. Start the Frontend

In a new terminal:

```bash
cd ../
npm run dev
```

The frontend will run on `http://localhost:5173` (or your configured port)

## Configuration

### Changing the Substack URL

To use a different Substack publication, update the RSS feed URL in:

`backend/src/api/substack/services/substack.js`

```javascript
const response = await axios.get('https://YOUR-SUBSTACK-URL.substack.com/feed');
```

### API Endpoint Configuration

If your backend runs on a different port or domain, update the API URL in:

`src/News.jsx`

```javascript
const response = await fetch('http://localhost:1337/api/substack/posts');
```

For production, you'll want to use environment variables:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const response = await fetch(`${API_URL}/api/substack/posts`);
```

## Customization

### Post Display

**Number of Posts:**
Currently displays all posts from the RSS feed. To limit:

```javascript
// In News.jsx
const displayedPosts = posts.slice(0, 6); // Show only 6 posts
```

**Grid Layout:**
Modify in `News.css`:

```css
.posts-grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}
```

**Excerpt Length:**
Modify in `backend/src/api/substack/services/substack.js`:

```javascript
const excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
```

### Styling

The page uses your existing design system with:
- **Fonts:** fino-sans (headings), minion-pro (body)
- **Colors:** Purple gradient theme matching your brand
- **Effects:** Glassmorphism, backdrop blur, smooth transitions

To customize colors, search for color values in `News.css` and update:
- `#d4a5ff` - Accent purple
- `rgba(255, 255, 255, 0.X)` - White with varying opacity

## Substack Resources

**Your Substack:**
- Publication: https://bobbakerart.substack.com
- RSS Feed: https://bobbakerart.substack.com/feed
- Embed Form: https://bobbakerart.substack.com/embed

**Useful Links:**
- [Substack Help Center](https://support.substack.com/)
- [Substack Publisher Guide](https://on.substack.com/p/grow)
- [RSS Feed Documentation](https://support.substack.com/hc/en-us/articles/360037466012-Does-my-Substack-have-an-RSS-feed-)

## Troubleshooting

### Posts Not Loading

**Check Backend:**
1. Ensure backend is running: `http://localhost:1337`
2. Test API endpoint directly: `http://localhost:1337/api/substack/posts`
3. Check backend console for errors

**Check Frontend:**
1. Open browser console (F12)
2. Look for network errors
3. Verify API URL is correct

**Common Issues:**
- CORS errors: Ensure backend is running
- 404 errors: Check route registration in Strapi
- Parsing errors: Verify RSS feed is accessible

### Styling Issues

**Post Cards Not Displaying:**
1. Check browser console for CSS errors
2. Verify News.css is imported in News.jsx
3. Clear browser cache

**Responsive Issues:**
1. Check media queries in News.css
2. Test at different breakpoints
3. Verify flexbox/grid support

## Production Deployment

### Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com
```

### CORS Configuration

Update Strapi CORS settings in `backend/config/middlewares.js`:

```javascript
module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://your-frontend-domain.com'],
    },
  },
];
```

### Caching (Optional)

For better performance, consider caching RSS feed results:

1. Add Redis or in-memory cache
2. Cache feed results for 5-15 minutes
3. Update service to check cache before fetching

## Future Enhancements

**Potential Features:**
- [ ] Search and filter posts
- [ ] Pagination for large post counts
- [ ] Category/tag filtering
- [ ] Featured posts section
- [ ] Post preview modal
- [ ] Share buttons for posts
- [ ] Reading time estimates
- [ ] Related posts suggestions
- [ ] Email preview before subscribing
- [ ] Analytics tracking for clicks
- [ ] Image thumbnails from posts
- [ ] Sort by date/popularity

## QR Code Integration

The QR code you provided can be used to promote your Substack in physical materials. Consider:
- Adding it to business cards
- Including in portfolio pieces
- Display at exhibitions
- Print materials and flyers

## Support

For Strapi/backend issues: Check Strapi documentation at https://docs.strapi.io/  
For React/frontend issues: Check React documentation at https://react.dev/  
For Substack questions: Contact Substack support at https://support.substack.com/

---

**Created:** October 2025  
**Last Updated:** October 2025  
**Version:** 1.0.0
