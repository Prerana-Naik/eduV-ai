import { useState, useEffect } from 'react';

interface PersistedThread {
  id: string;
  title: string;
  type: 'student' | 'teacher';
  createdAt: number;
  updatedAt: number;
}

export const usePersistedThreads = () => {
  const [threads, setThreads] = useState<PersistedThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chat_threads');
    const savedActive = localStorage.getItem('active_thread_id');
    if (saved) {
      try {
        setThreads(JSON.parse(saved));
      } catch {
        console.error('Invalid stored threads');
      }
    }
    if (savedActive) setActiveThreadId(savedActive);
  }, []);

  // Persist threads whenever they change
  useEffect(() => {
    localStorage.setItem('chat_threads', JSON.stringify(threads));
  }, [threads]);

  // Persist active thread
  useEffect(() => {
    if (activeThreadId) {
      localStorage.setItem('active_thread_id', activeThreadId);
    }
  }, [activeThreadId]);

  // Create a new thread
  const createThread = (type: 'student' | 'teacher' = 'student') => {
    const now = Date.now();
    const newThread: PersistedThread = {
      id: `thread_${now}_${Math.random().toString(36).slice(2)}`,
      title: 'New Chat',
      type,
      createdAt: now,
      updatedAt: now
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    return newThread;
  };

  // Switch active thread
  const switchThread = (id: string) => {
    setActiveThreadId(id);
  };

  // Archive (remove) a thread
  const archiveThread = (id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  return {
    threads,
    activeThreadId,
    createThread,
    switchThread,
    archiveThread
  };
};
