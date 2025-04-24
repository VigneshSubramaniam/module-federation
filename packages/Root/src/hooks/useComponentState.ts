import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storeManager } from '../store/storeManager';

/**
 * Hook to manage component-scoped state
 * This state will be automatically reset when the component unmounts
 * 
 * @param useStore The Zustand store hook
 * @param selector Selector function to extract state
 * @param properties Array of property names that should be component-scoped
 * @returns The selected state values
 */
export function useComponentState<T, U>(
  useStore: any,
  selector: (state: T) => U,
  properties: string[]
): U {
  // Generate a unique component ID on first render
  const componentIdRef = useRef(uuidv4());
  const storeIdRef = useRef<string | null>(null);
  const registeredRef = useRef(false);
  
  // Get the current state
  const state = useStore(selector);
  
  // Identify the store if we haven't already
  if (!storeIdRef.current) {
    try {
      // Try to get store ID from the store's internal state
      const fullState = useStore.getState();
      
      if (fullState._metadata?.storeId) {
        storeIdRef.current = fullState._metadata.storeId;
      } else {
        // Find the store in the registry
        for (const [id, storeInfo] of storeManager.stores.entries()) {
          if (storeInfo.store.getState() === fullState) {
            storeIdRef.current = id;
            break;
          }
        }
      }
    } catch (e) {
      console.error('Failed to identify store in useComponentState:', e);
    }
  }
  
  // Register component state on mount, clean up on unmount
  useEffect(() => {
    const componentId = componentIdRef.current;
    const storeId = storeIdRef.current;
    
    if (storeId && !registeredRef.current) {
      storeManager.registerComponentState(storeId, componentId, properties);
      registeredRef.current = true;
    }
    
    return () => {
      if (storeId) {
        storeManager.cleanupComponentState(storeId, componentId, properties);
      }
    };
  }, [properties]);
  
  return state;
} 