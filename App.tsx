
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  BookOpen, 
  CheckSquare, 
  Plus, 
  Settings,
  Flame,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Activity
} from 'lucide-react';
import { Habit, HabitLog, JournalEntry, Todo, PlannerEvent } from './types';
import Dashboard from './components/Dashboard';
import HabitList from './components/HabitList';
import CalendarView from './components/CalendarView';
import JournalView from './components/JournalView';
import TodoView from './components/TodoView';
import { saveToLocal, loadFromLocal } from './services/persistence';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'habits' | 'calendar' | 'journal' | 'todos'>('home');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [events, setEvents] = useState<PlannerEvent[]>([]);

  // Initialize data
  useEffect(() => {
    const data = loadFromLocal();
    if (data) {
      setHabits(data.habits || []);
      setLogs(data.logs || []);
      setJournal(data.journal || []);
      setTodos(data.todos || []);
      setEvents(data.events || []);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    saveToLocal({ habits, logs, journal, todos, events });
  }, [habits, logs, journal, todos, events]);

  const addHabit = (habit: Habit) => setHabits(prev => [...prev, habit]);
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habitId !== id));
  };

  const toggleHabitLog = (habitId: string, date: string) => {
    setLogs(prev => {
      const exists = prev.find(l => l.habitId === habitId && l.date === date);
      if (exists) {
        return prev.filter(l => !(l.habitId === habitId && l.date === date));
      }
      return [...prev, { habitId, date, status: 'completed' }];
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard 
            habits={habits} 
            logs={logs} 
            todos={todos}
            onToggleHabit={toggleHabitLog}
            onAddHabit={() => setActiveTab('habits')}
          />
        );
      case 'habits':
        return (
          <HabitList 
            habits={habits} 
            logs={logs} 
            onAddHabit={addHabit} 
            onDeleteHabit={deleteHabit}
            onToggleLog={toggleHabitLog}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            habits={habits} 
            logs={logs} 
            events={events}
            onAddEvent={(e) => setEvents(prev => [...prev, e])}
          />
        );
      case 'journal':
        return (
          <JournalView 
            entries={journal} 
            onSaveEntry={(e) => setJournal(prev => {
              const existingIndex = prev.findIndex(item => item.date === e.date);
              if (existingIndex > -1) {
                const newJournal = [...prev];
                newJournal[existingIndex] = e;
                return newJournal;
              }
              return [...prev, e];
            })} 
          />
        );
      case 'todos':
        return (
          <TodoView 
            todos={todos} 
            onAddTodo={(t) => setTodos(prev => [...prev, t])}
            onToggleTodo={(id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
            onDeleteTodo={(id) => setTodos(prev => prev.filter(t => t.id !== id))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#0c0c0c] text-white shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-[#0c0c0c]/80 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {activeTab === 'home' ? 'HabitForge' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>
        <button className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
          <Settings size={20} className="text-slate-400" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 scroll-smooth">
        {renderContent()}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0c0c0c]/90 backdrop-blur-xl border-t border-white/5 py-4 px-8 flex justify-between items-center z-50">
        <NavItem 
          icon={<LayoutGrid size={24} />} 
          label="Home" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <NavItem 
          icon={<Activity size={24} />} 
          label="Habits" 
          active={activeTab === 'habits'} 
          onClick={() => setActiveTab('habits')} 
        />
        <NavItem 
          icon={<CalendarIcon size={24} />} 
          label="Chart" 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
        />
        <NavItem 
          icon={<BookOpen size={24} />} 
          label="Journal" 
          active={activeTab === 'journal'} 
          onClick={() => setActiveTab('journal')} 
        />
        <NavItem 
          icon={<CheckSquare size={24} />} 
          label="Tasks" 
          active={activeTab === 'todos'} 
          onClick={() => setActiveTab('todos')} 
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-teal-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
