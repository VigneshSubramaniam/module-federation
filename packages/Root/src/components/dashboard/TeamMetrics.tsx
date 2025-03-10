import React from 'react';
import { Card, Text, Box, BlockStack } from '@shopify/polaris';
import { useDashboardStore } from '../../store/dashboardStore';
import { shallow } from 'zustand/shallow';

const TeamMetrics: React.FC = () => {
  // Only subscribe to team-related metrics
  const { teamUtilization, totalHours } = useDashboardStore(
    (state) => ({
      teamUtilization: state.metrics.teamUtilization,
      totalHours: state.metrics.totalHours,
    }),
    shallow
  );

  return (
    <Card>
      <BlockStack gap="4">
        <Text as="h2" variant="headingMd">Team Performance</Text>
        <Box display="flex" gap="4" justifyContent="space-between">
          <BlockStack gap="2">
            <Text as="p" variant="bodySm" tone="subdued">Team Utilization</Text>
            <Text as="p" variant="bodyMd" fontWeight="bold">{teamUtilization}%</Text>
          </BlockStack>
          <BlockStack gap="2">
            <Text as="p" variant="bodySm" tone="subdued">Total Hours</Text>
            <Text as="p" variant="bodyMd" fontWeight="bold">{totalHours}</Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Card>
  );
};

export default TeamMetrics; 