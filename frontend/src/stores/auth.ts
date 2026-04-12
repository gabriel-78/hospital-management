import { apolloClient } from "@/lib/apollo";
import { LOGIN } from "@/lib/graphql/mutations/login";
import { REGISTER } from "@/lib/graphql/mutations/register";
import type { LoginInput, RegisterInput, User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RegisterMutationData = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type LoginMutationData = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<boolean>;
  signup: (data: RegisterInput) => Promise<boolean>;
  logout: () => void;
  updateUser: (value: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      updateUser: (value: User) => {
        set({ user: value });
      },
      login: async (value: LoginInput) => {
        try {
          const { data } = await apolloClient.mutate<LoginMutationData>({
            mutation: LOGIN,
            variables: {
              data: {
                email: value.email,
                password: value.password,
              },
            },
          });

          if (data?.login) {
            const { token, user } = data.login;

            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token: token,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error) {
          console.log("Erro ao fazer o login");

          throw error;
        }
      },
      signup: async (value: RegisterInput) => {
        try {
          const { data } = await apolloClient.mutate<RegisterMutationData>({
            mutation: REGISTER,
            variables: {
              data: {
                name: value.name,
                email: value.email,
                password: value.password,
              },
            },
          });

          if (data?.register) {
            const { token, user } = data.register;

            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token: token,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error) {
          console.log("Erro ao fazer o cadastro");

          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        apolloClient.clearStore();
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
