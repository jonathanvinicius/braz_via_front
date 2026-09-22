import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, ApiError } from '../lib/api';
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
  type AdminUser,
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

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  token: string | null;
  user: AdminUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  completeNewPassword: (
    email: string,
    newPassword: string,
    session: string,
  ) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [user, setUser] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    getAdminToken() ? 'loading' : 'unauthenticated',
  );

  const clearSession = useCallback(() => {
    clearAdminToken();
    setToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const refreshSession = useCallback(async () => {
    const currentToken = getAdminToken();
    if (!currentToken) {
      clearSession();
      return false;
    }

    try {
      const me = await api<AdminUser>('/auth/me');
      if (me.role !== 'admin') {
        clearSession();
        return false;
      }
      setToken(currentToken);
      setUser(me);
      setStatus('authenticated');
      return true;
    } catch (error) {
      clearSession();
      if (error instanceof ApiError) {
        return false;
      }
      return false;
    }
  }, [clearSession]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const onAuthCleared = () => {
      clearSession();
    };
    window.addEventListener('brazvia:auth-cleared', onAuthCleared);
    return () => {
      window.removeEventListener('brazvia:auth-cleared', onAuthCleared);
    };
  }, [clearSession]);

  const establishSession = useCallback(
    async (accessToken: string) => {
      setAdminToken(accessToken);
      setToken(accessToken);
      const ok = await refreshSession();
      if (!ok) {
        throw new Error('Acesso restrito a administradores.');
      }
    },
    [refreshSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      status,
      isAuthenticated: status === 'authenticated' && Boolean(user),
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

        await establishSession(result.accessToken);
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
        await establishSession(result.accessToken);
      },
      logout: () => {
        clearSession();
      },
      refreshSession,
    }),
    [token, user, status, establishSession, clearSession, refreshSession],
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
