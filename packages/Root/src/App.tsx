import React from 'react';
import { AppProvider, Frame } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import TabManager from './components/TabManager';
import Sidebar from './components/Sidebar';
import { useTabStore } from './store/tabStore';
import { StoreProvider } from './components/StoreProvider';

const App: React.FC = () => {
  const { addTab } = useTabStore();

  React.useEffect(() => {
    // Add default tab
    addTab('DASHBOARD');
  }, []);

  return (
    <AppProvider i18n={enTranslations}>
      <StoreProvider>
        <Frame
          navigation={<Sidebar />}
        >
          <TabManager />
        </Frame>
      </StoreProvider>
    </AppProvider>
  );
};

export default App; 