'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Plus, Trash2, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function PomodoroTimerView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [mode, setMode] = useState<TimerMode>('work');
  const [workDuration] = useState(25);
  const [shortBreakDuration] = useState(5);
  const [longBreakDuration] = useState(15);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Complete high-priority code review', completed: false },
    { id: '2', text: 'Write technical documentation draft', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playBeep = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // AudioContext muted or unsupported
    }
  }, [soundEnabled]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') setTimeLeft(workDuration * 60);
    else if (newMode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
    else if (newMode === 'longBreak') setTimeLeft(longBreakDuration * 60);
  };

  // Timer countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playBeep();
            if (mode === 'work') {
              setCompletedSessions((s) => s + 1);
              setMode('shortBreak');
              return shortBreakDuration * 60;
            } else {
              setMode('work');
              return workDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, playBeep, shortBreakDuration, workDuration]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
    if (!isRunning) {
      recordToolUse(tool);
      trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'start_pomodoro' });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') setTimeLeft(workDuration * 60);
    else if (mode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
    else if (mode === 'longBreak') setTimeLeft(longBreakDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTimeForCurrentMode =
    mode === 'work'
      ? workDuration * 60
      : mode === 'shortBreak'
      ? shortBreakDuration * 60
      : longBreakDuration * 60;

  const progressPercent = Math.min(100, Math.max(0, ((totalTimeForCurrentMode - timeLeft) / totalTimeForCurrentMode) * 100));

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode selectors */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-900/80 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl gap-1">
          <button
            onClick={() => switchMode('work')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'work'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Focus Work (25m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'longBreak'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Long Break (15m)
          </button>
        </div>
      </div>

      {/* Main Circular / Display Card */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center overflow-hidden">
        <div
          className={`absolute inset-0 opacity-10 pointer-events-none transition-colors duration-500 ${
            mode === 'work' ? 'bg-cyan-500' : mode === 'shortBreak' ? 'bg-emerald-500' : 'bg-indigo-500'
          }`}
        />

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
            {mode === 'work' ? 'Focus Session' : mode === 'shortBreak' ? 'Rest & Recharge' : 'Extended Rest'}
          </span>

          <div className="text-7xl sm:text-9xl font-black tracking-tighter font-mono text-white select-none py-2">
            {formatTime(timeLeft)}
          </div>

          <div className="w-64 sm:w-80 h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                mode === 'work' ? 'bg-cyan-400' : mode === 'shortBreak' ? 'bg-emerald-400' : 'bg-indigo-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-xl ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3.5 rounded-2xl border transition-colors ${
                soundEnabled
                  ? 'bg-slate-800 border-slate-700 text-cyan-400'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Audio alerts active' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Completed Sessions: <strong className="text-white font-mono">{completedSessions}</strong>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-emerald-400" />
              Total Focus: <strong className="text-white font-mono">{completedSessions * workDuration}m</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Task Checklist Panel */}
      <div className="p-6 bg-slate-900/50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          Focus Session Task List
        </h3>

        <form onSubmit={addTask} className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a task to accomplish during this session..."
            className="flex-1 px-4 py-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        <div className="space-y-2 pt-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-slate-900/30 border-slate-800/40 opacity-60 line-through text-slate-500'
                  : 'bg-[#0D0F13] border-slate-800 text-slate-200'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 text-left text-xs flex-1 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    task.completed ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-600'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span>{task.text}</span>
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
