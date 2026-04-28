import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(packs, onComplete) {
  const getInitialPack = () => {
    const saved = localStorage.getItem('ff-pack');
    return packs[saved] ? saved : 'sprint';
  };

  const [packId, setPackIdState] = useState(getInitialPack);
  const [phase, setPhase] = useState('focus'); // 'focus' | 'break'
  
  // Initialize time left from packs safely
  const [timeLeft, setTimeLeft] = useState(() => {
    const initial = getInitialPack();
    return packs[initial] ? packs[initial].focus : 25 * 60;
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const expectedEndTimeRef = useRef(null);

  const pack = packs[packId] || packs['sprint'];

  // Update timeLeft if the pack settings change while stopped
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(phase === 'focus' ? pack.focus : pack.breakTime);
    }
  }, [pack.focus, pack.breakTime]); // Depend on the specific durations

  const setPackId = useCallback((id) => {
    if (!packs[id]) return;
    setPackIdState(id);
    setPhase('focus');
    setTimeLeft(packs[id].focus);
    setIsRunning(false);
    expectedEndTimeRef.current = null;
    localStorage.setItem('ff-pack', id);
  }, [packs]);

  const start = useCallback(() => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      expectedEndTimeRef.current = Date.now() + timeLeft * 1000;
    }
  }, [isRunning, timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
    expectedEndTimeRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhase('focus');
    setTimeLeft(pack.focus);
    expectedEndTimeRef.current = null;
  }, [pack]);

  const switchPhase = useCallback((nextPhase) => {
    setPhase(nextPhase);
    setIsRunning(false);
    setTimeLeft(nextPhase === 'focus' ? pack.focus : pack.breakTime);
    expectedEndTimeRef.current = null;
  }, [pack]);

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expectedEndTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(intervalId);
        setIsRunning(false);
        expectedEndTimeRef.current = null;
        if (onComplete) onComplete(phase, packId);
      }
    }, 200);
    return () => clearInterval(intervalId);
  }, [isRunning, phase, packId, onComplete]);

  return { packId, setPackId, pack, phase, switchPhase, timeLeft, isRunning, start, pause, reset };
}
