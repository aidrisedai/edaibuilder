"use client";

import { create } from "zustand";
import type { User } from "@/types/database";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  addXp: (amount: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  addXp: (amount) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, founder_xp: state.user.founder_xp + amount }
        : null,
    })),
}));
