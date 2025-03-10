import React, { useEffect } from 'react';
import { 
  Page, 
  Layout, 
  Card, 
  Text, 
  ProgressBar, 
  BlockStack, 
  Select,
  TextField,
  Spinner,
  ButtonGroup,
  Button
} from '@shopify/polaris';
import { useParams } from 'react-router-dom';
import { useProjectDetailsStore } from '../store/projectDetailsStore';
import { shallow } from 'zustand/shallow';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { 
    project, 
    editedProject,
    isLoading, 
    error, 
    hasUnsavedChanges,
    fetchProject, 
    updateField,
    saveChanges,
    discardChanges
  } = useProjectDetailsStore(
    (state) => ({
      project: state.project,
      editedProject: state.editedProject,
      isLoading: state.isLoading,
      error: state.error,
      hasUnsavedChanges: state.hasUnsavedChanges,
      fetchProject: state.fetchProject,
      updateField: state.updateField,
      saveChanges: state.saveChanges,
      discardChanges: state.discardChanges
    }),
    shallow
  );
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !project) {
    return <Text as="p" tone="critical">{error || 'Project not found'}</Text>;
  }

  // Get the current value (edited or original)
  const getCurrentValue = <K extends keyof typeof project>(field: K) => {
    return editedProject?.[field] ?? project[field];
  };

  const completionRate = (getCurrentValue('completedTasks') / project.totalTasks) * 100;

  const handleStatusChange = (value: string) => {
    updateField('status', value as 'active' | 'completed' | 'on-hold');
  };

  const handleTasksChange = (value: string) => {
    const completedTasks = parseInt(value) || 0;
    if (completedTasks <= project.totalTasks) {
      updateField('completedTasks', completedTasks);
    }
  };

  return (
    <Page 
      title={project.name}
      primaryAction={
        hasUnsavedChanges ? 
        <ButtonGroup>
          <Button onClick={discardChanges}>Discard</Button>
          <Button primary onClick={saveChanges}>Save Changes</Button>
        </ButtonGroup> : 
        undefined
      }
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="4">
              <Text as="h2" variant="headingLg">{project.name}</Text>
              <BlockStack gap="4">
                <Select
                  label="Status"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'On Hold', value: 'on-hold' }
                  ]}
                  value={getCurrentValue('status')}
                  onChange={handleStatusChange}
                />
                <TextField
                  label="Completed Tasks"
                  type="number"
                  value={getCurrentValue('completedTasks').toString()}
                  onChange={handleTasksChange}
                  autoComplete="off"
                  min={0}
                  max={project.totalTasks}
                />
                <Text variant="bodyMd">Total Tasks: {project.totalTasks}</Text>
                <Text variant="bodyMd">Pending Tasks: {getCurrentValue('pendingTasks')}</Text>
                <Text variant="bodySm">Completion Rate:</Text>
                <ProgressBar progress={completionRate} />
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProjectDetailsPage; 