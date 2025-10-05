/**
 * substack service
 */

import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default {
  async fetchPosts() {
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

      return {
        posts,
        total: posts.length,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching Substack posts:', error);
      throw new Error('Failed to fetch Substack posts');
    }
  },
};
