export interface ProjectMember {
  id: string;
  name: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  members: ProjectMember[];
}

export interface ProjectFormState {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  members: ProjectMember[];
}

export interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  formState: ProjectFormState;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  updateFormState: (state: Partial<ProjectFormState>) => void;
  resetFormState: () => void;
}

export interface ProjectDetails {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  type: 'onboarding' | 'offboarding';
}

export const INITIAL_PROJECTS: ProjectDetails[] = [
  {
    id: 'project-onboarding',
    name: 'Project Onboarding',
    status: 'active',
    totalTasks: 10,
    completedTasks: 4,
    pendingTasks: 6,
    type: 'onboarding'
  },
  {
    id: 'project-offboarding',
    name: 'Project Offboarding',
    status: 'active',
    totalTasks: 8,
    completedTasks: 2,
    pendingTasks: 6,
    type: 'offboarding'
  }
]; 