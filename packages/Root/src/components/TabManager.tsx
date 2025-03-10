import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTabStore } from '../store/tabStore';
import { TAB_CONFIG } from '../config/tabRegistry';
import TabContainer from './TabContainer';
import TabStateWrapper from './TabStateWrapper';
import { Spinner } from '@shopify/polaris';

const TabManager: React.FC = () => {
  const { tabs, activeTabId, setActiveTab } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Only render the active tab's component
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Sync URL with active tab (only when active tab changes)
  useEffect(() => {
    if (activeTab && activeTab.url !== location.pathname) {
      navigate(activeTab.url);
    }
  }, [activeTabId, navigate, activeTab]);

  // We're removing the URL-to-tab sync to prevent flickering with dynamic URLs
  // This means tabs will only be activated by explicit user actions (clicking tab or sidebar)

  return (
    <div className="tab-manager">
      <TabContainer />
      <div className="tab-content">
        <Suspense fallback={<Spinner />}>
          <Routes>
            {Object.entries(TAB_CONFIG).map(([key, config]) => (
              <Route
                key={config.id}
                path={config.url.path}
                element={
                  <TabStateWrapper key={activeTab?.url}>
                    <config.component />
                  </TabStateWrapper>
                }
              />
            ))}
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default TabManager; 