import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = 'http://localhost:8080';

// ── 타입 ─────────────────────────────────────────────────
export interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  sendVerificationEmail: (email: string) => Promise<{ ok: boolean; error?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (nickname: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string, autoLogin?: boolean) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// ── Context ─────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 세션 복원 (API 연동 시 /api/auth/me 호출)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setUser(result.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user session', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/verification/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (result.success) return { ok: true };
      return { ok: false, error: result.message || '인증 코드 발송에 실패했습니다.' };
    } catch (e) {
      return { ok: false, error: '서버와 통신할 수 없습니다.' };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/verification/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const result = await response.json();
      if (result.success) return { ok: true };
      return { ok: false, error: result.message || '인증 실패' };
    } catch (e) {
      return { ok: false, error: '서버와 통신할 수 없습니다.' };
    }
  };

  const signup = async (nickname: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, password })
      });
      const result = await response.json();
      if (result.success) {
        return { ok: true };
      }
      return { ok: false, error: result.message || '회원가입 실패' };
    } catch (e) {
      return { ok: false, error: '서버와 통신할 수 없습니다.' };
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success && result.data) {
        setUser(result.data);
        return { ok: true };
      }
      return { ok: false, error: result.message || '로그인 실패' };
    } catch (e) {
      return { ok: false, error: '서버와 통신할 수 없습니다.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendVerificationEmail, verifyEmail, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
