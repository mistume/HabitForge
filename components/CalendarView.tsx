
import React, { useState, useMemo } from 'react';
import { Habit, HabitLog, PlannerEvent } from '../types';
import { ChevronDown, Info } from 'lucide-react';

interface CalendarViewProps {
  habits: Habit[];
  logs: HabitLog[];
  events: PlannerEvent[];
  onAddEvent: (event: PlannerEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ habits, logs, events, onAddEvent }) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string | 'all'>(habits[0]?.id || 'all');

  const daysOfYear = useMemo(() => {
    const days = [];
    const date = new Date(new Date().getFullYear(), 0, 1);
    while (date.getFullYear() === new Date().getFullYear()) {
      days.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, []);

  const getHeatmapColor = (date: string) => {
    const dailyLogs = logs.filter(l => l.date === date);
    if (selectedHabitId === 'all') {
      const count = dailyLogs.length;
      if (count === 0) return 'bg-white/5';
      if (count < 2) return 'bg-teal-900';
      if (count < 4) return 'bg-teal-700';
      return 'bg-teal-500';
    } else {
      const completed = dailyLogs.some(l => l.habitId === selectedHabitId);
      return completed ? 'bg-teal-500' : 'bg-white/5';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div className="relative group">
          <button className="flex items-center gap-2 glass px-4 py-2 rounded-2xl border-white/10 hover:border-white/20 transition-all">
            <span className="font-semibold">
              {selectedHabitId === 'all' ? 'All Habits' : habits.find(h => h.id === selectedHabitId)?.name}
            </span>
            <ChevronDown size={16} />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 glass bg-[#1a1a1a] rounded-2xl p-2 hidden group-hover:block z-50 border border-white/10 shadow-2xl">
            <button 
              onClick={() => setSelectedHabitId('all')}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm"
            >
              All Habits
            </button>
            {habits.map(h => (
              <button 
                key={h.id}
                onClick={() => setSelectedHabitId(h.id)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm"
              >
                {h.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs uppercase tracking-widest font-bold">{new Date().getFullYear()} Summary</span>
          <Info size={14} />
        </div>
      </div>

      <div className="glass rounded-3xl p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-slate-400">Activity Heatmap</h3>
        <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[600px]">
          {daysOfYear.map((day, i) => (
            <div 
              key={day}
              title={day}
              className={`w-3 h-3 rounded-sm ${getHeatmapColor(day)} transition-colors duration-300 hover:scale-125 hover:z-10`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
          <span>Jan</span>
          <span>Mar</span>
          <span>May</span>
          <span>Jul</span>
          <span>Sep</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-5 rounded-3xl">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Most Active Month</p>
            <p className="text-xl font-bold">October</p>
          </div>
          <div className="glass p-5 rounded-3xl">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Weekly Avg</p>
            <p className="text-xl font-bold">4.2 <span className="text-xs text-slate-500">Days</span></p>
          </div>
        </div>
      </section>
      
      <div className="glass rounded-3xl p-6 bg-teal-500/5 border-teal-500/10">
        <h4 className="font-bold mb-2">Consistency Streak</h4>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0c0c0c] bg-teal-500 flex items-center justify-center text-[10px] font-bold">
                {i}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400">You're in the top 5% of users this month!</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
