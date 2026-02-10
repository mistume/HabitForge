
import React, { useState, useMemo } from 'react';
import { JournalEntry, Mood } from '../types';
import { Smile, Meh, Frown, Save, Search, Archive, Calendar } from 'lucide-react';

interface JournalViewProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: JournalEntry) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onSaveEntry }) => {
  const today = new Date().toISOString().split('T')[0];
  const existingToday = entries.find(e => e.date === today);

  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>(existingToday || {
    id: Math.random().toString(36).substr(2, 9),
    date: today,
    content: '',
    mood: 'neutral',
    energy: 3,
    prompts: {
      helped: '',
      blocked: ''
    }
  });

  const handleSave = () => {
    onSaveEntry(currentEntry);
    setIsEditing(false);
  };

  const getMoodIcon = (mood: Mood, size = 24) => {
    switch(mood) {
      case 'happy': return <Smile size={size} className="text-teal-400" />;
      case 'neutral': return <Meh size={size} className="text-amber-400" />;
      case 'sad': return <Frown size={size} className="text-red-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Reflection</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 glass rounded-2xl text-sm font-medium hover:bg-white/10 transition-all"
        >
          {isEditing ? 'Cancel' : 'New Entry'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-6 glass rounded-3xl p-6 border-teal-500/20 shadow-2xl">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{today}</span>
            <div className="flex gap-4">
              {(['happy', 'neutral', 'sad'] as Mood[]).map(m => (
                <button
                  key={m}
                  onClick={() => setCurrentEntry({ ...currentEntry, mood: m })}
                  className={`p-2 rounded-xl transition-all ${currentEntry.mood === m ? 'bg-white/10 scale-125' : 'opacity-40 hover:opacity-100'}`}
                >
                  {getMoodIcon(m)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Energy Level (1-5)</label>
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onClick={() => setCurrentEntry({ ...currentEntry, energy: i })}
                  className={`w-10 h-10 rounded-2xl font-bold transition-all ${currentEntry.energy === i ? 'bg-teal-500 text-white' : 'bg-white/5 text-slate-400'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs italic text-teal-400 mb-2">"What helped your habits today?"</p>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-teal-500 transition-all resize-none h-20 text-sm"
                placeholder="A long walk, good sleep..."
                value={currentEntry.prompts.helped}
                onChange={e => setCurrentEntry({ ...currentEntry, prompts: { ...currentEntry.prompts, helped: e.target.value }})}
              />
            </div>
            <div>
              <p className="text-xs italic text-amber-400 mb-2">"What blocked you?"</p>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-amber-500 transition-all resize-none h-20 text-sm"
                placeholder="Work stress, bad weather..."
                value={currentEntry.prompts.blocked}
                onChange={e => setCurrentEntry({ ...currentEntry, prompts: { ...currentEntry.prompts, blocked: e.target.value }})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Daily Thoughts</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-white/30 transition-all resize-none h-32 text-sm"
                placeholder="Write anything..."
                value={currentEntry.content}
                onChange={e => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 teal-gradient rounded-2xl font-bold text-lg hover:brightness-110 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Keep Memory
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass rounded-3xl p-6 teal-gradient border-none">
            <h3 className="text-xl font-bold mb-2">Journaling Archive</h3>
            <p className="text-teal-100/70 text-sm mb-4">You have {entries.length} memories stored. Look back to see your growth.</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-white/10 py-3 rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-white/20 transition-all">
                <Search size={18} /> Search
              </button>
              <button className="flex-1 bg-white/10 py-3 rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-white/20 transition-all">
                <Archive size={18} /> Archive
              </button>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-6">Recent Entries</h3>
          {entries.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              No entries yet. Start writing today!
            </div>
          ) : (
            entries.sort((a,b) => b.date.localeCompare(a.date)).map(entry => (
              <div key={entry.id} className="glass rounded-3xl p-5 border-white/5 flex gap-4">
                <div className="flex flex-col items-center gap-2 pt-1">
                  {getMoodIcon(entry.mood, 20)}
                  <div className="w-px h-10 bg-white/10" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">{entry.date}</span>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-slate-400">Energy: {entry.energy}/5</span>
                  </div>
                  <p className="text-sm line-clamp-2 text-slate-300">{entry.content || 'No text entry, just metrics.'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JournalView;
