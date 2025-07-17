import { create } from 'zustand';
import { BaseState, StoreConfig } from '../types/store';
import { storeManager } from './storeManager';
import { useTabStore } from './tabStore';

export function createStore<T extends BaseState>(config: StoreConfig<T>) {
  // Default scope to 'tab' for backward compatibility
  const scope = config.cache?.scope || 'tab';
  
  const store = create<T>((set, get) => {
    // For global stores, use simple set/get without tab-specific logic
    if (scope === 'global') {
      return {
        ...config.initialState,
        ...config.methods(set, get)
      } as T;
    }

    // For tab-scoped stores, use the existing tab-aware logic
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
      const newState = { ...get(), ...updates };
      
      if (config.cache?.tabBehavior === 'persist') {
        const { activeTabId } = useTabStore.getState();
        if (activeTabId) {
          storeManager.setTabState(config.id, activeTabId, newState);
        }
      }
      
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

  // Add method to clear tab state (only relevant for tab-scoped stores)
  if (scope === 'tab') {
    store.clearTabState = (tabId: string) => {
      if (config.cache?.tabBehavior === 'persist') {
        storeManager.clearTabState(config.id, tabId);
      }
    };
  }

  console.log(store)

  return store;
} 