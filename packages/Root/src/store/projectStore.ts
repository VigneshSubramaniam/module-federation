import { createStore } from './createStore';
import { Project } from '../types/project';
import { BaseState, CacheStrategy, TabBehavior } from '../types/store';

interface ProjectState extends BaseState {
  projects: Project[];
  currentProject: Project | null;
  formState: Project;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  setCurrentProject: (project: Project | null) => void;
  updateFormState: (updates: Partial<Project>) => void;
  resetForm: () => void;
}

const initialFormState: Project = {
  id: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  members: []
};

const projectConfig = {
  id: 'projectStore',
  initialState: {
    projects: [],
    currentProject: null,
    formState: initialFormState
  },
  methods: (
    set: (state: Partial<ProjectState>) => void,
    get: () => ProjectState
  ) => ({
    addProject: (project: Project) => {
      const { projects } = get();
      set({ projects: [...projects, project] });
    },
    updateProject: (project: Project) => {
      const { projects } = get();
      set({
        projects: projects.map(p => p.id === project.id ? project : p)
      });
    },
    setCurrentProject: (project: Project | null) => {
      set({
        currentProject: project,
        formState: project || initialFormState
      });
    },
    updateFormState: (updates: Partial<Project>) => {
      const { formState } = get();
      set({ formState: { ...formState, ...updates } });
    },
    resetForm: () => set({ formState: initialFormState })
  }),
  cache: {
    expiryTime: 60,
    strategy: 'memory' as CacheStrategy,
    tabBehavior: 'reset' as TabBehavior,
    clearOnRefresh: true
  }
};

export const useProjectStore = createStore<ProjectState>(projectConfig); 