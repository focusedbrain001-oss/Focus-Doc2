import React from 'react';

export function ModeToggle({ mode, setMode }) {
  const modes = [
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
  ];

  return (
    <div className="mode-toggle">
      {modes.map((m) => (
        <button
          key={m.id}
          className={mode === m.id ? 'active' : ''}
          onClick={() => setMode(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
