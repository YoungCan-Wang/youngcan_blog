import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, BookOpen, Compass, LineChart, Brain } from 'lucide-react';

export default function Header({ currentPath, navigateTo }) {
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync theme with HTML attribute
  useEffect(() => {
    const savedTheme = localStorage.getItem('blog-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('blog-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { name: '首页', path: 'home', icon: Compass },
    { name: '博文', path: 'blog', icon: BookOpen },
    { name: '交易复盘', path: 'trading', icon: LineChart },
    { name: '成长认知', path: 'cognition', icon: Brain },
  ];

  const handleNavClick = (path) => {
    navigateTo(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <div className="logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon"></span>
          <span className="gradient-text" style={{ fontStyle: 'normal' }}>YoungCan's Space</span>
        </div>

        {/* Desktop Nav */}
        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <a
                    href={`#${item.path}`}
                    className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.path);
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={16} />
                      {item.name}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="theme-toggle-btn mobile-nav-toggle"
            aria-label="Toggle navigation menu"
            style={{ display: 'none' /* Handled by media query in CSS */ }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Simplistic CSS-based expansion could be styled further if needed, but standard routing click triggers work) */}
      {mobileMenuOpen && (
        <div 
          className="glass" 
          style={{
            position: 'absolute',
            top: '70px',
            left: '24px',
            right: '24px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 99,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: currentPath === item.path ? 'var(--bg-primary)' : 'transparent',
                  color: currentPath === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: currentPath === item.path ? '600' : '500',
                  border: currentPath === item.path ? '1px solid var(--border-color)' : '1px solid transparent',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.path);
                }}
              >
                <Icon size={18} />
                {item.name}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
