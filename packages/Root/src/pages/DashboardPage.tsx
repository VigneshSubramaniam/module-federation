import React, { useEffect } from 'react';
import { Page, Layout, Grid, Spinner } from '@shopify/polaris';
import ProjectMetrics from '../components/dashboard/ProjectMetrics';
import TaskMetrics from '../components/dashboard/TaskMetrics';
import TeamMetrics from '../components/dashboard/TeamMetrics';
import ProgressMetrics from '../components/dashboard/ProgressMetrics';
import DashboardForm from '../components/dashboard/DashboardForm';
import { useDashboardStore } from '../store/dashboardStore';
import { ProjectList } from '@/components/dashboard/ProjectList';

// Separate component for the page title to prevent unnecessary re-renders
const DashboardTitle = () => {
  // Only subscribe to the title
 
  return <>Dashboard</>;
};

// Separate component for the metrics section
const MetricsSection = () => {
  return (
    <>
    <Layout.Section>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <ProjectMetrics />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <TaskMetrics />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <TeamMetrics />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <ProgressMetrics />
        </Grid.Cell>
      </Grid>
    </Layout.Section>
     <Layout.Section>
     <ProjectList />
   </Layout.Section>
   </>
  );
};

// Separate component for the form section
const FormSection = () => {
  return (
    <Layout.Section>
      <DashboardForm />
    </Layout.Section>
  );
};

const DashboardPage: React.FC = () => {

  return (
    <Page title={<DashboardTitle />}>
      <Layout>
        <MetricsSection />
        <FormSection />
      </Layout>
    </Page>
  );
};

export default DashboardPage; 