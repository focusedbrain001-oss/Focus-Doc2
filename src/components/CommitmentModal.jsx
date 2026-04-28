import React, { useState } from 'react';
import { X } from 'lucide-react';

export function CommitmentModal({ packName, onCommit, onCancel, subjects }) {
  const [goal, setGoal] = useState('');
  const [subject, setSubject] = useState(subjects[0] || 'Other');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal.trim().length >= 5) {
      onCommit(goal.trim(), subject);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}><X size={18} /></button>
        <div className="modal-icon">🎯</div>
        <h2 className="modal-title">Commitment Contract</h2>
        <p className="modal-subtitle">
          Starting <strong>{packName}</strong>. Define your goal to lock in your focus.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="modal-label">What subject are you studying?</label>
          <div className="subject-chips">
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${subject === s ? 'active' : ''}`}
                onClick={() => setSubject(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <label className="modal-label">
            I will&nbsp;<span className="accent-text">specifically</span>...
          </label>
          <textarea
            className="modal-textarea"
            placeholder='e.g. "Complete 15 Organic Chemistry mechanisms from Chapter 6"'
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            autoFocus
          />
          <p className="modal-hint">Minimum 5 characters. Be specific.</p>

          <button
            className="modal-submit"
            type="submit"
            disabled={goal.trim().length < 5}
          >
            🔒 Lock In &amp; Start Session
          </button>
        </form>
      </div>
    </div>
  );
}
