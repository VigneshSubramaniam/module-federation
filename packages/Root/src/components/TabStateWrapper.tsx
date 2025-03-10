import React from 'react';
import { useTabStore } from '../store/tabStore';

interface TabStateWrapperProps {
  children: React.ReactNode;
}

const TabStateWrapper: React.FC<TabStateWrapperProps> = ({ children }) => {
  const { activeTabId } = useTabStore();

  return <>{children}</>;
};

export default TabStateWrapper; 