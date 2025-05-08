import { create } from 'zustand';
import { TabState, TabInstance } from '../types/tab';
import { TAB_CONFIG } from '../config/tabRegistry';
import { storeManager } from './storeManager';

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  addTab: (tabType: string, data?: Record<string, any>) => {
    const config = TAB_CONFIG[tabType];
    if (!config) return null;

    let url = config.url.url;
    
    // Generate tab ID based on config and data
    let tabId = config.id;
    if (config.dynamicId && data && data[config.dynamicId]) {
      tabId = `${config.id}:${data[config.dynamicId]}`;
    }

    // Check if tab already exists
    const existingTab = get().tabs.find(tab => tab.id === tabId);
    if (existingTab) {
      get().setActiveTab(existingTab.id);
      return existingTab;
    }

    // Handle dynamic URLs with parameters
    if (data && Object.keys(data).length > 0) {
      Object.entries(data).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value as string);
      });
    }

    const newTab: TabInstance = {
      id: tabId,
      tabType,
      url,
      data
    };

    set(state => ({
      tabs: [...state.tabs, newTab],
      activeTabId: tabId
    }));

    return newTab;
  },

  removeTab: (tabId: string) => {
    // First, clear all store data associated with this tab
    storeManager.clearAllStoresForTab(tabId);
    
    set(state => {
      const newTabs = state.tabs.filter(tab => tab.id !== tabId);
      return {
        tabs: newTabs,
        activeTabId: state.activeTabId === tabId
          ? newTabs[newTabs.length - 1]?.id || null
          : state.activeTabId
      };
    });
  },

  setActiveTab: (tabId: string) => {
    set({ activeTabId: tabId });
  },

  closeAllTabsExceptCurrent: () => {
    const { tabs, activeTabId } = get();
    
    console.log(`closeAllTabsExceptCurrent called. Active tab: ${activeTabId}, Total tabs: ${tabs.length}`);
    
    if (!activeTabId || tabs.length <= 1) {
      console.log('No tabs to close or only one tab exists. Exiting.');
      return;
    }
    
    // Dump the current state of tab caches for debugging
    console.log('State BEFORE closing tabs:');
    storeManager.dumpTabStateCaches();
    
    // Get all tabs except the active one
    const tabsToClose = tabs.filter(tab => tab.id !== activeTabId);
    console.log(`Tabs to close: ${tabsToClose.length}`, tabsToClose.map(t => t.id));
    
    // Instead of just updating the state once at the end, we'll actually call removeTab
    // for each tab, but modify it slightly to avoid changing the activeTabId
    const safeRemoveTab = (tabId: string) => {
      console.log(`Safe removing tab: ${tabId}`);
      
      // Use the same store clearing logic as removeTab
      storeManager.clearAllStoresForTab(tabId);
      
      // But only update the tabs array, not the activeTabId
      set(state => ({
        ...state,
        tabs: state.tabs.filter(tab => tab.id !== tabId)
      }));
    };
    
    // Close each tab one by one
    tabsToClose.forEach(tab => {
      safeRemoveTab(tab.id);
    });
    
    // Dump the state again to verify stores were cleared
    console.log('State AFTER closing tabs:');
    storeManager.dumpTabStateCaches();
    
    console.log('closeAllTabsExceptCurrent completed');
  },

  // Add this method to generate unique tab instance IDs
  getTabInstanceId: (tabId: string, dataId?: string) => {
    const tab = get().tabs.find(t => t.id === tabId);
    if (!tab) return tabId;
    
    // For tabs with data (like project details), combine tab ID with data ID
    return dataId ? `${tab.tabType}:${dataId}` : tab.id;
  }
})); 