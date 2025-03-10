import { createStore } from 'root/storeUtils';
import { BaseState, CacheStrategy, TabBehavior } from 'root/storeTypes';
import { storeManager } from 'root/storeManager';
import { useTabStore } from 'root/tabStore';

// Access the global storeManager if it exists (should be created by Root)
const GLOBAL_STORE_MANAGER_KEY = '__FEDERATED_STORE_MANAGER__';
const globalStoreManager = typeof window !== 'undefined' ? (window as any)[GLOBAL_STORE_MANAGER_KEY] : null;

// Add TabState interface to properly type the tab store state
interface TabState {
  tabs: any[];
  activeTabId: string | null;
  addTab: (tabType: string, data?: Record<string, any>) => any;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  getTabInstanceId: (tabId: string, dataId?: string) => string;
}

// Define our state interface
interface App1State extends BaseState {
  shown: boolean;
}

// Create a store config following Root's pattern
const app1Config = {
  id: 'app1Store',
  initialState: {
    shown: false
  },
  methods: (
    set: (state: Partial<App1State>) => void,
    get: () => App1State
  ) => ({
    setShown: (shown: boolean) => {
      set({ shown });
    },
    toggleShown: () => {
      const { shown } = get();
      set({ shown: !shown });
    }
  }),
  cache: {
    expiryTime: 60,
    strategy: 'memory' as CacheStrategy,
    tabBehavior: 'persist' as TabBehavior,
    clearOnRefresh: false
  }
};

// Create the store using Root's utility
const useApp1Store = createStore<App1State>(app1Config);

// Debug which storeManager instance we're using
// const isGlobalManager = globalStoreManager === storeManager;
// console.log(`Using ${isGlobalManager ? 'global' : 'imported'} storeManager instance`);

// // Check for store registration in a type-safe way
// console.log('App1Store created with ID:', app1Config.id);

// // Use type assertion to safely access potentially missing property
// const sm = storeManager as any;
// if (sm && sm.stores) {
//   console.log('Registered stores:', Array.from(sm.stores.keys()));
// } else {
//   console.log('StoreManager stores property not accessible');
// }

// // Explicitly update with current tab ID to ensure proper initialization
// const currentTabId = useTabStore.getState().activeTabId;
// if (currentTabId) {
//   // We need to wait for the next tick to ensure proper registration
//   setTimeout(() => {
//     console.log('Updating stores with tabId:', currentTabId);
//     try {
//       storeManager.updateStoresTabId(currentTabId);
//     } catch (e) {
//       console.error('Error updating stores with tab ID:', e);
//     }
//   }, 0);
// }

// // Subscribe to tab changes to help with debugging
// useTabStore.subscribe((state: TabState) => {
//   console.log('Tab changed to:', state.activeTabId);
// });

export { useApp1Store }; 