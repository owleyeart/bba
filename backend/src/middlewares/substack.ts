import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Check if this is the substack posts endpoint
    if (ctx.request.url === '/api/substack/posts' && ctx.request.method === 'GET') {
      try {
        // Fetch the RSS feed
        const response = await axios.get('https://bobbakerart.substack.com/feed');
        const xml = response.data;

        // Parse XML to JSON
        const result = await parseStringPromise(xml);
        
        // Extract posts from RSS feed
        const items = result.rss.channel[0].item || [];
        
        // Transform to cleaner format
        const posts = items.map(item => {
          // Extract plain text from description (remove HTML)
          const description = item.description?.[0] || '';
          const plainText = description.replace(/<[^>]*>/g, '').trim();
          const excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
          
          return {
            title: item.title?.[0] || 'Untitled',
            link: item.link?.[0] || '',
            pubDate: item.pubDate?.[0] || '',
            author: item['dc:creator']?.[0] || 'Bob Baker',
            description: description,
            excerpt: excerpt,
            guid: item.guid?.[0]?._ || item.guid?.[0] || '',
          };
        });

        ctx.body = {
          posts,
          total: posts.length,
          fetchedAt: new Date().toISOString(),
        };
        ctx.status = 200;
        return; // Don't call next()
      } catch (error) {
        strapi.log.error('Error fetching Substack posts:', error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch Substack posts' };
        return;
      }
    }
    
    // Continue to next middleware for other routes
    await next();
  };
};
