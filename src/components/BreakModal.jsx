import React from 'react';

export function BreakModal({ activity, formula, onStartFocus, onSkip }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box break-modal">
        <div className="break-icon">☕</div>
        <h2 className="modal-title">Break Time!</h2>
        <p className="modal-subtitle">Great work. Give your brain a proper rest.</p>

        <div className="break-activity-card">
          <div className="break-activity-label">✨ Suggested Activity</div>
          <div className="break-activity-text">{activity}</div>
        </div>

        {formula && (
          <div className="formula-card">
            <div className="formula-label">💡 {formula.subject} Fact</div>
            <div className="formula-text">{formula.content}</div>
          </div>
        )}

        <div className="break-actions">
          <button className="btn-break-start" onClick={onStartFocus}>
            ▶ Start Next Focus
          </button>
          <button className="btn-break-skip" onClick={onSkip}>
            Skip Break
          </button>
        </div>
      </div>
    </div>
  );
}
