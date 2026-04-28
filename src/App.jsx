import React, { useState, useEffect, useCallback } from 'react';
import { useTimer } from './hooks/useTimer';
import { usePacks } from './hooks/usePacks';
import { useAnalytics } from './hooks/useAnalytics';
import { getRandomActivity, getRandomFormula } from './data/breaks';
import { PackSelector } from './components/PackSelector';
import { Timer } from './components/Timer';
import { Controls } from './components/Controls';
import { Tasks } from './components/Tasks';
import { CommitmentModal } from './components/CommitmentModal';
import { BreakModal } from './components/BreakModal';
import { InsightLab } from './components/InsightLab';
import { EditPacks } from './components/EditPacks';
import { playBeep } from './utils/audio';
import { requestNotificationPermission, sendNotification } from './utils/notifications';
import { Timer as TimerIcon, BarChart2, Settings2 } from 'lucide-react';

// Helper to convert hex to RGB for the glow effect
function hexToRgba(hex, alpha) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(255, 255, 255, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

function App() {
  const [currentTab, setCurrentTab] = useState('timer'); // 'timer' | 'edit' | 'insights'
  const [showCommitment, setShowCommitment] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  
  const [activeGoal, setActiveGoal] = useState(null); // { text, subject }
  const [breakContent, setBreakContent] = useState({ activity: '', formula: null });
  
  const { logSession, SUBJECTS } = useAnalytics();
  const { packs, updatePack } = usePacks();

  const handleComplete = useCallback((completedPhase, packId) => {
    playBeep();
    sendNotification(completedPhase);
    
    if (completedPhase === 'focus') {
      if (activeGoal) {
        // Log the session (pack focus time is in seconds, convert to minutes)
        // Hardcoding to use the previous timer's focus length if we wanted to be perfectly accurate,
        // but for now we'll assume they completed the whole pack.
        const focusMins = packId === 'deepWork' ? 90 : (packId === 'sprint' ? 25 : 15);
        logSession(activeGoal.subject, focusMins, new Date().getHours());
      }
      
      // Prepare break content
      const formula = Math.random() > 0.5 ? getRandomFormula() : null;
      setBreakContent({ activity: getRandomActivity(), formula });
      setShowBreak(true);
      
    } else {
      // Break is over
      setActiveGoal(null); // Reset goal for next session
    }
  }, [activeGoal, logSession]);

  const {
    packId, setPackId, pack, phase, switchPhase, timeLeft, isRunning, start, pause, reset
  } = useTimer(packs, handleComplete);

  // Ghost Mode (Visibility detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && phase === 'focus') {
        sendNotification('ghostMode');
        // You could pause here: pause();
        // Or apply a penalty to the streak/session.
        console.log("GHOST MODE: Focus broken!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning, phase]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleStartRequest = () => {
    if (!activeGoal && phase === 'focus') {
      setShowCommitment(true);
    } else {
      start();
    }
  };

  const handleCommit = (goalText, subject) => {
    setActiveGoal({ text: goalText, subject });
    setShowCommitment(false);
    start();
  };

  return (
    <div className="app-container">
      <header className="top-header">
        <h1 className="app-title">{currentTab === 'timer' ? 'FOCUS' : currentTab === 'edit' ? 'PACKS' : 'INSIGHTS'}</h1>
      </header>

      <div className="glass-panel">
        {currentTab === 'timer' && (
          <>
            <PackSelector packs={packs} packId={packId} setPackId={setPackId} />
            
            {activeGoal && phase === 'focus' && (
              <div className="active-goal-display">
                <span className="goal-subject">{activeGoal.subject}</span>
                <span className="goal-text">{activeGoal.text}</span>
              </div>
            )}

            <div className="timer-group">
              <span className="timer-label">
                {phase === 'focus' ? 'FOCUS MODE' : 'BREAK MODE'}
              </span>
              <Timer timeLeft={timeLeft} />
            </div>
            
            <Controls 
              isRunning={isRunning} 
              start={handleStartRequest} 
              pause={pause} 
              reset={reset} 
            />

            <Tasks />
          </>
        )}

        {currentTab === 'edit' && (
          <EditPacks packs={packs} updatePack={updatePack} />
        )}

        {currentTab === 'insights' && (
          <InsightLab />
        )}
      </div>

      <nav className="bottom-nav">
        <button className={currentTab === 'timer' ? 'active' : ''} onClick={() => setCurrentTab('timer')}>
          <TimerIcon size={24} className="bottom-nav-icon" />
          <span>Timer</span>
        </button>
        <button className={currentTab === 'edit' ? 'active' : ''} onClick={() => setCurrentTab('edit')}>
          <Settings2 size={24} className="bottom-nav-icon" />
          <span>Packs</span>
        </button>
        <button className={currentTab === 'insights' ? 'active' : ''} onClick={() => setCurrentTab('insights')}>
          <BarChart2 size={24} className="bottom-nav-icon" />
          <span>Insights</span>
        </button>
      </nav>

      {showCommitment && (
        <CommitmentModal 
          packName={pack.name} 
          onCommit={handleCommit} 
          onCancel={() => setShowCommitment(false)}
          subjects={SUBJECTS} 
        />
      )}

      {showBreak && (
        <BreakModal 
          activity={breakContent.activity}
          formula={breakContent.formula}
          onStartFocus={() => {
            setShowBreak(false);
            switchPhase('focus');
            // Usually we'd ask for a new commitment, so we don't auto-start here
            setActiveGoal(null);
          }}
          onSkip={() => {
            setShowBreak(false);
            switchPhase('focus');
          }}
        />
      )}
    </div>
  );
}

export default App;
