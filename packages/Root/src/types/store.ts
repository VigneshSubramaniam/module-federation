export type CacheStrategy = 'memory' | 'session' | 'persistent';

export type TabBehavior = 'persist' | 'reset';

export interface StoreCacheConfig {
  // How long to keep the state in memory (in minutes, 0 means forever)
  expiryTime: number;
  // Where to store the state
  strategy: CacheStrategy;
  // How the store behaves across tabs
  tabBehavior: TabBehavior;
  // Whether to clear on browser refresh
  clearOnRefresh: boolean;
}

export interface StoreMetadata {
  lastAccessed: number;
  lastUpdated: number;
  tabId: string | null;
  lastResetTab: string | null;  // Track the last tab that caused a reset
}

export interface BaseState {
  _metadata: StoreMetadata;
}

// Separate state and methods in store config
export interface StoreState<T> {
  [key: string]: any;
}

export interface StoreMethods<T> {
  [key: string]: (...args: any[]) => void;
}

export interface StoreConfig<T extends BaseState> {
  // Unique identifier for the store
  id: string;
  // Initial state
  initialState: StoreState<T>;
  // Methods that will be added to the store
  methods: (set: (state: Partial<T>) => void, get: () => T) => StoreMethods<T>;
  // Cache configuration
  cache: StoreCacheConfig;
}

// Type for the store registry
export type StoreRegistry = Map<string, StoreMetadata>; 