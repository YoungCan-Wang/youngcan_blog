import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, ArrowRight, Grid, List } from 'lucide-react';
import postsData from '../data/posts.json';

export default function Blog({ navigateTo, categoryFilter, setCategoryFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'learning', name: '知识学习' },
    { id: 'life', name: '生活心得' },
    { id: 'trading', name: '交易复盘' },
    { id: 'cognition', name: '成长认知' },
  ];

  // Reset category filter if component unmounts? No, we keep it in parent state so we can pass from Home page.
  
  // Filter posts based on search and category
  const filteredPosts = postsData.filter((post) => {
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fade-in container section">
      {/* Page Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '12px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          博文空间
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          整理日常输入与反思，将零散的灵感固化为系统性的成长笔记。
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="search-filter-bar">
        {/* Categories Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`tab-btn ${categoryFilter === cat.id ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Layout Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="搜索文章、标签..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Grid/List View Toggle */}
          <div 
            className="glass" 
            style={{ 
              display: 'flex', 
              padding: '2px', 
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'grid' ? 'var(--bg-primary)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="网格视图"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'list' ? 'var(--bg-primary)' : 'transparent',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="列表视图"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Posts Listing */}
      {filteredPosts.length > 0 ? (
        <div className={`posts-grid ${viewMode === 'list' ? 'list' : ''}`}>
          {filteredPosts.map((post) => (
            <article 
              key={post.id} 
              className="glass glass-hover post-card"
              onClick={() => navigateTo(`post/${post.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="post-card-meta">
                <span className={`badge badge-${post.category}`}>
                  {post.categoryName}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  {post.date}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>
              
              <h2 className="post-card-title">{post.title}</h2>
              <p className="post-card-summary">{post.summary}</p>
              
              <div className="post-card-footer">
                <div className="post-card-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="post-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="post-readmore">
                  阅读全文 <ArrowRight size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div 
          className="glass" 
          style={{ 
            padding: '60px 20px', 
            textAlign: 'center',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Search size={32} style={{ color: 'var(--text-muted)' }} />
          <p style={{ fontWeight: 500 }}>没有找到匹配的文章</p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>尝试更换关键词或分类标签再次搜索</p>
          <button 
            className="btn btn-secondary" 
            style={{ marginTop: '12px', padding: '6px 14px', fontSize: '0.85rem' }}
            onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
          >
            重置筛选条件
          </button>
        </div>
      )}
    </div>
  );
}
