import { create } from 'zustand';
import api from '../lib/api';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'student' | 'developer' | 'admin' | 'mentor' | 'parent';
    grade: number;
    avatar: string;
    xp: number;
    level: number;
    rank: string;
    streak: number;
    longestStreak: number;
    badges: string[];
    solvedProblems: string[];
    subscription: string;
    theme: 'light' | 'dark';
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    theme: 'light' | 'dark';
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    loadUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    },

    register: async (formData: any) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/register', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.response?.data?.error || 'Registration failed');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
    },

    setTheme: (theme: 'light' | 'dark') => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
    },

    loadUser: () => {
        const stored = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (stored && token) {
            set({ user: JSON.parse(stored), token });
        }
        const theme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
    },
}));
