import { useState, useEffect } from 'react';

const DEFAULT_PACKS = {
  sprint: { id: 'sprint', name: 'Sprint Pack', focus: 25 * 60, breakTime: 5 * 60, icon: '⚡', color: '#fb7185' },
  deepWork: { id: 'deepWork', name: 'Deep Work Pack', focus: 90 * 60, breakTime: 20 * 60, icon: '🧠', color: '#a78bfa' },
  review: { id: 'review', name: 'Review Pack', focus: 15 * 60, breakTime: 5 * 60, icon: '📖', color: '#5eead4' },
};

export function usePacks() {
  const [packs, setPacks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ff-packs-config'));
      if (saved) return saved;
    } catch {}
    return DEFAULT_PACKS;
  });

  const updatePack = (id, focusMins, breakMins) => {
    const fMins = Math.max(1, focusMins);
    const bMins = Math.max(1, breakMins);
    const newPacks = {
      ...packs,
      [id]: {
        ...packs[id],
        focus: fMins * 60,
        breakTime: bMins * 60,
      }
    };
    setPacks(newPacks);
    localStorage.setItem('ff-packs-config', JSON.stringify(newPacks));
  };

  return { packs, updatePack };
}
