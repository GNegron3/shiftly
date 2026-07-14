import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface KVStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

function createStorage(): KVStorage {
  // Native: encrypted SecureStore keychain
  if (Platform.OS !== 'web') {
    return {
      getItem: (key) => SecureStore.getItemAsync(key),
      setItem: (key, value) => SecureStore.setItemAsync(key, value),
      removeItem: (key) => SecureStore.deleteItemAsync(key),
    };
  }

  // Browser web: localStorage persists sessions and returnTo across refreshes
  if (typeof window !== 'undefined') {
    return {
      getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
      setItem: (key, value) => {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key) => {
        window.localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }

  // Node / static rendering: in-memory, no browser globals
  const store = new Map<string, string>();
  return {
    getItem: (key) => Promise.resolve(store.get(key) ?? null),
    setItem: (key, value) => {
      store.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      store.delete(key);
      return Promise.resolve();
    },
  };
}

export const kvStorage = createStorage();
