import { useState } from 'react';

// storeManager.ts
export const useLocalState = <T>(initial: T) => {
    return useState<T>(initial);
};