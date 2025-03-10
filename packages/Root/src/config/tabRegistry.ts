import { lazy } from 'react';
import {
  HomeMajor,
  TimelineAttachmentMajor,
  CollectionsMajor,
  ViewMajor
} from '@shopify/polaris-icons';
import { TabConfig } from '../types/tab';

// Lazy load components
const TimeSheetPage = lazy(() => import('../pages/TimeSheetPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProjectDetailsPage = lazy(() => import('../pages/ProjectDetailsPage'));
const App1Page = lazy(() => import('../pages/App1Page'));
const App2Page = lazy(() => import('../pages/App2Page'));

export const TAB_CONFIG: Record<string, TabConfig> = {
  TIMESHEET: {
    id: 'timesheet',
    tabIcon: TimelineAttachmentMajor,
    url: {
      url: '/timesheet',
      path: '/timesheet'
    },
    tabDisplayData: {
      name: 'TIMESHEET',
      label: 'Timesheets'
    },
    tabContentData: {
      title: 'Timesheet',
      module: 'timesheet'
    },
    component: TimeSheetPage
  },
  PROJECTS: {
    id: 'projects',
    tabIcon: CollectionsMajor,
    url: {
      url: '/projects',
      path: '/projects'
    },
    tabDisplayData: {
      name: 'PROJECTS',
      label: 'Projects'
    },
    tabContentData: {
      title: 'Projects',
      module: 'projects'
    },
    component: ProjectsPage
  },
  DASHBOARD: {
    id: 'dashboard',
    tabIcon: HomeMajor,
    url: {
      url: '/',
      path: '/'
    },
    tabDisplayData: {
      name: 'DASHBOARD',
      label: 'Dashboard'
    },
    tabContentData: {
      title: 'Dashboard',
      module: 'dashboard'
    },
    component: DashboardPage
  },
  PROJECT_DETAILS: {
    id: 'project-details',
    dynamicId: 'projectId',
    tabIcon: ViewMajor,
    url: {
      url: '/project/:projectId',
      path: '/project/:projectId'
    },
    tabDisplayData: {
      name: 'PROJECT_DETAILS',
      label: 'Project Details'
    },
    tabContentData: {
      title: 'Project Details',
      module: 'project-details'
    },
    component: ProjectDetailsPage
  },
  APP1: {
    id: 'app1',
    tabIcon: HomeMajor,
    url: {
      url: '/app1',
      path: '/app1'
    },
    tabDisplayData: {
      name: 'APP1',
      label: 'App 1'
    },
    tabContentData: {
      title: 'App 1',
      module: 'app1'
    },
    component: App1Page
  },
  APP2: {
    id: 'app2',
    tabIcon: HomeMajor,
    url: {
      url: '/app2',
      path: '/app2'
    },
    tabDisplayData: {
      name: 'APP2',
      label: 'App 2'
    },
    tabContentData: {
      title: 'App 2',
      module: 'app2'
    },
    component: App2Page
  }
}; 