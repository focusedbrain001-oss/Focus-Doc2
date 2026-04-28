import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Check, Trash2, Edit2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask, editTask } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (tasks.length >= 4) {
      setToastMsg('Focus on these 4 first!');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask('');
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();
    editTask(id, editText);
    setEditingId(null);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className="tasks-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="tasks-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          <span>Progress</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="task-progress-bar" style={{ width: '100%', height: '6px', background: '#1a1a1a', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <motion.div layout className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '300px', flexGrow: 1, paddingBottom: '1rem' }}>
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div 
              key={task.id} 
              layout
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
              className="task-item"
              style={{ background: '#121212', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <div 
                  onClick={() => toggleTask(task.id)}
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    border: `2px solid ${task.completed ? 'var(--accent)' : '#555'}`,
                    background: task.completed ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer', 
                    flexShrink: 0, 
                    transition: 'all 0.3s ease' 
                  }}
                >
                  {task.completed && <Check size={16} color="#000" strokeWidth={3} />}
                </div>
                
                {editingId === task.id ? (
                  <form 
                    style={{ flex: 1, display: 'flex' }}
                    onSubmit={(e) => handleEditSubmit(e, task.id)}
                  >
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={(e) => handleEditSubmit(e, task.id)}
                      autoFocus
                      style={{
                        width: '100%', background: 'transparent', border: 'none', 
                        color: 'white', borderBottom: '1px solid var(--accent)', outline: 'none',
                        fontSize: '0.875rem'
                      }}
                    />
                  </form>
                ) : (
                  <span 
                    className={`task-text ${task.completed ? 'checked' : ''}`}
                    style={{ 
                      fontSize: '0.875rem', 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#888' : 'white',
                      opacity: task.completed ? 0.5 : 1,
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                      flex: 1,
                      wordBreak: 'break-word'
                    }}
                  >
                    {task.text}
                  </span>
                )}
              </div>

              <div className="task-actions">
                <button type="button" onClick={() => startEdit(task)}><Edit2 size={16} /></button>
                <button type="button" onClick={() => deleteTask(task.id)}><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="task-form-wrapper">
        <form className="task-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="What are you working on?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" aria-label="Add Task">
            <Plus size={20} />
          </button>
        </form>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -10, x: '-50%' }}
            style={{
              position: 'absolute',
              bottom: '90px',
              left: '50%',
              background: '#E11D48',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              zIndex: 50,
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)'
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
