declare module 'app2/app' {
  const App: React.ComponentType<any>;
  export default App;
}

declare module 'app2/sharedComponents' {
  export const ComponentOne: React.ComponentType<any>;
  export const ComponentTwo: React.ComponentType<any>;
  export function sharingFunction(): void;
}

declare module 'viteapp/app' {
  const App: React.ComponentType<any>;
  export default App;
}

declare module 'root/storeUtils' {
  import { StoreApi, UseBoundStore } from 'zustand';
  import { BaseState, StoreConfig } from 'root/storeTypes';
  
  export function createStore<T extends BaseState>(config: StoreConfig<T>): UseBoundStore<StoreApi<T>>;
}

declare module 'root/storeTypes' {
  export type CacheStrategy = 'memory' | 'localStorage' | 'sessionStorage';
  export type TabBehavior = 'persist' | 'reset';
  
  export interface BaseState {
    [key: string]: any;
  }
  
  export interface StoreConfig<T extends BaseState> {
    id: string;
    initialState: Partial<T>;
    methods: (
      set: (state: Partial<T>) => void,
      get: () => T
    ) => Record<string, any>;
    cache?: {
      expiryTime?: number;
      strategy?: CacheStrategy;
      tabBehavior?: TabBehavior;
      clearOnRefresh?: boolean;
    };
  }
}

declare module 'root/storeManager' {
  import { StoreApi } from 'zustand';
  import { BaseState, StoreConfig } from 'root/storeTypes';
  
  export const storeManager: {
    registerStore: <T extends BaseState>(id: string, store: StoreApi<T>, config: StoreConfig<T>) => void;
    getTabState: <T>(storeId: string, tabId: string) => T | null;
    setTabState: <T>(storeId: string, tabId: string, state: T) => void;
    clearTabState: (storeId: string, tabId: string) => void;
    updateStoresTabId: (newTabId: string) => void;
    stores: Map<string, {
      store: StoreApi<any>;
      config: StoreConfig<any>;
    }>;
  };
}

declare module 'root/tabStore' {
  export const useTabStore: any;
}

// Declare global window property for storeManager singleton
declare global {
  interface Window {
    __FEDERATED_STORE_MANAGER__: any;
  }
} 