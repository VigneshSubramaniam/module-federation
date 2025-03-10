import { createStore } from './createStore';
import { BaseState, CacheStrategy, TabBehavior } from '../types/store';

interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  projectId: string;
  description: string;
}

interface TimesheetState extends BaseState {
  entries: TimeEntry[];
  currentWeek: string;
  addEntry: (entry: TimeEntry) => void;
  updateEntry: (entry: TimeEntry) => void;
  deleteEntry: (id: string) => void;
  setCurrentWeek: (week: string) => void;
}

const timesheetConfig = {
  id: 'timesheetStore',
  initialState: {
    entries: [],
    currentWeek: new Date().toISOString().split('T')[0]
  },
  methods: (
    set: (state: Partial<TimesheetState>) => void,
    get: () => TimesheetState
  ) => ({
    addEntry: (entry: TimeEntry) => {
      const { entries } = get();
      set({ entries: [...entries, entry] });
    },
    updateEntry: (entry: TimeEntry) => {
      const { entries } = get();
      set({
        entries: entries.map(e => e.id === entry.id ? entry : e)
      });
    },
    deleteEntry: (id: string) => {
      const { entries } = get();
      set({
        entries: entries.filter(e => e.id !== id)
      });
    },
    setCurrentWeek: (week: string) => set({ currentWeek: week })
  }),
  cache: {
    expiryTime: 120, // 2 hours
    strategy: 'memory' as CacheStrategy,
    tabBehavior: 'isolate' as TabBehavior, // Separate state per tab
    clearOnRefresh: true
  }
};

export const useTimesheetStore = createStore<TimesheetState>(timesheetConfig); 