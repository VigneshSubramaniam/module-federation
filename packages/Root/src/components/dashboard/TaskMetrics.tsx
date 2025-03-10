import React from 'react';
import { Card, Text, Box, BlockStack, ProgressBar } from '@shopify/polaris';
import { useDashboardStore } from '../../store/dashboardStore';
import { shallow } from 'zustand/shallow';

const TaskMetrics: React.FC = () => {
  // Only subscribe to task-related metrics
  const { completedTasks, pendingTasks } = useDashboardStore(
    (state) => ({
      completedTasks: state.metrics.completedTasks,
      pendingTasks: state.metrics.pendingTasks,
    }),
    shallow
  );

  const totalTasks = completedTasks + pendingTasks;
  const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card>
      <BlockStack gap="4">
        <Text as="h2" variant="headingMd">Task Status</Text>
        <Box display="flex" gap="4" justifyContent="space-between">
          <BlockStack gap="2">
            <Text as="p" variant="bodySm" tone="subdued">Completed Tasks</Text>
            <Text as="p" variant="bodyMd" fontWeight="bold">{completedTasks}</Text>
          </BlockStack>
          <BlockStack gap="2">
            <Text as="p" variant="bodySm" tone="subdued">Pending Tasks</Text>
            <Text as="p" variant="bodyMd" fontWeight="bold">{pendingTasks}</Text>
          </BlockStack>
        </Box>
        <BlockStack gap="2">
          <Text as="p" variant="bodySm" tone="subdued">Completion Rate</Text>
          <ProgressBar progress={completionRate} />
        </BlockStack>
      </BlockStack>
    </Card>
  );
};

export default TaskMetrics; 