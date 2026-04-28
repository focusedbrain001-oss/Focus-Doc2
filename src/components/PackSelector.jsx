import React from 'react';

export function PackSelector({ packs, packId, setPackId }) {
  if (!packs) return null; // Safe guard
  return (
    <div className="pack-selector">
      {Object.values(packs).map((pack) => (
        <button
          key={pack.id}
          className={`pack-card ${packId === pack.id ? 'active' : ''}`}
          onClick={() => setPackId(pack.id)}
        >
          <span className="pack-icon">{pack.icon}</span>
          <span className="pack-name">{pack.name.replace(' Pack', '')}</span>
          <span className="pack-timing-badge">
            {Math.floor(pack.focus / 60)}/{Math.floor(pack.breakTime / 60)}
          </span>
        </button>
      ))}
    </div>
  );
}
