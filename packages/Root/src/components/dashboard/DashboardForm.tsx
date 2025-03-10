import React from 'react';
import { Card, FormLayout, TextField, BlockStack, Text } from '@shopify/polaris';
import { useDashboardStore } from '../../store/dashboardStore';
import { shallow } from 'zustand/shallow';

// Create separate components for each form field to leverage Zustand's selective rendering
const TotalProjectsField = () => {
  const [totalProjects, updateMetrics] = useDashboardStore(
    (state) => [state.metrics.totalProjects, state.updateMetrics],
    shallow
  );
  
  return (
    <TextField
      label="Total Projects"
      type="number"
      value={totalProjects.toString()}
      onChange={(value) => updateMetrics({ totalProjects: parseInt(value) || 0 })}
      autoComplete="off"
    />
  );
};

const ActiveProjectsField = () => {
  const [activeProjects, updateMetrics] = useDashboardStore(
    (state) => [state.metrics.activeProjects, state.updateMetrics],
    shallow
  );
  
  return (
    <TextField
      label="Active Projects"
      type="number"
      value={activeProjects.toString()}
      onChange={(value) => updateMetrics({ activeProjects: parseInt(value) || 0 })}
      autoComplete="off"
    />
  );
};

const TeamUtilizationField = () => {
  const [teamUtilization, updateMetrics] = useDashboardStore(
    (state) => [state.metrics.teamUtilization, state.updateMetrics],
    shallow
  );
  
  return (
    <TextField
      label="Team Utilization"
      type="number"
      value={teamUtilization.toString()}
      onChange={(value) => updateMetrics({ teamUtilization: parseInt(value) || 0 })}
      suffix="%"
      autoComplete="off"
    />
  );
};

const TeamCountField = () => {
  const [teamCount, updateMetrics] = useDashboardStore(
    (state) => [state.metrics.teamCount, state.updateMetrics],
    shallow
  );
  
  return (
    <TextField
      label="Team count"
      type="number"
      value={teamCount.toString()}
      onChange={(value) => updateMetrics({ teamCount: parseInt(value) || 0 })}
      autoComplete="off"
    />
  );
};

const DashboardForm: React.FC = () => {
  return (
    <Card>
      <BlockStack gap="4">
        <Text as="h2" variant="headingMd">Update Metrics</Text>
        <FormLayout>
          <FormLayout.Group>
            <TotalProjectsField />
            <ActiveProjectsField />
            <TeamUtilizationField />
            <TeamCountField />
          </FormLayout.Group>
        </FormLayout>
      </BlockStack>
    </Card>
  );
};

export default DashboardForm; 