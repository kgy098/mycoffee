import { create } from 'zustand';

export interface User {
    isAuthenticated: boolean;
    data: {
        user_id: number,
        session_id: string,
        token: string,
        token_type: string,
        expires_in: number,
        result_code: string,
        result_message: string,
        phone?: string,
        display_name?: string,
        email?: string,
    }
    meta: {
        timestamp: string
    }
}

interface UserStore {
    user: User;
    setUser: (user: User) => void;
    resetUser: () => void;
}

const initialUser: User = {
    data: {
        user_id: 0,
        session_id: "",
        token: "",
        token_type: "",
        expires_in: 0,
        result_code: "",
        result_message: ""
    },
    meta: {
        timestamp: ""
    },
    isAuthenticated: false,
}

export const useUserStore = create<UserStore>((set) => ({
    user: initialUser,
    setUser: (user: User) => set({ user: {...user, isAuthenticated: true} }),
    resetUser: () => set({ user: initialUser}),
}));