import { createStore } from './createStore';
import { DashboardState, DashboardMetrics } from '../types/dashboard';
import { BaseState, CacheStrategy, TabBehavior } from '../types/store';

interface DashboardStateWithBase extends DashboardState, BaseState {
  metrics: DashboardMetrics;
}

const initialMetrics: DashboardMetrics = {
  totalProjects: 0,
  activeProjects: 0,
  completedTasks: 0,
  pendingTasks: 0,
  teamUtilization: 0,
  totalHours: 0,
  projectProgress: 0,
  teamCount:0,
  budgetUtilization: 0
};

const dashboardConfig = {
  id: 'dashboardStore',
  initialState: {
    metrics: initialMetrics
  },
  methods: (
    set: (state: Partial<DashboardStateWithBase>) => void,
    get: () => DashboardStateWithBase
  ) => ({
    updateMetrics: (metrics: Partial<DashboardMetrics>) => {
      const { metrics: currentMetrics } = get();
      set({ metrics: { ...currentMetrics, ...metrics } });
    },
    resetMetrics: () => set({ metrics: initialMetrics })
  }),
  cache: {
    expiryTime: 60,
    strategy: 'memory' as CacheStrategy,
    tabBehavior: 'persist' as TabBehavior,
    clearOnRefresh: true
  }
};

export const useDashboardStore = createStore<DashboardStateWithBase>(dashboardConfig); 