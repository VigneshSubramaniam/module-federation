import { ProjectDetails } from '../types/project';

// Mock project data
const PROJECT_DATA: Record<string, ProjectDetails> = {
  'project-onboarding': {
    id: 'project-onboarding',
    name: 'Project Onboarding',
    status: 'active',
    totalTasks: 10,
    completedTasks: 4,
    pendingTasks: 6,
    type: 'onboarding'
  },
  'project-offboarding': {
    id: 'project-offboarding',
    name: 'Project Offboarding',
    status: 'active',
    totalTasks: 8,
    completedTasks: 2,
    pendingTasks: 6,
    type: 'offboarding'
  }
};

// Mock API calls
export const projectService = {
  getProjectDetails: (projectId: string): Promise<ProjectDetails> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = PROJECT_DATA[projectId];
        if (project) {
          resolve(project);
        } else {
          reject(new Error('Project not found'));
        }
      }, 500); // Simulate network delay
    });
  },

  updateProject: (projectId: string, updates: Partial<ProjectDetails>): Promise<ProjectDetails> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = PROJECT_DATA[projectId];
        if (project) {
          const updatedProject = {
            ...project,
            ...updates,
            // Recalculate pending tasks if completedTasks is updated
            pendingTasks: updates.completedTasks !== undefined 
              ? project.totalTasks - updates.completedTasks 
              : project.pendingTasks
          };
          PROJECT_DATA[projectId] = updatedProject;
          resolve(updatedProject);
        } else {
          reject(new Error('Project not found'));
        }
      }, 500);
    });
  }
}; 