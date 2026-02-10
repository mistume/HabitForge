
import React, { useState } from 'react';
import { Todo } from '../types';
// Added CheckSquare to the imported icons from lucide-react
import { Plus, Check, Circle, Trash2, ShieldAlert, Zap, Clock, Info, CheckSquare } from 'lucide-react';

interface TodoViewProps {
  todos: Todo[];
  onAddTodo: (todo: Todo) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoView: React.FC<TodoViewProps> = ({ todos, onAddTodo, onToggleTodo, onDeleteTodo }) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('important-not-urgent');

  const quadrants = [
    { id: 'urgent-important', label: 'Do First', color: 'text-red-400', bg: 'bg-red-400/10', icon: <ShieldAlert size={16} /> },
    { id: 'important-not-urgent', label: 'Schedule', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: <Clock size={16} /> },
    { id: 'urgent-not-important', label: 'Delegate', color: 'text-teal-400', bg: 'bg-teal-400/10', icon: <Zap size={16} /> },
    { id: 'neither', label: 'Eliminate', color: 'text-slate-500', bg: 'bg-slate-500/10', icon: <Info size={16} /> }
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    
    onAddTodo({
      id: Math.random().toString(36).substr(2, 9),
      text: newTodoText,
      completed: false,
      priority,
      date: new Date().toISOString().split('T')[0]
    });
    setNewTodoText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Priority Matrix</h2>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          {todos.filter(t => !t.completed).length} Tasks Remaining
        </span>
      </div>

      <form onSubmit={handleAdd} className="glass p-5 rounded-3xl border-teal-500/10 bg-teal-500/5">
        <div className="flex gap-3 mb-4">
          <input 
            type="text" 
            placeholder="What needs forgeing?"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/30 text-sm"
            value={newTodoText}
            onChange={e => setNewTodoText(e.target.value)}
          />
          <button type="submit" className="p-3 teal-gradient rounded-2xl shadow-lg shadow-teal-900/20">
            <Plus size={24} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {quadrants.map(q => (
            <button
              key={q.id}
              type="button"
              onClick={() => setPriority(q.id as Todo['priority'])}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${priority === q.id ? q.bg + ' ' + q.color + ' ring-1 ring-white/20' : 'bg-white/5 text-slate-500'}`}
            >
              {q.icon}
              {q.label}
            </button>
          ))}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-6">
        {quadrants.map(q => {
          const quadrantTodos = todos.filter(t => t.priority === q.id);
          if (quadrantTodos.length === 0) return null;
          
          return (
            <div key={q.id} className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <span className={`${q.color}`}>{q.icon}</span>
                <h3 className={`text-xs uppercase tracking-widest font-bold ${q.color}`}>{q.label}</h3>
              </div>
              <div className="space-y-2">
                {quadrantTodos.map(todo => (
                  <div 
                    key={todo.id}
                    className={`glass rounded-2xl p-4 flex items-center justify-between group transition-all ${todo.completed ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onToggleTodo(todo.id)}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed ? 'bg-teal-500 border-teal-500' : 'border-white/10'}`}>
                        {todo.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-sm ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {todo.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => onDeleteTodo(todo.id)}
                      className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {todos.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4 text-slate-500">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <CheckSquare size={32} />
            </div>
            <p>Your matrix is empty.<br/>Forge some productivity!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoView;
