import { useState, useEffect } from 'react';

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    if (!text.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), text, completed: false }
    ]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const editTask = (id, newText) => {
    if (!newText.trim()) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  return { tasks, addTask, toggleTask, deleteTask, editTask };
}
