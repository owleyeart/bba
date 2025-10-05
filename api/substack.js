import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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

    res.status(200).json({
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
}
