import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, DollarSign, Percent, TrendingUp, HelpCircle } from 'lucide-react';
import tradesData from '../data/trades.json';

export default function Trading() {
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedTradeId, setExpandedTradeId] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Chronological sort of trades for the equity curve
  const chronoTrades = useMemo(() => {
    return [...tradesData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  // Calculate Equity Curve points
  const equityPoints = useMemo(() => {
    let currentBalance = 10000;
    const points = [{ balance: currentBalance, date: 'Start', symbol: '初始资金', pnl: 0 }];
    
    chronoTrades.forEach(trade => {
      currentBalance += trade.pnl;
      points.push({
        balance: currentBalance,
        date: trade.date,
        symbol: trade.symbol,
        pnl: trade.pnl
      });
    });
    return points;
  }, [chronoTrades]);

  // SVG Chart Scaling
  const chartWidth = 900;
  const chartHeight = 250;
  const padding = { top: 30, right: 30, bottom: 30, left: 60 };

  const chartScale = useMemo(() => {
    const balances = equityPoints.map(p => p.balance);
    const maxVal = Math.max(...balances) * 1.05; // 5% padding top
    const minVal = Math.min(...balances) * 0.95; // 5% padding bottom
    
    const scaleX = (index) => padding.left + (index / (equityPoints.length - 1)) * (chartWidth - padding.left - padding.right);
    const scaleY = (val) => chartHeight - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padding.top - padding.bottom);
    
    return { scaleX, scaleY, maxVal, minVal };
  }, [equityPoints]);

  // Generate SVG path strings
  const { linePath, areaPath, svgPoints } = useMemo(() => {
    const pts = equityPoints.map((pt, i) => ({
      x: chartScale.scaleX(i),
      y: chartScale.scaleY(pt.balance),
      pt
    }));

    if (pts.length === 0) return { linePath: '', areaPath: '', svgPoints: [] };

    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const area = `${line} L ${pts[pts.length - 1].x} ${chartHeight - padding.bottom} L ${pts[0].x} ${chartHeight - padding.bottom} Z`;

    return { linePath: line, areaPath: area, svgPoints: pts };
  }, [equityPoints, chartScale]);

  // Calculate KPI stats
  const stats = useMemo(() => {
    const total = tradesData.length;
    const wins = tradesData.filter(t => t.outcome === 'Win').length;
    const losses = total - wins;
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0';
    
    const grossProfit = tradesData.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(tradesData.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit.toFixed(2);
    
    const netProfit = grossProfit - grossLoss;
    const avgTrade = total > 0 ? (netProfit / total).toFixed(1) : '0';

    return { total, wins, losses, winRate, profitFactor, netProfit, avgTrade };
  }, []);

  // Filter and Sort trades for the table
  const processedTrades = useMemo(() => {
    return [...tradesData]
      .filter((trade) => {
        const matchesSearch = 
          trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trade.setup.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDirection = directionFilter === 'all' || trade.direction === directionFilter;
        const matchesOutcome = outcomeFilter === 'all' || trade.outcome === outcomeFilter;
        
        return matchesSearch && matchesDirection && matchesOutcome;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        if (sortField === 'date') {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [searchQuery, directionFilter, outcomeFilter, sortField, sortDirection]);

  // Toggle Table Sort order
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="fade-in container section">
      {/* Page Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '12px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          交易复盘看板
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          实盘交易复盘记录。通过量化指标、资金曲线和交易日志，反思操作漏洞，迭代交易策略。
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="trading-dashboard">
        <div className="glass kpi-card">
          <div className="kpi-label">净盈亏 (Net PnL)</div>
          <div className={`kpi-value ${stats.netProfit >= 0 ? 'pnl-badge win' : 'pnl-badge loss'}`} style={{ fontSize: '1.75rem' }}>
            {stats.netProfit >= 0 ? '+' : ''}${stats.netProfit}
          </div>
          <div className={`kpi-trend ${stats.netProfit >= 0 ? 'positive' : 'negative'}`}>
            <TrendingUp size={14} /> 初始资金: $10,000
          </div>
        </div>

        <div className="glass kpi-card">
          <div className="kpi-label">胜率 (Win Rate)</div>
          <div className="kpi-value" style={{ color: 'var(--text-primary)' }}>{stats.winRate}%</div>
          <div className="kpi-trend positive">
            {stats.wins} 赢 / {stats.losses} 输
          </div>
        </div>

        <div className="glass kpi-card">
          <div className="kpi-label">盈亏比 (Profit Factor)</div>
          <div className="kpi-value" style={{ color: 'var(--text-primary)' }}>{stats.profitFactor}</div>
          <div className="kpi-trend positive" style={{ color: 'var(--text-muted)' }}>
            总盈利 / 总亏损
          </div>
        </div>

        <div className="glass kpi-card">
          <div className="kpi-label">每笔均收 (Avg Trade)</div>
          <div className={`kpi-value ${stats.avgTrade >= 0 ? 'pnl-badge win' : 'pnl-badge loss'}`} style={{ fontSize: '1.75rem' }}>
            {stats.avgTrade >= 0 ? '+' : ''}${stats.avgTrade}
          </div>
          <div className="kpi-trend" style={{ color: 'var(--text-muted)' }}>
            共交易 {stats.total} 笔
          </div>
        </div>
      </div>

      {/* Equity Curve SVG Chart */}
      <div className="glass chart-card">
        <div className="chart-header">
          <h3 className="sidebar-title" style={{ margin: 0 }}>资金变动曲线 (Equity Curve)</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={12} /> 鼠标悬停查看单笔交易净值
          </span>
        </div>

        <div className="chart-container">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
            <defs>
              <linearGradient id="equity-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const yVal = chartScale.minVal + ratio * (chartScale.maxVal - chartScale.minVal);
              const y = chartScale.scaleY(yVal);
              return (
                <g key={i}>
                  <line 
                    className="equity-chart-grid" 
                    x1={padding.left} 
                    y1={y} 
                    x2={chartWidth - padding.right} 
                    y2={y} 
                  />
                  <text 
                    className="chart-axis-text" 
                    x={padding.left - 10} 
                    y={y + 4} 
                    textAnchor="end"
                  >
                    ${Math.round(yVal)}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#equity-gradient)" />

            {/* Line Chart */}
            <path d={linePath} className="equity-chart-line" />

            {/* Points on Line */}
            {svgPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredPoint && hoveredPoint.index === i ? 6 : 3}
                fill={i === 0 ? 'var(--text-muted)' : (p.pt.pnl >= 0 ? 'var(--cat-life)' : '#ef4444')}
                stroke="var(--bg-primary)"
                strokeWidth={2}
                onMouseEnter={() => setHoveredPoint({ ...p.pt, index: i, x: p.x, y: p.y })}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer', transition: 'r 0.1s' }}
              />
            ))}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div 
              className="chart-tooltip" 
              style={{
                display: 'block',
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                top: `${(hoveredPoint.y / chartHeight) * 100 - 32}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: 10,
              }}
            >
              <div style={{ fontWeight: 600 }}>{hoveredPoint.symbol}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{hoveredPoint.date}</div>
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '4px', paddingTop: '4px' }}>
                账户余额: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${hoveredPoint.balance}</span>
              </div>
              {hoveredPoint.pnl !== 0 && (
                <div style={{ color: hoveredPoint.pnl > 0 ? 'var(--cat-life)' : '#ef4444' }}>
                  PnL: {hoveredPoint.pnl > 0 ? '+' : ''}${hoveredPoint.pnl}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trade Log List Card */}
      <div className="glass trade-log-card">
        <div className="chart-header" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 className="sidebar-title" style={{ margin: 0 }}>交易日志</h3>
          
          {/* Table Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', maxWidth: '700px', justifyContent: 'flex-end' }}>
            {/* Search Bar */}
            <div className="search-wrapper" style={{ maxWidth: '200px' }}>
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="搜索标的/设置..."
                className="search-input"
                style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Direction Selector */}
            <select
              className="glass"
              style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
            >
              <option value="all">方向: 全部</option>
              <option value="做多">做多</option>
              <option value="做空">做空</option>
            </select>

            {/* Outcome Selector */}
            <select
              className="glass"
              style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
            >
              <option value="all">盈亏: 全部</option>
              <option value="Win">盈利 (Win)</option>
              <option value="Loss">亏损 (Loss)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-wrapper">
          {processedTrades.length > 0 ? (
            <table className="trade-table">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                    交易日期 {sortField === 'date' ? (sortDirection === 'asc' ? <ChevronUp size={14} style={{ display: 'inline' }} /> : <ChevronDown size={14} style={{ display: 'inline' }} />) : ''}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('symbol')}>
                    交易标的 {sortField === 'symbol' ? (sortDirection === 'asc' ? <ChevronUp size={14} style={{ display: 'inline' }} /> : <ChevronDown size={14} style={{ display: 'inline' }} />) : ''}
                  </th>
                  <th>方向</th>
                  <th>入场/出场</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('pnl')}>
                    净盈亏 {sortField === 'pnl' ? (sortDirection === 'asc' ? <ChevronUp size={14} style={{ display: 'inline' }} /> : <ChevronDown size={14} style={{ display: 'inline' }} />) : ''}
                  </th>
                  <th>交易设置 (Setup)</th>
                  <th>复盘明细</th>
                </tr>
              </thead>
              <tbody>
                {processedTrades.map((trade) => {
                  const isExpanded = expandedTradeId === trade.id;
                  return (
                    <React.Fragment key={trade.id}>
                      <tr 
                        onClick={() => setExpandedTradeId(isExpanded ? null : trade.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{trade.date}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{trade.symbol}</td>
                        <td>
                          <span style={{ color: trade.direction === '做多' ? 'var(--cat-life)' : 'var(--cat-trading)' }}>
                            {trade.direction}
                          </span>
                        </td>
                        <td>{trade.entry} / {trade.exit}</td>
                        <td>
                          <span className={`pnl-badge ${trade.outcome === 'Win' ? 'win' : 'loss'}`}>
                            {trade.pnl > 0 ? '+' : ''}{trade.pnl} ({trade.pnlPercent}%)
                          </span>
                        </td>
                        <td>{trade.setup}</td>
                        <td>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px', borderRadius: '4px' }}
                          >
                            {isExpanded ? '折叠' : '展开'} 
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" style={{ padding: '16px', background: 'rgba(var(--color-primary-rgb), 0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                                复盘记录反思：
                              </p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {trade.notes}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              没有找到匹配的交易记录
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
