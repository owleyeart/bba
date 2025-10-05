// Simple proxy server for development
// This fetches Substack RSS and serves it as JSON
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/substack', async (req, res) => {
  try {
    const response = await axios.get('https://bobbakerart.substack.com/feed');
    const xml = response.data;

    const result = await parseStringPromise(xml);
    const items = result.rss.channel[0].item || [];
    
    const posts = items.map(item => {
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

    res.json({
      posts,
      total: posts.length,
      fetchedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error fetching Substack posts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Substack posts',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
