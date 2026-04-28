import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Activity, BookOpen, Flame, Clock, X, Plus, Target, Zap, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const getSubjectColor = (subject, index) => {
  const s = subject.toLowerCase();
  if (s.includes('physic')) return '#00FFFF'; // Cyan
  if (s.includes('chemist')) return '#FF00FF'; // Magenta
  if (s.includes('biolog')) return '#39FF14'; // Lime
  if (s.includes('math')) return '#FF9900'; // Orange
  const fallbacks = ['#00FFFF', '#FF00FF', '#39FF14', '#FF9900', '#FF3366', '#B026FF'];
  return fallbacks[index % fallbacks.length];
};

const formatTime = (mins) => {
  if (!mins) return '0h 0m';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const AreaChart = ({ data }) => {
  const w = 400;
  const h = 100;
  const max = Math.max(...data.map(d => d.minutes), 60);
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d.minutes / max) * h;
    return { x, y };
  });

  const path = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const cp1x = a[i - 1].x + (p.x - a[i - 1].x) / 2;
    const cp1y = a[i - 1].y;
    const cp2x = a[i - 1].x + (p.x - a[i - 1].x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y}`;
  }, "");

  const areaPath = `${path} L ${w},${h} L 0,${h} Z`;

  return (
    <div className="area-chart-wrapper">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 242, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 242, 255, 0)" />
          </linearGradient>
        </defs>
        <motion.path 
          d={areaPath} 
          fill="url(#areaGradient)" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path 
          d={path} 
          fill="none" 
          stroke="#00f2ff" 
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

const RechartsDonut = ({ data }) => {
  const activeData = data.filter(d => d.minutes > 0);
  if (activeData.length === 0) {
    return (
      <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
        No data yet. Start studying!
      </div>
    );
  }
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central" 
        fontSize="11" 
        fontWeight="600" 
        letterSpacing="0.05em"
      >
        {activeData[index].subject} ({`${(percent * 100).toFixed(0)}%`})
      </text>
    );
  };

  const total = activeData.reduce((a, b) => a + b.minutes, 0);

  return (
    <div style={{ width: '100%', height: 320, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            stroke="none"
            paddingAngle={5}
            dataKey="minutes"
            label={renderCustomizedLabel}
            labelLine={{ stroke: '#555', strokeWidth: 1 }}
            isAnimationActive={true}
          >
            {activeData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getSubjectColor(entry.subject, index)} 
                style={{ filter: `drop-shadow(0 0 8px ${getSubjectColor(entry.subject, index)})` }} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '8px' }}
            itemStyle={{ color: 'white' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <span className="donut-total" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', display: 'block' }}>{formatTime(total)}</span>
        <span className="donut-label" style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '0.1em' }}>TOTAL</span>
      </div>
    </div>
  );
};

const SkillTrack = ({ data, index }) => {
  const color = getSubjectColor(data.subject, index);
  return (
    <div className="skill-item">
      <div className="skill-info">
        <div>
          <span className="skill-subject">{data.subject}</span>
          <span className="skill-rank">[{data.title}]</span>
        </div>
        <span className="skill-level" style={{ color }}>LVL {data.level}</span>
      </div>
      <div className="skill-progress-wrapper">
        <div className="skill-progress-bg" />
        <motion.div 
          className="skill-progress-fill glow-tip" 
          style={{ background: color, '--glow-color': color }}
          initial={{ width: 0 }}
          animate={{ width: `${data.progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
        />
      </div>
    </div>
  );
};

export function InsightLab() {
  const { getSkillTree, getHeatmapData, streak, totalMinutes, SUBJECTS, addSubject, removeSubject } = useAnalytics();
  const [newSub, setNewSub] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  
  const skillTree = getSkillTree();
  const heatmapData = getHeatmapData();
  const { getRadarData } = useAnalytics();
  const radarData = getRadarData();

  const todayMinutes = heatmapData[heatmapData.length - 1]?.minutes || 0;
  const thisWeekMinutes = heatmapData.slice(-7).reduce((a, b) => a + b.minutes, 0);
  const thisMonthMinutes = heatmapData.slice(-30).reduce((a, b) => a + b.minutes, 0);

  // GitHub Heatmap
  const heatmapCells = heatmapData.slice(-98); // 14 weeks

  return (
    <div className="insight-lab">
      <div className="insight-header">
        <h2 className="lab-title"><Activity size={24} color="var(--accent)" /> DASHBOARD</h2>
        <motion.div 
          className="streak-badge glow-urgent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <Flame size={16} color="#E11D48" />
          {streak} Day Streak
        </motion.div>
      </div>

      <div className="quick-stats-row">
        <div className="quick-stat">
          <div className="qs-value">{formatTime(todayMinutes)}</div>
          <div className="qs-label">TODAY</div>
        </div>
        <div className="quick-stat">
          <div className="qs-value">{formatTime(thisWeekMinutes)}</div>
          <div className="qs-label">THIS WEEK</div>
        </div>
        <div className="quick-stat">
          <div className="qs-value">{formatTime(thisMonthMinutes)}</div>
          <div className="qs-label">THIS MONTH</div>
        </div>
        <div className="quick-stat">
          <div className="qs-value">{formatTime(totalMinutes)}</div>
          <div className="qs-label">TOTAL</div>
        </div>
      </div>

      <div className="insight-section card-box">
        <div className="section-header-row">
          <h3 className="section-title"><BarChart3 size={18} /> FOCUS HISTORY (7 DAYS)</h3>
        </div>
        <AreaChart data={heatmapData.slice(-7)} />
      </div>

      <div className="insight-section card-box">
        <div className="section-header-row">
          <h3 className="section-title"><Clock size={18} /> FOCUS CONSISTENCY</h3>
        </div>
        <div className="github-heatmap">
          {heatmapCells.map((d, i) => {
            let bgColor = '#1a1a1a';
            let glow = 'none';
            if (d.minutes > 0 && d.minutes < 60) bgColor = 'rgba(0, 242, 255, 0.2)';
            else if (d.minutes >= 60 && d.minutes < 300) bgColor = 'rgba(0, 242, 255, 0.6)';
            else if (d.minutes >= 300) {
              bgColor = '#00f2ff';
              glow = '0 0 8px rgba(0,242,255,0.8)';
            }
            return (
              <div 
                key={i} 
                className="heatmap-cell" 
                style={{ background: bgColor, boxShadow: glow }}
                title={`${d.date}: ${d.minutes} mins`}
              />
            );
          })}
        </div>
      </div>

      <div className="insight-section card-box">
        <div className="section-header-row">
          <h3 className="section-title"><BookOpen size={18} /> SKILL TREE</h3>
        </div>
        <div className="skill-tree-container">
          {skillTree.map((subject, index) => (
            <SkillTrack key={subject.subject} data={subject} index={index} />
          ))}
        </div>
      </div>

      <div className="insight-section card-box">
        <div className="section-header-row">
          <h3 className="section-title"><PieChartIcon size={18} /> SUBJECT BALANCE</h3>
        </div>
        <RechartsDonut data={radarData} />
      </div>

      <div className="insight-section card-box">
        <div className="section-header-row">
          <h3 className="section-title"><BookOpen size={18} /> MANAGE SUBJECTS</h3>
          <button 
            className="btn-icon-small" 
            onClick={() => setShowAddSubject(!showAddSubject)}
          >
            {showAddSubject ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {showAddSubject && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={(e) => { e.preventDefault(); addSubject(newSub); setNewSub(''); setShowAddSubject(false); }}
              className="manage-sub-form"
            >
              <input 
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="Subject name..." 
                autoFocus
              />
              <button type="submit">ADD</button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="subject-chips">
          {SUBJECTS.map(s => (
            <div key={s} className="chip">
              {s} 
              <X size={14} className="chip-x" onClick={() => removeSubject(s)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
