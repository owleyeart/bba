// import type { Core } from '@strapi/strapi';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Register custom route for Substack integration
    strapi.server.routes([
      {
        method: 'GET',
        path: '/api/substack/posts',
        handler: async (ctx) => {
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
          } catch (error) {
            strapi.log.error('Error fetching Substack posts:', error);
            ctx.throw(500, 'Failed to fetch Substack posts');
          }
        },
        config: {
          auth: false,
        },
      },
    ]);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
