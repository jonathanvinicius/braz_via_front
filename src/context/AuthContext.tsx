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

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
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
        const result = await api<{ accessToken: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
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
