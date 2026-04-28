import React from 'react';
import { Settings2 } from 'lucide-react';

export function EditPacks({ packs, updatePack }) {
  return (
    <div className="edit-packs-page insight-lab">
      <div className="insight-header">
        <h2 className="lab-title"><Settings2 size={24} color="var(--accent)" /> EDIT PACKS</h2>
      </div>
      <div className="packs-list">
        {Object.values(packs).map(pack => (
          <div key={pack.id} className="edit-pack-card card-box" style={{ marginBottom: '1rem' }}>
            <div className="ep-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="ep-icon" style={{ fontSize: '1.5rem' }}>{pack.icon}</span>
              <span className="ep-name" style={{ fontWeight: '700', fontSize: '1.1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{pack.name}</span>
            </div>
            <div className="ep-inputs" style={{ display: 'flex', gap: '1rem' }}>
              <div className="ep-input-group" style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>FOCUS (MIN)</label>
                <input 
                  type="number" 
                  value={Math.floor(pack.focus / 60)} 
                  onChange={(e) => updatePack(pack.id, Number(e.target.value), Math.floor(pack.breakTime / 60))}
                  style={{ width: '100%', background: '#121212', border: '1px solid #222', borderRadius: '8px', padding: '0.75rem', color: 'white', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <div className="ep-input-group" style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>BREAK (MIN)</label>
                <input 
                  type="number" 
                  value={Math.floor(pack.breakTime / 60)} 
                  onChange={(e) => updatePack(pack.id, Math.floor(pack.focus / 60), Number(e.target.value))}
                  style={{ width: '100%', background: '#121212', border: '1px solid #222', borderRadius: '8px', padding: '0.75rem', color: 'white', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
