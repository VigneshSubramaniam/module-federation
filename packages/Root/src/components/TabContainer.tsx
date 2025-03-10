import React from 'react';
import { Tabs, Button, InlineStack, Text } from '@shopify/polaris';
import { CancelMajor } from '@shopify/polaris-icons';
import { useTabStore } from '../store/tabStore';
import { TAB_CONFIG } from '../config/tabRegistry';
import { useNavigate } from 'react-router-dom';

const TabContainer: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();
  const navigate = useNavigate();

  const tabItems = tabs.map(tab => {
    const config = TAB_CONFIG[tab.tabType];
    
    // Get the label based on tab type and data
    let label = config.tabDisplayData.label;
    if (tab.tabType === 'PROJECT_DETAILS' && tab.data?.projectId) {
      const projectName = tab.data.projectId === 'project-onboarding' ? 'Onboarding' : 'Offboarding';
      label = `Project ${projectName}`;
    }

    return {
      id: tab.id,
      content: (
        <InlineStack gap="200" align="center">
          <Text as="span">{label}</Text>
          <Button
            variant="plain"
            icon={CancelMajor}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              removeTab(tab.id);
            }}
            accessibilityLabel="Close tab"
          />
        </InlineStack>
      ),
      accessibilityLabel: label
    };
  });

  const handleTabChange = (selectedTabIndex: number) => {
    const tab = tabs[selectedTabIndex];
    if (tab) {
      setActiveTab(tab.id);
      navigate(tab.url);
    }
  };

  return (
    <Tabs
      tabs={tabItems}
      selected={tabs.findIndex(tab => tab.id === activeTabId)}
      onSelect={handleTabChange}
    />
  );
};

export default TabContainer; 