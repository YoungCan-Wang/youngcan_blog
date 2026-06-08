import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer({ navigateTo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '40px 0',
        background: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        fontSize: '0.88rem',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>YoungCan's Space</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            记录知识学习 · 生活心得 · 交易复盘 · 成长认知
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} style={{ hover: 'color: var(--text-primary)' }}>首页</a>
          <a href="#blog" onClick={(e) => { e.preventDefault(); navigateTo('blog'); }}>博文</a>
          <a href="#trading" onClick={(e) => { e.preventDefault(); navigateTo('trading'); }}>交易复盘</a>
          <a href="#cognition" onClick={(e) => { e.preventDefault(); navigateTo('cognition'); }}>成长认知</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>© {currentYear} YoungCan. Built with React & CSS.</span>
          <Heart size={12} style={{ color: 'rgba(239, 68, 68, 0.7)', fill: 'rgba(239, 68, 68, 0.4)' }} />
          <span>Deployed on GitHub Pages.</span>
        </div>
      </div>
    </footer>
  );
}
