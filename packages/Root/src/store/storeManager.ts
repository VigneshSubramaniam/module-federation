import { StoreApi } from 'zustand';
import { BaseState, StoreConfig } from '../types/store';

// Create a global identifier that any module can reference
const GLOBAL_STORE_MANAGER_KEY = '__FEDERATED_STORE_MANAGER__';

class StoreManager {
  private static instance: StoreManager;
  // Make stores public so we can inspect it
  public stores = new Map<string, {
    store: StoreApi<any>,
    config: StoreConfig<any>
  }>();

  // Map<storeId, Map<tabId, state>>
  private tabStateCache = new Map<string, Map<string, any>>();

  private constructor() {
    this.loadPersistedStores();
    setInterval(() => this.cleanupExpiredStores(), 60000);
    window.addEventListener('beforeunload', () => this.handleBeforeUnload());
  }

  static getInstance(): StoreManager {
    // First check if it exists in the global scope
    if (typeof window !== 'undefined' && (window as any)[GLOBAL_STORE_MANAGER_KEY]) {
      return (window as any)[GLOBAL_STORE_MANAGER_KEY];
    }
    
    // If not, create a new instance
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
      
      // Store it globally to ensure it's a singleton across module boundaries
      if (typeof window !== 'undefined') {
        (window as any)[GLOBAL_STORE_MANAGER_KEY] = StoreManager.instance;
      }
    }
    
    return StoreManager.instance;
  }

  getTabState<T>(storeId: string, tabId: string): T | null {
    return this.tabStateCache.get(storeId)?.get(tabId) || null;
  }

  setTabState<T>(storeId: string, tabId: string, state: T): void {
    let storeCache = this.tabStateCache.get(storeId);
    if (!storeCache) {
      storeCache = new Map();
      this.tabStateCache.set(storeId, storeCache);
    }
    storeCache.set(tabId, state);
  }

  clearTabState(storeId: string, tabId: string): void {
    this.tabStateCache.get(storeId)?.delete(tabId);
  }

  // Method to clear all stores for a specific tab
  clearAllStoresForTab(tabId: string): void {
    console.log(`Clearing stores for tab: ${tabId}`);
    
    // Track which stores had their tabState cleared
    const clearedStores = new Set<string>();
    
    // 1. Iterate through all stores and clear this tab's state from tabStateCache
    this.tabStateCache.forEach((tabStates, storeId) => {
      const hadTab = tabStates.has(tabId);
      tabStates.delete(tabId);
      if (hadTab) {
        clearedStores.add(storeId);
        console.log(`Cleared tab ${tabId} from store ${storeId} tabStateCache`);
      }
    });
    
    // 2. Reset store state for any store using this tab ID
    this.stores.forEach(({ store, config }, storeId) => {
      const state = store.getState();
      
      // If this store is currently using this tab ID or we previously cleared its cache
      if (state._metadata?.tabId === tabId || clearedStores.has(storeId)) {
        console.log(`Resetting store ${storeId} that was using tab ${tabId}`);
        
        // Reset to initial state
        store.setState({
          ...config.initialState,
          _metadata: {
            lastAccessed: Date.now(),
            lastUpdated: Date.now(),
            tabId: null,
            lastResetTab: null
          }
        });
      }
    });
    
    console.log(`Finished clearing stores for tab: ${tabId}`);
  }

  registerStore<T extends BaseState>(
    id: string, 
    store: StoreApi<T>, 
    config: StoreConfig<T>
  ): void {
    this.stores.set(id, { store, config });
    this.loadPersistedState(id);
  }

  private loadPersistedState(storeId: string) {
    const entry = this.stores.get(storeId);
    if (!entry) return;

    const { store, config } = entry;
    if (config.cache.strategy !== 'memory') {
      const storage = config.cache.strategy === 'persistent' 
        ? localStorage 
        : sessionStorage;
      
      const savedState = storage.getItem(`store_${storeId}`);
      if (savedState) {
        store.setState(JSON.parse(savedState));
      }
    }
  }

  private loadPersistedStores() {
    this.stores.forEach((_, id) => this.loadPersistedState(id));
  }

  private persistStore(storeId: string) {
    const entry = this.stores.get(storeId);
    if (!entry) return;

    const { store, config } = entry;
    if (config.cache.strategy !== 'memory') {
      const storage = config.cache.strategy === 'persistent' 
        ? localStorage 
        : sessionStorage;
      
      storage.setItem(
        `store_${storeId}`,
        JSON.stringify(store.getState())
      );
    }
  }

  private handleBeforeUnload() {
    this.stores.forEach((entry, id) => {
      if (!entry.config.cache.clearOnRefresh) {
        this.persistStore(id);
      }
    });
  }

  private cleanupExpiredStores() {
    this.stores.forEach(({ store, config }, id) => {
      if (config.cache.expiryTime > 0) {
        const state = store.getState();
        const lastAccessed = state._metadata?.lastAccessed || Date.now();
        const expiryTime = config.cache.expiryTime * 60 * 1000;
        
        if (Date.now() - lastAccessed > expiryTime) {
          store.setState(config.initialState);
          if (config.cache.strategy !== 'memory') {
            const storage = config.cache.strategy === 'persistent' 
              ? localStorage 
              : sessionStorage;
            storage.removeItem(`store_${id}`);
          }
        }
      }
    });
  }

  updateStoresTabId(newTabId: string) {
    this.stores.forEach(({ store, config }) => {
      const state = store.getState();
      const currentTabId = state._metadata?.tabId;
      const lastResetTab = state._metadata?.lastResetTab;

      // Only proceed if we're switching to a different tab
      if (currentTabId !== newTabId) {
        switch (config.cache.tabBehavior) {
          case 'reset':
            // Only reset if we haven't reset for this tab before
            if (lastResetTab !== newTabId) {
              store.setState({
                ...config.initialState,
                _metadata: { 
                  lastAccessed: Date.now(),
                  lastUpdated: Date.now(),
                  tabId: newTabId,
                  lastResetTab: newTabId  // Track that we've reset for this tab
                }
              });
            } else {
              // Just update the tab ID and timestamps
              store.setState({
                ...state,
                _metadata: { 
                  ...state._metadata,
                  lastAccessed: Date.now(),
                  tabId: newTabId
                }
              });
            }
            break;

          case 'persist':
            // Just update the tab ID and timestamp
            store.setState({
              ...state,
              _metadata: { 
                ...state._metadata,
                lastAccessed: Date.now(),
                tabId: newTabId
              }
            });
            break;
        }
      }
    });
  }

  // Debug method to dump the current state of tab caches
  dumpTabStateCaches(): void {
    console.log('=== STORE MANAGER TAB STATE CACHE DUMP ===');
    let totalEntries = 0;
    
    this.tabStateCache.forEach((tabStates, storeId) => {
      const tabIds = Array.from(tabStates.keys());
      console.log(`Store ${storeId} has tab states for: ${tabIds.join(', ')}`);
      totalEntries += tabIds.length;
    });
    
    console.log(`Total entries across all stores: ${totalEntries}`);
    console.log('=== END DUMP ===');
  }
}

export const storeManager = StoreManager.getInstance(); 