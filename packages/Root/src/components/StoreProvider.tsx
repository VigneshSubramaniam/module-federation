import React, { useEffect } from 'react';
import { storeManager } from '../store/storeManager';
import { useTabStore } from '../store/tabStore';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTabId } = useTabStore();

  useEffect(() => {
    if (activeTabId) {
      storeManager.updateStoresTabId(activeTabId);
    }
  }, [activeTabId]); // React to tab changes

  return <>{children}</>;
}; 