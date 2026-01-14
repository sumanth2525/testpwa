// Firebase configuration and temporary storage setup
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;

// Temporary storage implementation for development
// This will be replaced with Firebase when you set up your project

interface StorageItem {
  value: any;
  timestamp: number;
  expiresAt?: number;
}

class TemporaryStorage {
  private storage: Map<string, StorageItem> = new Map();
  private prefix = 'life_productivity_hub_';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  setItem(key: string, value: any, expiresIn?: number): void {
    const storageKey = this.getKey(key);
    const item: StorageItem = {
      value,
      timestamp: Date.now(),
      expiresAt: expiresIn ? Date.now() + expiresIn : undefined
    };
    this.storage.set(storageKey, item);
    
    // Also store in localStorage for persistence
    try {
      localStorage.setItem(storageKey, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to store in localStorage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    const storageKey = this.getKey(key);
    
    // Try memory first
    let item = this.storage.get(storageKey);
    
    // If not in memory, try localStorage
    if (!item) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          item = JSON.parse(stored);
          if (item) {
            this.storage.set(storageKey, item);
          }
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }

    if (!item) return null;

    // Check expiration
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.removeItem(key);
      return null;
    }

    return item.value;
  }

  removeItem(key: string): void {
    const storageKey = this.getKey(key);
    this.storage.delete(storageKey);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    this.storage.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  // Get all keys with our prefix
  getAllKeys(): string[] {
    const keys: string[] = [];
    try {
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      });
    } catch (error) {
      console.warn('Failed to get keys from localStorage:', error);
    }
    return keys;
  }
}

// Export temporary storage instance
export const tempStorage = new TemporaryStorage();

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  TASKS: 'tasks',
  NOTES: 'notes',
  TRANSACTIONS: 'transactions',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LAST_SYNC: 'last_sync'
} as const;

// Helper functions for data persistence
export const persistData = <T>(key: string, data: T): void => {
  tempStorage.setItem(key, data);
};

export const retrieveData = <T>(key: string): T | null => {
  return tempStorage.getItem<T>(key);
};

export const clearData = (key: string): void => {
  tempStorage.removeItem(key);
};

export const clearAllData = (): void => {
  tempStorage.clear();
};
