import React from 'react';
import { BookOpen, Heart, LineChart, Brain, ArrowRight, TrendingUp } from 'lucide-react';
import postsData from '../data/posts.json';
import tradesData from '../data/trades.json';

export default function Home({ navigateTo, setBlogCategory }) {
  // Get latest 2 posts
  const recentPosts = postsData.slice(0, 2);

  // Calculate some simple trading metrics
  const totalTrades = tradesData.length;
  const wins = tradesData.filter(t => t.outcome === 'Win').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
  
  const totalGain = tradesData.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const totalLoss = Math.abs(tradesData.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  const profitFactor = totalLoss > 0 ? (totalGain / totalLoss).toFixed(2) : totalGain.toFixed(2);

  const categories = [
    {
      id: 'learning',
      name: '知识学习',
      desc: '系统化输入，结构化整理。涵盖读书笔记、编程开发、量化研究及方法论探索。',
      icon: BookOpen,
      cls: 'cat-card-learning',
      action: () => {
        setBlogCategory('learning');
        navigateTo('blog');
      }
    },
    {
      id: 'life',
      name: '生活心得',
      desc: '记录岁时节物、冥想正念与生活美学。在纷扰的世界中，寻找内心的静谧与笃定。',
      icon: Heart,
      cls: 'cat-card-life',
      action: () => {
        setBlogCategory('life');
        navigateTo('blog');
      }
    },
    {
      id: 'trading',
      name: '交易复盘',
      desc: '交易是认知的变现。记录交易日志、策略研发与市场复盘，通过反思实现净值成长。',
      icon: LineChart,
      cls: 'cat-card-trading',
      action: () => navigateTo('trading')
    },
    {
      id: 'cognition',
      name: '成长认知',
      desc: '沉淀核心思维模型，重构大脑心智框架。关于第二思考、第一性原理的系统反思。',
      icon: Brain,
      cls: 'cat-card-cognition',
      action: () => navigateTo('cognition')
    }
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <p className="hero-subtitle">YoungCan's Personal Space</p>
          <h1 className="hero-title">
            记录知识探索，<br />
            在交易与自我迭代中<span className="gradient-text">实现人生复利</span>
          </h1>
          <p className="hero-desc">
            这里是我的思想实验室，记录着我在计算机与量化金融领域的**知识学习**、充满正念的**生活心得**、刀刃向内的**交易复盘**以及关于心智模型与**成长认知**的系统反思。
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => navigateTo('blog')}>
              阅读博文 <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('trading')}>
              交易看板
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-title-row">
            <h2 className="section-title">内容象限</h2>
          </div>
          <div className="home-categories">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  className={`glass glass-hover cat-card ${cat.cls}`}
                  onClick={cat.action}
                >
                  <div className="cat-icon-wrapper">
                    <Icon size={22} />
                  </div>
                  <h3 className="cat-title">{cat.name}</h3>
                  <p className="cat-description">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Home Split Area */}
      <section className="section" style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <div className="home-split">
            {/* Left Column: Recent Posts */}
            <div>
              <div className="section-title-row">
                <h2 className="section-title">最新发布</h2>
                <a 
                  href="#blog" 
                  className="post-readmore" 
                  onClick={(e) => { e.preventDefault(); navigateTo('blog'); }}
                >
                  查看全部 <ArrowRight size={14} />
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {recentPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="glass glass-hover" 
                    style={{ padding: '24px', cursor: 'pointer' }}
                    onClick={() => navigateTo(`post/${post.id}`)}
                  >
                    <div className="post-card-meta">
                      <span className={`badge badge-${post.category}`}>
                        {post.categoryName}
                      </span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="post-card-title" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                      {post.title}
                    </h3>
                    <p className="post-card-summary" style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                      {post.summary}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="post-card-tags">
                        {post.tags.map(tag => (
                          <span key={tag} className="post-tag">{tag}</span>
                        ))}
                      </div>
                      <span className="post-readmore" style={{ fontSize: '0.8rem' }}>
                        阅读全文 <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Trading Highlight Widget */}
            <div>
              <div className="section-title-row">
                <h2 className="section-title">交易快报</h2>
              </div>
              <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                  <TrendingUp size={20} />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>实盘复盘摘要</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>胜率 (Win Rate)</span>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{winRate}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>盈亏比 (Profit Factor)</span>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{profitFactor}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>交易笔数 (Trades)</span>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{totalTrades} 笔</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  实盘记录主要包含A股市场（奥尼电子/苏州天脉/华盛昌/瑞丰光电等）仓位。核心逻辑基于日线/4小时级别趋势跟踪与交易复盘系统。
                </p>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => navigateTo('trading')}
                >
                  进入交易空间
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
