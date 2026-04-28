import { useState, useEffect } from 'react';


function getLevelInfo(minutes) {
  const thresholds = [0, 60, 180, 360, 600, 900, 1260, 1680, 2160, 2700, 3300];
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (minutes >= thresholds[i]) level = i;
  }
  const next = thresholds[level + 1] || thresholds[thresholds.length - 1] + 600;
  const prev = thresholds[level];
  const progress = next > prev ? Math.round(((minutes - prev) / (next - prev)) * 100) : 100;
  return { level, progress, nextAt: next };
}

const LEVEL_TITLES = ['Novice', 'Apprentice', 'Student', 'Learner', 'Scholar', 'Expert', 'Master', 'Elite', 'Legend', 'Grandmaster', 'Prodigy'];

export function useAnalytics() {
  const [SUBJECTS, setSubjectsList] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ff-subjects'));
      if (saved && saved.length > 0) return saved;
    } catch {}
    return ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Other'];
  });

  const saveSubjects = (newSubs) => {
    setSubjectsList(newSubs);
    localStorage.setItem('ff-subjects', JSON.stringify(newSubs));
  };

  const addSubject = (sub) => {
    const cleanSub = sub.trim();
    if (cleanSub && !SUBJECTS.includes(cleanSub)) {
      saveSubjects([...SUBJECTS, cleanSub]);
    }
  };

  const removeSubject = (sub) => {
    if (SUBJECTS.length > 1) { // Prevent removing all subjects
      saveSubjects(SUBJECTS.filter(s => s !== sub));
    }
  };

  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff-analytics') || '{}'); } catch { return {}; }
  });

  const save = (d) => { setData(d); localStorage.setItem('ff-analytics', JSON.stringify(d)); };

  const logSession = (subject, durationMinutes, startHour) => {
    const today = new Date().toISOString().slice(0, 10);
    const updated = { ...data };

    // Heatmap
    updated.heatmap = updated.heatmap || {};
    updated.heatmap[today] = (updated.heatmap[today] || 0) + durationMinutes;

    // Subject totals
    updated.subjects = updated.subjects || {};
    updated.subjects[subject] = updated.subjects[subject] || { minutes: 0, sessions: 0, hourly: {} };
    updated.subjects[subject].minutes += durationMinutes;
    updated.subjects[subject].sessions += 1;
    updated.subjects[subject].hourly[startHour] = (updated.subjects[subject].hourly[startHour] || 0) + durationMinutes;

    // Streak
    updated.streak = updated.streak || { count: 0, lastDate: '' };
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (updated.streak.lastDate === yesterday) {
      updated.streak.count += 1;
    } else if (updated.streak.lastDate !== today) {
      updated.streak.count = 1;
    }
    updated.streak.lastDate = today;

    // Total minutes
    updated.totalMinutes = (updated.totalMinutes || 0) + durationMinutes;

    save(updated);
  };

  const getSkillTree = () => {
    const subjects = data.subjects || {};
    return SUBJECTS.map((s) => {
      const mins = subjects[s]?.minutes || 0;
      const info = getLevelInfo(mins);
      return { subject: s, minutes: mins, ...info, title: LEVEL_TITLES[info.level] || 'Novice' };
    });
  };

  const getHeatmapData = () => {
    const heatmap = data.heatmap || {};
    const result = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      result.push({ date: d, minutes: heatmap[d] || 0 });
    }
    return result;
  };

  const getPeakHours = (subject) => {
    const subjects = data.subjects || {};
    const s = subjects[subject];
    if (!s) return null;
    let best = { hour: null, minutes: 0 };
    for (const [h, m] of Object.entries(s.hourly || {})) {
      if (m > best.minutes) best = { hour: parseInt(h), minutes: m };
    }
    return best.hour !== null ? best : null;
  };

  const getRadarData = () => {
    const subjects = data.subjects || {};
    const total = Object.values(subjects).reduce((s, v) => s + (v.minutes || 0), 0);
    return SUBJECTS.map((s) => ({
      subject: s,
      minutes: subjects[s]?.minutes || 0,
      pct: total > 0 ? Math.round(((subjects[s]?.minutes || 0) / total) * 100) : 0,
    }));
  };

  return {
    data,
    logSession,
    getSkillTree,
    getHeatmapData,
    getPeakHours,
    getRadarData,
    streak: data.streak?.count || 0,
    totalMinutes: data.totalMinutes || 0,
    SUBJECTS,
    addSubject,
    removeSubject,
  };
}
