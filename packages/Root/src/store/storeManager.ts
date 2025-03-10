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

  // New method to clear all stores for a specific tab
  clearAllStoresForTab(tabId: string): void {
    // Iterate through all stores and clear this tab's state
    this.tabStateCache.forEach((tabStates, storeId) => {
      tabStates.delete(tabId);
    });
    
    // Also reset any store that's currently using this tab's state
    this.stores.forEach(({ store, config }) => {
      const state = store.getState();
      if (state._metadata?.tabId === tabId) {
        store.setState({
          ...config.initialState,
          _metadata: {
            ...state._metadata,
            tabId: null
          }
        });
      }
    });
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
}

export const storeManager = StoreManager.getInstance(); 