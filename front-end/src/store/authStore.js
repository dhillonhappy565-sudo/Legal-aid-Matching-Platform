import { create } from "zustand";

const STORAGE_USER = "auth_user";
const STORAGE_ACCESS = "auth_access_token";
const STORAGE_REFRESH = "auth_refresh_token";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  login: ({ user, accessToken, refreshToken }) => {
    set({ user, accessToken, refreshToken });
    try {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_ACCESS, accessToken || "");
      localStorage.setItem(STORAGE_REFRESH, refreshToken || "");
    } catch (err) {
      console.error("Failed to save auth data", err);
    }
  },

  logout: () => {
    set({ user: null, accessToken: null, refreshToken: null });
    try {
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_ACCESS);
      localStorage.removeItem(STORAGE_REFRESH);
    } catch (err) {
      console.error("Failed to clear auth data", err);
    }
  },

  setTokens: ({ accessToken, refreshToken }) => {
    set((state) => ({
      ...state,
      accessToken: accessToken ?? state.accessToken,
      refreshToken: refreshToken ?? state.refreshToken,
    }));
    try {
      if (accessToken !== undefined) {
        localStorage.setItem(STORAGE_ACCESS, accessToken || "");
      }
      if (refreshToken !== undefined) {
        localStorage.setItem(STORAGE_REFRESH, refreshToken || "");
      }
    } catch (err) {
      console.error("Failed to store tokens", err);
    }
  },

  setUser: (user) => {
    set((state) => ({ ...state, user }));
    try {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    } catch (err) {
      console.error("Failed to store user", err);
    }
  },

  hydrate: () => {
    try {
      const userRaw = localStorage.getItem(STORAGE_USER);
      const access = localStorage.getItem(STORAGE_ACCESS);
      const refresh = localStorage.getItem(STORAGE_REFRESH);

      const user = userRaw ? JSON.parse(userRaw) : null;

      set({
        user: user || null,
        accessToken: access || null,
        refreshToken: refresh || null,
        isHydrated: true,
      });
    } catch (err) {
      console.error("Failed to hydrate auth store", err);
      set({ isHydrated: true });
    }
  },
}));
