import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      idToken: null,
      accessToken: null,
      refreshToken: null,
      cognitoUsername: null,
      email: null,
      setToken: (data) => {
        set((state) => ({
          idToken: data["id_token"],
          accessToken: data["access_token"],
          refreshToken: data["refresh_token"],
          cognitoUsername: data["cognito_username"],
          email: data["email"],
        }));
      },
      clearStore: () => {
        set(() => ({
          idToken: null,
          accessToken: null,
          refreshToken: null,
          cognitoUsername: null,
          email: null,
        }));
      },
    }),
    {
      name: "authStore",
      getStorage: () => localStorage, // specify localStorage as the storage backend
    }
  )
);
