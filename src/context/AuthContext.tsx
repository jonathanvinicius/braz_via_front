import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from '../lib/auth';

export type LoginSuccess = { status: 'authenticated' };

export type LoginNewPasswordRequired = {
  status: 'new_password_required';
  email: string;
  session: string;
};

export type LoginResult = LoginSuccess | LoginNewPasswordRequired;

type AuthLoginResponse = {
  accessToken?: string;
  challenge?: string;
  session?: string;
  email?: string;
};

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  completeNewPassword: (
    email: string,
    newPassword: string,
    session: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAdminToken());

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login: async (email, password) => {
        const result = await api<AuthLoginResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
          if (!result.session) {
            throw new Error('Sessão Cognito ausente para troca de senha');
          }
          return {
            status: 'new_password_required',
            email: result.email ?? email,
            session: result.session,
          };
        }

        if (!result.accessToken) {
          throw new Error('Token de acesso não retornado');
        }

        setAdminToken(result.accessToken);
        setToken(result.accessToken);
        return { status: 'authenticated' };
      },
      completeNewPassword: async (email, newPassword, session) => {
        const result = await api<{ accessToken: string }>(
          '/auth/complete-password',
          {
            method: 'POST',
            body: JSON.stringify({ email, newPassword, session }),
          },
        );
        if (!result.accessToken) {
          throw new Error('Token de acesso não retornado');
        }
        setAdminToken(result.accessToken);
        setToken(result.accessToken);
      },
      logout: () => {
        clearAdminToken();
        setToken(null);
      },
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
