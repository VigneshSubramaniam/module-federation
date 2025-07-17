import React from 'react';
import { Button } from '@shopify/polaris';
import { CancelMajor, MobileCancelMajor } from '@shopify/polaris-icons';
import { useTabStore } from '../store/tabStore';
import { TAB_CONFIG } from '../config/tabRegistry';
import { useNavigate } from 'react-router-dom';

const TabContainer: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, removeTab, closeAllTabsExceptCurrent } = useTabStore();
  const navigate = useNavigate();

  // Render our own tab list with close buttons
  const renderTabs = () => {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        {tabs.map((tab) => {
          const config = TAB_CONFIG[tab.tabType];
          let label = config.tabDisplayData.label;
          if (tab.tabType === 'PROJECT_DETAILS' && tab.data?.projectId) {
            const projectName = tab.data.projectId === 'project-onboarding' ? 'Onboarding' : 'Offboarding';
            label = `Project ${projectName}`;
          }
          
          const isActive = tab.id === activeTabId;
          
          // Create a separate handler for the close button to ensure it has the correct type
          const handleCloseTab = () => {
            removeTab(tab.id);
          };
          
          return (
            <div
              key={tab.id}
              style={{
                padding: '8px',
                backgroundColor: isActive ? '#ffffff' : '#f4f6f8',
                border: isActive ? '1px solid #8c9196' : '1px solid #c9cccf',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(tab.url);
              }}
            >
              <span style={{ marginRight: '8px' }}>{label}</span>
              <div 
                onClick={(e) => { 
                  e.stopPropagation();
                }}
              >
                <Button
                  variant="plain"
                  icon={CancelMajor}
                  onClick={handleCloseTab}
                  accessibilityLabel="Close tab"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
        {renderTabs()}
        {tabs.length > 1 && (
          <Button
            variant="plain"
            icon={MobileCancelMajor}
            onClick={() => {
              console.log("Close All button clicked");
              closeAllTabsExceptCurrent();
            }}
            accessibilityLabel="Close all tabs except current"
          >
            Close All
          </Button>
        )}
      </div>
    </div>
  );
};

export default TabContainer; 