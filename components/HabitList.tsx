
import React, { useState, useMemo } from 'react';
import { Habit, HabitLog, Frequency } from '../types';
import { HABIT_COLORS, FREQUENCY_OPTIONS } from '../constants';
import { Plus, X, Trash2, TrendingUp, Calendar, Zap } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  logs: HabitLog[];
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onToggleLog: (id: string, date: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, logs, onAddHabit, onDeleteHabit, onToggleLog }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    color: HABIT_COLORS[0],
    frequency: 'daily' as Frequency,
    reminderTime: '08:00'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name) return;
    
    onAddHabit({
      ...newHabit,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    });
    setNewHabit({
      name: '',
      color: HABIT_COLORS[0],
      frequency: 'daily',
      reminderTime: '08:00'
    });
    setIsAdding(false);
  };

  const getHabitStats = (habitId: string) => {
    const habitLogs = logs.filter(l => l.habitId === habitId);
    const total = habitLogs.length;
    
    // Very basic streak logic
    let currentStreak = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (logs.find(l => l.habitId === habitId && l.date === dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { total, currentStreak };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Habit Collection</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-teal-600 rounded-full hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/20"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-md glass bg-[#151515] rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Habit</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 block">Habit Name</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g., Morning Meditation"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500 transition-all"
                  value={newHabit.name}
                  onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 block">Appearance</label>
                <div className="flex flex-wrap gap-3">
                  {HABIT_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewHabit({ ...newHabit, color: c })}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${newHabit.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 block">Frequency</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none"
                    value={newHabit.frequency}
                    onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value as Frequency })}
                  >
                    {FREQUENCY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-[#151515]">{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 block">Reminder</label>
                  <input 
                    type="time"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none"
                    value={newHabit.reminderTime}
                    onChange={e => setNewHabit({ ...newHabit, reminderTime: e.target.value })}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 teal-gradient rounded-2xl font-bold text-lg hover:brightness-110 transition-all"
              >
                Forging Ritual
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {habits.map(habit => {
          const stats = getHabitStats(habit.id);
          return (
            <div key={habit.id} className="glass rounded-3xl p-5 border-white/5 group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${habit.color}20` }}>
                    <Zap size={24} style={{ color: habit.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{habit.name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{habit.frequency} Target</p>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <TrendingUp size={16} className="mx-auto mb-1 text-teal-400" />
                  <div className="text-sm font-bold">{stats.currentStreak}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Streak</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <Calendar size={16} className="mx-auto mb-1 text-amber-400" />
                  <div className="text-sm font-bold">{stats.total}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Total</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <div className="w-4 h-4 mx-auto mb-1 rounded-full border-2 border-slate-600" />
                  <div className="text-sm font-bold">85%</div>
                  <div className="text-[10px] text-slate-500 uppercase">Success</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitList;
