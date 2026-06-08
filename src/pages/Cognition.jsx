import React from 'react';
import { Target } from 'lucide-react';

export default function Cognition() {
  return (
    <div className="fade-in container section">
      {/* Page Header */}
      <div className="cognition-intro" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          成长与心智模型
        </h1>
        <p>
          “心智模型”是我们大脑理解世界、进行决策的运行轨道。查理·芒格提倡构建跨学科的“格栅模型”，记录个人的成长思考与认知升级过程。
        </p>
      </div>

      {/* Empty State */}
      <div 
        className="glass" 
        style={{ 
          padding: '80px 20px', 
          textAlign: 'center', 
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <Target size={40} style={{ color: 'var(--text-muted)' }} />
        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>暂无认知模型记录</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.5 }}>
          记录您在阅读、思考、复盘中沉淀的核心思维模型。您可以随时在此记录、沉淀和重构您的心智模型格栅。
        </p>
      </div>
    </div>
  );
}
