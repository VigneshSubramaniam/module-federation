import React from 'react';
import { Card, Text, Box, BlockStack } from '@shopify/polaris';
import { useDashboardStore } from '../../store/dashboardStore';
import { shallow } from 'zustand/shallow';

const ProjectMetrics: React.FC = () => {
  // Only subscribe to project-related metrics
  const { totalProjects, activeProjects } = useDashboardStore(
    (state) => ({
      totalProjects: state.metrics.totalProjects,
      activeProjects: state.metrics.activeProjects,
    }),
    shallow
  );

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">Project Overview</Text>
        <Box>
          <BlockStack gap="400">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <BlockStack gap="200">
                <Text variant="bodySm" as="p" tone="subdued">Total Projects</Text>
                <Text variant="bodyMd" as="p" fontWeight="bold">{totalProjects}</Text>
              </BlockStack>
              <BlockStack gap="200">
                <Text variant="bodySm" as="p" tone="subdued">Active Projects</Text>
                <Text variant="bodyMd" as="p" fontWeight="bold">{activeProjects}</Text>
              </BlockStack>
            </div>
          </BlockStack>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default ProjectMetrics; 