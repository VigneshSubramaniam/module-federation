import React from 'react';
import { Card, DataTable, Button, Text, BlockStack } from '@shopify/polaris';
import { useTabStore } from '../../store/tabStore';
import { INITIAL_PROJECTS } from '../../types/project';

export const ProjectList: React.FC = () => {
  const { addTab } = useTabStore();

  const openProjectTab = (projectId: string) => {
    addTab('PROJECT_DETAILS', { projectId });
  };

  const rows = INITIAL_PROJECTS.map(project => [
    <Button plain onClick={() => openProjectTab(project.id)}>
      {project.name}
    </Button>,
    project.status,
    `${project.completedTasks}/${project.totalTasks}`,
    project.pendingTasks
  ]);

  return (
    <Card>
      <BlockStack gap="4">
        <Text variant="headingMd" as="h3">Projects</Text>
        <DataTable
          columnContentTypes={['text', 'text', 'numeric', 'numeric']}
          headings={['Project Name', 'Status', 'Tasks (Completed/Total)', 'Pending Tasks']}
          rows={rows}
        />
      </BlockStack>
    </Card>
  );
}; 