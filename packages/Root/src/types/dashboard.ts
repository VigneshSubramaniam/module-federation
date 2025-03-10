export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  totalHours: number;
  completedTasks: number;
  pendingTasks: number;
  teamUtilization: number;
  projectProgress: number;
  budgetUtilization: number;
  teamCount: number;
}

export interface DashboardState {
  metrics: DashboardMetrics;
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
  resetMetrics: () => void;
} 