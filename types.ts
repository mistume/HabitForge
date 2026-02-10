
export type Frequency = 'daily' | '5x' | '3x';

export interface Habit {
  id: string;
  name: string;
  color: string;
  frequency: Frequency;
  reminderTime?: string;
  createdAt: number;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'skipped' | 'partial';
}

export type Mood = 'happy' | 'neutral' | 'sad';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: Mood;
  energy: number; // 1-5
  prompts: {
    helped: string;
    blocked: string;
  };
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'urgent-important' | 'important-not-urgent' | 'urgent-not-important' | 'neither';
  date: string;
  habitId?: string; // If auto-generated
}

export interface PlannerEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  habitId?: string;
}
