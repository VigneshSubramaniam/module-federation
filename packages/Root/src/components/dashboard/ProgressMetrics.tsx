import React from 'react';
import { Card, Text, BlockStack, ProgressBar } from '@shopify/polaris';
import { useDashboardStore } from '../../store/dashboardStore';
import { shallow } from 'zustand/shallow';

const ProgressMetrics: React.FC = () => {
  // Only subscribe to progress-related metrics
  const { projectProgress, budgetUtilization } = useDashboardStore(
    (state) => ({
      projectProgress: state.metrics.projectProgress,
      budgetUtilization: state.metrics.budgetUtilization,
    }),
    shallow
  );

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">Overall Progress</Text>
        <BlockStack gap="400">
          <BlockStack gap="200">
            <Text variant="bodySm" as="p" tone="subdued">Project Progress</Text>
            <ProgressBar progress={projectProgress} />
            <Text variant="bodyMd" as="p" fontWeight="bold">{projectProgress}%</Text>
          </BlockStack>
          <BlockStack gap="200">
            <Text variant="bodySm" as="p" tone="subdued">Budget Utilization</Text>
            <ProgressBar 
              progress={budgetUtilization}
              tone={budgetUtilization > 80 ? "critical" : "primary"}
            />
            <Text variant="bodyMd" as="p" fontWeight="bold">{budgetUtilization}%</Text>
          </BlockStack>
        </BlockStack>
      </BlockStack>
    </Card>
  );
};

export default ProgressMetrics; 