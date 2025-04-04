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

  // Map<storeId, Map<tabId, { dirtyKeys: Set<string>, state: any }>>
  private tabStateCache = new Map<string, Map<string, { dirtyKeys: Set<string>, state: any }>>();

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
    const storeCache = this.tabStateCache.get(storeId);
    if (!storeCache) return null;
    
    const cachedEntry = storeCache.get(tabId);
    if (!cachedEntry) return null;
    
    const { dirtyKeys, state } = cachedEntry;
    
    // Get initial state from store configuration
    const storeInfo = this.stores.get(storeId);
    if (!storeInfo) return null;
    
    const { config } = storeInfo;
    const initialState = config.initialState;
    
    // Create a new state object by merging initial state with dirty values
    const mergedState = { ...initialState };
    
    // Apply only the dirty properties from the cached state
    dirtyKeys.forEach(key => {
      this.setNestedProperty(mergedState, key, this.getNestedProperty(state, key));
    });
    
    return mergedState as T;
  }

  setTabState<T extends object>(storeId: string, tabId: string, newState: T, previousState?: T): void {
    let storeCache = this.tabStateCache.get(storeId);
    if (!storeCache) {
      storeCache = new Map();
      this.tabStateCache.set(storeId, storeCache);
    }
    
    // Get initial state from store configuration
    const storeInfo = this.stores.get(storeId);
    if (!storeInfo) {
      // Fallback for unknown stores
      storeCache.set(tabId, { dirtyKeys: new Set<string>(), state: newState });
      return;
    }
    
    const { config } = storeInfo;
    const initialState = config.initialState;
    
    // Get or initialize the cached entry
    let cachedEntry = storeCache.get(tabId);
    if (!cachedEntry) {
      cachedEntry = { dirtyKeys: new Set<string>(), state: {} };
    }
    
    // Find what has changed from initial state
    const dirtyKeys = this.findDirtyKeys(initialState, newState, previousState || cachedEntry.state);
    
    // Add new dirty keys to the existing set
    const updatedDirtyKeys = new Set([...cachedEntry.dirtyKeys, ...dirtyKeys]);
    
    // Create a new state object with only the dirty properties
    const filteredState = {};
    updatedDirtyKeys.forEach(key => {
      this.setNestedProperty(filteredState, key, this.getNestedProperty(newState, key));
    });
    
    // Store only the filtered state with dirty keys
    storeCache.set(tabId, { 
      dirtyKeys: updatedDirtyKeys, 
      state: filteredState 
    });
  }

  clearTabState(storeId: string, tabId: string): void {
    const storeCache = this.tabStateCache.get(storeId);
    if (storeCache) {
      storeCache.delete(tabId);
    }
  }

  // Find keys that have changed from previous state or differ from initial state
  private findDirtyKeys(initialState: any, newState: any, previousState: any, prefix = ''): Set<string> {
    const dirtyKeys = new Set<string>();
    
    // Skip if any state is null or undefined
    if (!initialState || !newState) return dirtyKeys;
    
    // For primitive types, directly compare with initial and previous states
    if (typeof newState !== 'object') {
      if (newState !== initialState) {
        dirtyKeys.add(prefix);
      }
      return dirtyKeys;
    }
    
    // Handle objects
    Object.keys(newState).forEach(key => {
      // Skip methods and internal properties
      if (typeof newState[key] === 'function' || key.startsWith('_')) {
        return;
      }
      
      const newPath = prefix ? `${prefix}.${key}` : key;
      const prevValue = previousState?.[key];
      const newValue = newState[key];
      const initialValue = initialState[key];
      
      // Handle arrays and dates (compare serialized forms)
      if (Array.isArray(newValue) || newValue instanceof Date) {
        if (JSON.stringify(newValue) !== JSON.stringify(prevValue) || 
            JSON.stringify(newValue) !== JSON.stringify(initialValue)) {
          dirtyKeys.add(newPath);
        }
      }
      // Recursively check nested objects
      else if (newValue && typeof newValue === 'object') {
        const nestedDirtyKeys = this.findDirtyKeys(
          initialValue || {}, 
          newValue, 
          prevValue || {}, 
          newPath
        );
        nestedDirtyKeys.forEach(key => dirtyKeys.add(key));
      }
      // Compare primitive values
      else if (newValue !== prevValue || newValue !== initialValue) {
        dirtyKeys.add(newPath);
      }
    });
    
    return dirtyKeys;
  }

  // Helper to get a nested property using dot notation
  private getNestedProperty(obj: any, path: string): any {
    if (!path) return obj;
    
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    
    return current;
  }

  // Helper to set a nested property using dot notation
  private setNestedProperty(obj: any, path: string, value: any): void {
    if (!path) return;
    
    const parts = path.split('.');
    let current = obj;
    
    // Build the path
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
    
    // Set the value at the final path
    current[parts[parts.length - 1]] = value;
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