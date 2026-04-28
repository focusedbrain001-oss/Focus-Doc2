import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function Controls({ isRunning, start, pause, reset }) {
  return (
    <div className="controls">
      <button 
        className="btn-secondary" 
        onClick={reset} 
        aria-label="Reset Timer"
        title="Reset"
      >
        <RotateCcw size={20} />
      </button>
      
      {isRunning ? (
        <button 
          className="btn-primary" 
          onClick={pause}
          aria-label="Pause Timer"
          title="Pause"
        >
          <Pause size={28} fill="currentColor" />
        </button>
      ) : (
        <button 
          className="btn-primary" 
          onClick={start}
          aria-label="Start Timer"
          title="Start"
        >
          <Play size={28} fill="currentColor" className="translate-x-0.5" />
        </button>
      )}
    </div>
  );
}
