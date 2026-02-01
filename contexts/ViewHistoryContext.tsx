import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ViewHistoryItem {
  companyId: string;
  companyName: string;
  companyLogo: string;
  viewedAt: number; // timestamp
}

interface ViewHistoryContextType {
  history: ViewHistoryItem[];
  addToHistory: (companyId: string, companyName: string, companyLogo: string) => void;
  clearHistory: () => Promise<void>;
  removeFromHistory: (companyId: string) => Promise<void>;
  getRecentViews: (limit?: number) => ViewHistoryItem[];
}

const ViewHistoryContext = createContext<ViewHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'view_history';
const MAX_HISTORY_ITEMS = 50; // Maximum items to keep in history

export const ViewHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<ViewHistoryItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Sort by viewedAt descending (most recent first)
          const sorted = parsed.sort((a: ViewHistoryItem, b: ViewHistoryItem) => b.viewedAt - a.viewedAt);
          setHistory(sorted);
        }
      } catch (e) {
        console.error('Failed to load view history', e);
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadHistory();
  }, []);

  // Save to AsyncStorage whenever history changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad && history.length >= 0) {
      const saveHistory = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
          console.error('Failed to save view history', e);
        }
      };
      saveHistory();
    }
  }, [history, isInitialLoad]);

  const addToHistory = (companyId: string, companyName: string, companyLogo: string) => {
    setHistory((prev) => {
      // Remove existing entry if it exists
      const filtered = prev.filter((item) => item.companyId !== companyId);
      
      // Add new entry at the beginning
      const newItem: ViewHistoryItem = {
        companyId,
        companyName,
        companyLogo,
        viewedAt: Date.now(),
      };
      
      return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear view history', e);
    }
  };

  const removeFromHistory = async (companyId: string) => {
    setHistory((prev) => {
      return prev.filter((item) => item.companyId !== companyId);
    });
  };

  const getRecentViews = (limit: number = 10): ViewHistoryItem[] => {
    return history.slice(0, limit);
  };

  return (
    <ViewHistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        removeFromHistory,
        getRecentViews,
      }}
    >
      {children}
    </ViewHistoryContext.Provider>
  );
};

export const useViewHistory = () => {
  const context = useContext(ViewHistoryContext);
  if (context === undefined) {
    throw new Error('useViewHistory must be used within a ViewHistoryProvider');
  }
  return context;
};
