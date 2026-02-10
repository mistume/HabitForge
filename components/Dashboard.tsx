
import React, { useMemo } from 'react';
import { Habit, HabitLog, Todo } from '../types';
import { Flame, CheckCircle, Clock, Plus } from 'lucide-react';

interface DashboardProps {
  habits: Habit[];
  logs: HabitLog[];
  todos: Todo[];
  onToggleHabit: (id: string, date: string) => void;
  onAddHabit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, logs, todos, onToggleHabit, onAddHabit }) => {
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const totalCompletions = logs.length;
    const todayLogs = logs.filter(l => l.date === today);
    const completionRate = habits.length > 0 ? (todayLogs.length / habits.length) * 100 : 0;
    
    // Simplistic streak calculation for all habits
    let totalStreak = 0;
    habits.forEach(h => {
      let streak = 0;
      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (logs.find(l => l.habitId === h.id && l.date === dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      totalStreak += streak;
    });

    return { totalCompletions, completionRate, totalStreak };
  }, [habits, logs, today]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome & Stats Row */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-3xl teal-gradient border-none">
          <div className="flex justify-between items-start mb-2">
            <Flame className="text-amber-300" size={24} />
            <span className="text-2xl font-bold">{stats.totalStreak}</span>
          </div>
          <p className="text-xs text-teal-100 font-medium uppercase tracking-wider">Total Streak</p>
        </div>
        <div className="glass p-5 rounded-3xl">
          <div className="flex justify-between items-start mb-2">
            <CheckCircle className="text-teal-500" size={24} />
            <span className="text-2xl font-bold">{Math.round(stats.completionRate)}%</span>
          </div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Today's Score</p>
        </div>
      </section>

      {/* Today's Habits */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Today's Rituals
          </h2>
          <button onClick={onAddHabit} className="text-teal-500 text-sm font-medium hover:underline">
            View All
          </button>
        </div>
        
        {habits.length === 0 ? (
          <div className="glass rounded-3xl p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center">
              <Plus className="text-teal-500" size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No habits yet</h3>
              <p className="text-sm text-slate-400">Forge your first ritual to start tracking.</p>
            </div>
            <button 
              onClick={onAddHabit}
              className="px-6 py-2 bg-teal-600 rounded-full text-sm font-semibold hover:bg-teal-500 transition-all"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {habits.map(habit => {
              const isCompleted = logs.some(l => l.habitId === habit.id && l.date === today);
              return (
                <div 
                  key={habit.id}
                  onClick={() => onToggleHabit(habit.id, today)}
                  className={`glass rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] ${isCompleted ? 'border-teal-500/50 bg-teal-500/5' : 'border-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-3 h-10 rounded-full" 
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <h4 className={`font-medium transition-colors ${isCompleted ? 'text-teal-400' : 'text-white'}`}>
                        {habit.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{habit.frequency}</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-teal-500 border-teal-500' : 'border-white/10'}`}>
                    {isCompleted && <CheckCircle size={16} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Summary Card */}
      <section className="glass rounded-3xl p-6 relative overflow-hidden amber-gradient border-none">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1">Consistency is Key</h3>
          <p className="text-amber-100/80 text-sm max-w-[200px]">You have {todos.filter(t => !t.completed).length} pending tasks for today.</p>
        </div>
        <Clock className="absolute -right-4 -bottom-4 text-white/10" size={120} />
      </section>
    </div>
  );
};

export default Dashboard;
