// ///////////////////////////////////////////////////////
// Bob Baker - Bob Baker Art, October 2025             //
// Substack News & Newsletter Integration              //
// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import './News.css';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('News component mounted');
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from /api/substack');
      setLoading(true);
      const response = await fetch('/api/substack');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching Substack posts:', err);
      setError('Unable to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  console.log('Rendering News component. Loading:', loading, 'Error:', error, 'Posts count:', posts.length);

  return (
    <div className="news-page">
      <div className="news-hero">
        <h1>News & Updates</h1>
        <p className="news-subtitle">
          Behind-the-scenes stories, creative process, and photographic adventures
        </p>
      </div>

      {/* Substack Embed Section */}
      <div className="subscribe-section">
        <div className="subscribe-card">
          <h2>Subscribe to Bob Baker Art</h2>
          <p>Get the latest updates, photography insights, and exclusive content delivered to your inbox.</p>
          
          <div className="substack-embed-container">
            <iframe 
              src="https://bobbakerart.substack.com/embed" 
              width="100%" 
              height="320" 
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px'
              }}
              frameBorder="0" 
              scrolling="no"
              title="Substack Subscribe Form"
            />
          </div>

          <div className="subscribe-links">
            <a 
              href="https://bobbakerart.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="chat-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Visit Substack
            </a>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="posts-section">
        <h2>Latest Posts</h2>
        
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading latest posts...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchPosts} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="no-posts">
            <p>No posts available yet. Check back soon for updates!</p>
            <a 
              href="https://bobbakerart.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-all-posts"
            >
              Visit Substack →
            </a>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post, index) => (
              <article key={post.guid || index} className="post-card">
                <div className="post-date">{formatDate(post.pubDate)}</div>
                <h3 className="post-title">
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {post.title}
                  </a>
                </h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read More →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Don't Miss Out</h2>
        <p>Subscribe now to get updates on new photography projects, creative insights, and exclusive content.</p>
        <a 
          href="https://bobbakerart.substack.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cta-button"
        >
          Subscribe on Substack →
        </a>
      </div>
    </div>
  );
};

export default News;
