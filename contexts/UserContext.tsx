import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  photoUri?: string;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = '@drop_logistics_user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // For now, we'll simulate a login with mock data
      
      // Check if user exists in storage (for demo purposes)
      const existingUser = await AsyncStorage.getItem(`${STORAGE_KEY}_${email}`);
      
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        // Simple password check (in production, this should be done server-side)
        if (userData.password === password) {
          const { password: _, ...userWithoutPassword } = userData;
          setUser(userWithoutPassword);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // For now, we'll store user data locally
      
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        fullName,
        email,
        phone,
        address: '',
        createdAt: new Date().toISOString(),
        password,
      };

      // Store user with email as key for login lookup
      await AsyncStorage.setItem(`${STORAGE_KEY}_${email}`, JSON.stringify(newUser));
      
      // Store as current user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Also update the email-keyed storage if email hasn't changed
      const userData = await AsyncStorage.getItem(`${STORAGE_KEY}_${user.email}`);
      if (userData) {
        const fullUserData = JSON.parse(userData);
        await AsyncStorage.setItem(
          `${STORAGE_KEY}_${user.email}`,
          JSON.stringify({ ...fullUserData, ...updates })
        );
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
