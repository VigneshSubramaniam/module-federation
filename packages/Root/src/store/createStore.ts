import { create } from 'zustand';
import { BaseState, StoreConfig } from '../types/store';
import { storeManager } from './storeManager';
import { useTabStore } from './tabStore';

export function createStore<T extends BaseState>(config: StoreConfig<T>) {
  const store = create<T>((set, get) => {
    const wrappedGet = () => {
      if (config.cache?.tabBehavior === 'persist') {
        const { activeTabId } = useTabStore.getState();
        if (activeTabId) {
          const cachedState = storeManager.getTabState<T>(config.id, activeTabId);
          if (cachedState) {
            return cachedState;
          }
          else {
            return { ...get(), ...config.initialState } as T;
          }
        }
      }
      return get();
    };

    const wrappedSet = (updates: Partial<T>) => {
      // Get the current state before applying updates
      const currentState = get();
      
      // Create the new state by merging current state with updates
      const newState = { ...currentState, ...updates };
      
      if (config.cache?.tabBehavior === 'persist') {
        const { activeTabId } = useTabStore.getState();
        if (activeTabId) {
          // Pass both the new state and previous state to track changes
          storeManager.setTabState(config.id, activeTabId, newState, currentState);
        }
      }
      
      // Apply the update to Zustand state
      set(newState);
    };

    return {
      ...config.initialState,
      ...config.methods(wrappedSet, wrappedGet),
      _metadata: {
        lastAccessed: Date.now(),
        lastUpdated: Date.now(),
        tabId: null,
        lastResetTab: null
      }
    } as T;
  });

  // Register store with manager
  storeManager.registerStore(config.id, store, config);

  // Add method to clear tab state
  store.clearTabState = (tabId: string) => {
    if (config.cache?.tabBehavior === 'persist') {
      storeManager.clearTabState(config.id, tabId);
    }
  };

  console.log(store)

  return store;
} 