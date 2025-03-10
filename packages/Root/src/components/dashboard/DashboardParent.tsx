import React from 'react';
import { Page, Layout } from '@shopify/polaris';
import {
  ProjectMetrics,
  TaskMetrics,
  TeamMetrics,
  ProgressMetrics,
  DashboardForm
} from './';

const DashboardParent: React.FC = () => {
  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section variant="oneHalf">
          <ProjectMetrics />
        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <TaskMetrics />
        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <TeamMetrics />
        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <ProgressMetrics />
        </Layout.Section>
        <Layout.Section>
          <DashboardForm />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default DashboardParent; 