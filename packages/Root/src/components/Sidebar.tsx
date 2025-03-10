import React from 'react';
import { Navigation } from '@shopify/polaris';
import { 
  HomeMajor, 
  TimelineAttachmentMajor, 
  CollectionsMajor 
} from '@shopify/polaris-icons';
import { useTabStore } from '../store/tabStore';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { addTab } = useTabStore();
  const navigate = useNavigate();

  const handleNavClick = (tabType: string) => {
    const tab = addTab(tabType);
    if (tab) {
      navigate(tab.url);
    }
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: HomeMajor,
      onClick: () => handleNavClick('DASHBOARD')
    },
    {
      label: 'Projects',
      icon: CollectionsMajor,
      onClick: () => handleNavClick('PROJECTS')
    },
    {
      label: 'Timesheet',
      icon: TimelineAttachmentMajor,
      onClick: () => handleNavClick('TIMESHEET')
    },
    {
      label: 'App 1',
      icon: HomeMajor,
      onClick: () => handleNavClick('APP1')
    },
    {
      label: 'App 2',
      icon: HomeMajor,
      onClick: () => handleNavClick('APP2')
    }
  ];

  return (
    <Navigation location="/">
      <Navigation.Section items={navigationItems} />
    </Navigation>
  );
};

export default Sidebar; 