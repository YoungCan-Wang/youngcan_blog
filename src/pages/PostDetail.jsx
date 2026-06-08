import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { marked } from 'marked';
import postsData from '../data/posts.json';

export default function PostDetail({ postId, navigateTo }) {
  const [postInfo, setPostInfo] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch and parse markdown
  useEffect(() => {
    setLoading(true);
    setError(null);
    setHtmlContent('');
    setHeadings([]);

    const info = postsData.find(p => p.id === postId);
    if (!info) {
      setError('未找到该文章');
      setLoading(false);
      return;
    }
    setPostInfo(info);

    // Fetch the markdown file from public posts directory
    const basePath = import.meta.env.BASE_URL || '/';
    fetch(`${basePath}posts/${info.filename}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('文章加载失败，请检查文件是否存在');
        }
        return res.text();
      })
      .then(text => {
        // Parse Markdown to HTML
        setHtmlContent(marked.parse(text));

        // Simple markdown heading extraction for TOC
        const headingRegex = /^(##|###)\s+(.+)$/gm;
        const extractedHeadings = [];
        let match;
        // Strip out code blocks from text to avoid false headings inside code
        const strippedText = text.replace(/```[\s\S]*?```/g, '');
        
        while ((match = headingRegex.exec(strippedText)) !== null) {
          extractedHeadings.push({
            level: match[1] === '##' ? 2 : 3,
            text: match[2].replace(/[#*`]/g, '').trim(),
          });
        }
        setHeadings(extractedHeadings);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [postId]);

  // Click handler to smooth scroll to DOM headings
  const handleHeadingClick = (headingText) => {
    const allHeadings = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
    for (let el of allHeadings) {
      if (el.textContent.trim() === headingText) {
        const offset = 90; // Header offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        break;
      }
    }
  };

  if (loading) {
    return (
      <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="logo-icon" style={{ width: '40px', height: '40px' }}></div>
        <p style={{ marginLeft: '16px', color: 'var(--text-secondary)' }}>文章加载中...</p>
      </div>
    );
  }

  if (error || !postInfo) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ marginBottom: '20px' }}>加载出错了</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>{error || '无法获取文章信息'}</p>
        <button className="btn btn-secondary" onClick={() => navigateTo('blog')}>
          <ArrowLeft size={16} /> 返回博文列表
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Scroll Progress Indicator */}
      <div className="reading-progress-container">
        <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Post Header */}
      <header className="post-header">
        <div className="container">
          <button 
            onClick={() => navigateTo('blog')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: '20px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
            }}
            className="btn-secondary"
          >
            <ArrowLeft size={16} /> 返回博文列表
          </button>

          <div>
            <span className={`badge badge-${postInfo.category}`}>
              {postInfo.categoryName}
            </span>
          </div>

          <h1 className="post-header-title">{postInfo.title}</h1>

          <div className="post-header-meta">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> {postInfo.date}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {postInfo.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Post Layout */}
      <div className="container">
        <div className="post-layout">
          {/* Markdown Content */}
          <article 
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Sidebar Navigation */}
          <aside className="sidebar-toc">
            {headings.length > 0 && (
              <div className="glass sidebar-card">
                <h3 className="sidebar-title">文章大纲</h3>
                <ul className="toc-list">
                  {headings.map((h, i) => (
                    <li 
                      key={i}
                      className={`toc-item ${h.level === 3 ? 'h3' : ''}`}
                      onClick={() => handleHeadingClick(h.text)}
                    >
                      {h.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="glass sidebar-card" style={{ marginTop: '24px', textAlign: 'center' }}>
              <h3 className="sidebar-title" style={{ marginBottom: '12px' }}>作者</h3>
              <div 
                className="logo-icon" 
                style={{ width: '40px', height: '40px', margin: '0 auto 12px auto', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
              ></div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>YoungCan</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                探索量化交易与成长的个人思想空间。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
