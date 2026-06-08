import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Trading from './pages/Trading';
import Cognition from './pages/Cognition';

function App() {
  const [route, setRoute] = useState({ path: 'home', params: {} });
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');

  // Custom hash router for GitHub Pages stability
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      const cleanHash = hash.replace('#', '');
      
      if (cleanHash.startsWith('post/')) {
        const postId = cleanHash.split('/')[1];
        setRoute({ path: 'post-detail', params: { id: postId } });
        window.scrollTo(0, 0);
      } else {
        setRoute({ path: cleanHash, params: {} });
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init router on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path) => {
    window.location.hash = path;
  };

  // Render the appropriate page
  const renderPage = () => {
    switch (route.path) {
      case 'home':
        return (
          <Home 
            navigateTo={navigateTo} 
            setBlogCategory={(cat) => setBlogCategoryFilter(cat)} 
          />
        );
      case 'blog':
        return (
          <Blog 
            navigateTo={navigateTo} 
            categoryFilter={blogCategoryFilter} 
            setCategoryFilter={setBlogCategoryFilter} 
          />
        );
      case 'post-detail':
        return (
          <PostDetail 
            postId={route.params.id} 
            navigateTo={navigateTo} 
          />
        );
      case 'trading':
        return <Trading />;
      case 'cognition':
        return <Cognition />;
      default:
        return (
          <div className="container section" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>404 - 页面未找到</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '20px 0' }}>您访问的路径不存在。</p>
            <button className="btn btn-primary" onClick={() => navigateTo('home')}>返回首页</button>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPath={route.path === 'post-detail' ? 'blog' : route.path} navigateTo={navigateTo} />
      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>
      <Footer navigateTo={navigateTo} />
    </div>
  );
}

export default App;
