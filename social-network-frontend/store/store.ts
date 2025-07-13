import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: number;
  username: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, bio?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const useStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<User>('/auth/login', { username, password });
      set({ user: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Login failed', 
        loading: false 
      });
    }
  },
  
  register: async (username, password, bio) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<User>('/auth/register', { username, password, bio });
      set({ user: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Registration failed', 
        loading: false 
      });
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
  
  fetchCurrentUser: async () => {
    try {
      const response = await api.get<User>('/auth/me');
      set({ user: response.data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  },
}));

export default useStore;