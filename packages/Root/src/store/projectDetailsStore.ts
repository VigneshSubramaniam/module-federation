import { createStore } from './createStore';
import { ProjectDetails } from '../types/project';
import { projectService } from '../services/projectService';
import { BaseState, CacheStrategy, TabBehavior } from '../types/store';

interface ProjectDetailsState extends BaseState {
  project: ProjectDetails | null;
  editedProject: Partial<ProjectDetails> | null;
  isLoading: boolean;
  error: string | null;
  currentProjectId: string | null;
  fetchProject: (projectId: string) => Promise<void>;
  updateField: (field: keyof ProjectDetails, value: any) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  hasUnsavedChanges: boolean;
}

const projectDetailsConfig = {
  id: 'projectDetailsStore',
  initialState: {
    project: null,
    editedProject: null,
    isLoading: false,
    error: null,
    hasUnsavedChanges: false,
    currentProjectId: null
  },
  methods: (
    set: (state: Partial<ProjectDetailsState>) => void,
    get: () => ProjectDetailsState
  ) => ({
    fetchProject: async (projectId: string) => {
      const projectData = get();
      console.log({projectData});
      const {project, editedProject} = projectData;
      if (projectData && project) {
        set({ project: project, editedProject: editedProject, isLoading: false, error: null });
        return;
      }
      set({ isLoading: true, error: null });
      try {
        const project = await projectService.getProjectDetails(projectId);
        set({ 
          project,
          editedProject: null,
          hasUnsavedChanges: false,
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: (error as Error).message, 
          isLoading: false,
          project: null
        });
      }
    },

    updateField: (field: keyof ProjectDetails, value: any) => {
      const { project, editedProject } = get();
      if (!project) return;

      const newEditedProject = {
        ...editedProject,
        [field]: value
      };

      // Recalculate pending tasks if completedTasks is updated
      if (field === 'completedTasks') {
        newEditedProject.pendingTasks = project.totalTasks - value;
      }

      set({ 
        editedProject: newEditedProject,
        hasUnsavedChanges: true
      });
    },

    saveChanges: async () => {
      const { project, editedProject } = get();
      if (!project || !editedProject) return;

      set({ isLoading: true, error: null });
      try {
        const updatedProject = await projectService.updateProject(project.id, editedProject);
        set({ 
          project: updatedProject, 
          editedProject: null,
          hasUnsavedChanges: false,
          isLoading: false 
        });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    discardChanges: () => {
      set({ 
        editedProject: null,
        hasUnsavedChanges: false
      });
    }
  }),
  cache: {
    expiryTime: 300,
    strategy: 'memory' as CacheStrategy,
    tabBehavior: 'persist' as TabBehavior,
    clearOnRefresh: true
  }
};

export const useProjectDetailsStore = createStore<ProjectDetailsState>(projectDetailsConfig); 