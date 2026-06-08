import React, { useState } from 'react';
import { Layers, TrendingUp, GitMerge, Target, ShieldCheck, Scissors, HelpCircle } from 'lucide-react';

export default function Cognition() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleCardFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const mentalModels = [
    {
      id: 'first-principles',
      num: '01',
      title: '第一性原理',
      engTitle: 'First Principles',
      icon: Layers,
      summary: '剥离事物表象，推演至最基础的物理事实，再由此向上重构。',
      detail: '不要做“类比推理”（别人怎么做，我就怎么做），而是要将问题拆解到最底层的基本事实（即无法再被推导的真理），然后从头构建解决方案。在编程中，它是掌握底层原理而非流于API；在交易中，它是理解筹码分布与资金博弈的本源。',
      quote: '“物理学教我们从第一性原理开始推理，而不是通过类比。” —— 埃隆·马斯克',
    },
    {
      id: 'compounding',
      num: '02',
      title: '复利效应',
      engTitle: 'Compounding Effect',
      icon: TrendingUp,
      summary: '微小的增长通过时间的累积，产生指数级的巨大爆发力。',
      detail: '无论是资金、知识还是习惯，只要能维持正向增长，时间都会成为你最强大的战友。每天进步 1%，一年后你将变强 37 倍。相反，微小的退步也会将你的价值归零。交易中追求可持续的复利，远胜于冒险暴利。',
      quote: '“复利是世界第八大奇迹。知之者赚，不知之者输。” —— 阿尔伯特·爱因斯坦',
    },
    {
      id: 'second-order',
      num: '03',
      title: '二阶思考',
      engTitle: 'Second-Order Thinking',
      icon: GitMerge,
      summary: '越过眼前的直接后果，推演决策在未来引发的连锁反应。',
      detail: '一阶思考关注快速的、直接的反应（“因为A，所以B”）。二阶思考追问“然后呢？”（“如果B发生，会有什么连锁反应C和D？”）。在市场交易中，大众往往停留在一步，而成功的交易者则思考政策/数据发布后的二阶供求变化。',
      quote: '“不能进行二阶思考是造成许多商业与人生决策灾难的主因。” —— 霍华德·马克斯',
    },
    {
      id: 'circle-competence',
      num: '04',
      title: '认知圈法则',
      engTitle: 'Circle of Competence',
      icon: Target,
      summary: '明确界定自己懂什么和不懂什么，并严格在自己懂的领域内行动。',
      detail: '最重要的不是你的认知圈有多大，而是你是否能够诚实地划定它的边界。只在自己具有核心优势和深厚理解的领域（资产、技术或行业）做出决策和下注。对于认知圈之外的机会，保持敬畏并果断放弃。',
      quote: '“如果你知道了自己能力的边界，你就会比那些能力圈比你大5倍但不知道边界的人要富有得多。” —— 查理·芒格',
    },
    {
      id: 'margin-safety',
      num: '05',
      title: '安全边际',
      engTitle: 'Margin of Safety',
      icon: ShieldCheck,
      summary: '在预测与执行中预留冗余空间，以抵御未知风险和不可抗力。',
      detail: '人类对未来的预测总是存在偏差。无论是设计大桥的承重能力，还是设定交易的止损距离，都需要预留超出预期的安全边界。有了安全边际，即使出现最坏的意外情况，系统依然不会彻底崩溃，你依然有牌可打。',
      quote: '“安全边际的目的是使预测变得不再必要。” —— 本杰明·格雷厄姆',
    },
    {
      id: 'occams-razor',
      num: '06',
      title: '奥卡姆剃刀',
      engTitle: 'Occam\'s Razor',
      icon: Scissors,
      summary: '若无必要，勿增实体。在多个能解释现象的假设中，选择最简单的那个。',
      detail: '复杂的解释通常意味着更多的假设和更高几率的系统漏洞。在设计代码架构时，保持简单（KISS原则）更容易维护；在构建交易系统时，精简指标、聚焦核心信号往往比堆砌几十个指标更能有效盈利。',
      quote: '“万事万物都应尽可能简单，但不能过于简单。” —— 阿尔伯特·爱因斯坦',
    }
  ];

  return (
    <div className="fade-in container section">
      {/* Page Header */}
      <div className="cognition-intro">
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          成长与心智模型
        </h1>
        <p>
          “心智模型”是我们大脑理解世界、进行决策的运行轨道。查理·芒格提倡构建跨学科的“格栅模型”，本文精选了我个人最为推崇并在生活、编程和交易中反复实践的核心心智法则。
        </p>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {mentalModels.map((model) => {
          const Icon = model.icon;
          const isFlipped = !!flippedCards[model.id];
          return (
            <div 
              key={model.id} 
              className={`flip-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => toggleCardFlip(model.id)}
            >
              <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className="card-num">{model.num}</span>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mental Model</span>
                  </div>
                  
                  <div>
                    <div className="card-front-icon">
                      <Icon size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="card-front-title">{model.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {model.engTitle}
                    </p>
                  </div>
                  
                  <div className="card-front-tip">
                    <HelpCircle size={14} /> 点击翻转查看释义
                  </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back">
                  <div className="card-back-title">{model.title}</div>
                  <div className="card-back-content">
                    <p>{model.detail}</p>
                    <div className="card-back-quote">
                      {model.quote}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '10px' }}>
                    再次点击翻回正页
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Reading block */}
      <div className="glass" style={{ marginTop: '60px', padding: '30px 40px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
        <div 
          className="logo-icon" 
          style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))', display: 'flex', alignItems: 'center', justify: 'center' }}
        >
          <Target size={30} style={{ color: '#ffffff' }} />
        </div>
        <div style={{ flexGrow: 1, minWidth: '280px' }}>
          <h3 className="cat-title" style={{ marginBottom: '6px' }}>构建自己的格栅心智网络</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            心智模型的数量和丰富程度，直接决定了你解决未知难题的能力。推荐阅读《穷查理宝典》、《系统之美》、《黑天鹅》以及《原则》，作为构建系统思维的起步基石。
          </p>
        </div>
      </div>
    </div>
  );
}
