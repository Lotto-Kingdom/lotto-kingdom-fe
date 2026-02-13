import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ── 타입 ─────────────────────────────────────────────────
export interface User {
  id: string;
  nickname: string;
  email: string;
  emailVerified: boolean;
  createdAt: number;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (nickname: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

// ── localStorage 키 ──────────────────────────────────────
const USERS_KEY    = 'lotto_users';
const SESSION_KEY  = 'lotto_session';
const PENDING_KEY  = 'lotto_pending'; // 미인증 임시 사용자

interface StoredUser extends User {
  passwordHash: string;
}

// ── 간단한 해시 (mock용, 실제 운영 시 서버에서 처리) ──────
async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Context ─────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 세션 복원
  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const found = loadUsers().find(u => u.id === sessionId);
      if (found && found.emailVerified) {
        const { passwordHash: _, ...rest } = found;
        void _;
        setUser(rest);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  // 회원가입 (이메일 미인증 상태로 저장 → 인증 코드 입력 대기)
  const signup = async (nickname: string, email: string, password: string) => {
    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      return { ok: false, error: '이미 사용 중인 이메일입니다.' };
    }
    if (nickname.length < 2) return { ok: false, error: '닉네임은 2자 이상이어야 합니다.' };
    if (password.length < 6)  return { ok: false, error: '비밀번호는 6자 이상이어야 합니다.' };

    const hash = await hashPassword(password);
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      nickname,
      email,
      emailVerified: false,
      createdAt: Date.now(),
      passwordHash: hash,
    };
    users.push(newUser);
    saveUsers(users);

    // 인증 코드 임시 저장 (mock: 고정 코드 123456, 실제 API 연동 시 서버에서 발송)
    localStorage.setItem(PENDING_KEY, JSON.stringify({ email, code: '123456' }));
    return { ok: true };
  };

  // 이메일 인증 코드 확인
  const verifyEmail = async (email: string, code: string) => {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return { ok: false, error: '인증 정보를 찾을 수 없습니다. 다시 가입해 주세요.' };
    const pending = JSON.parse(raw) as { email: string; code: string };

    if (pending.email !== email) return { ok: false, error: '인증 정보가 일치하지 않습니다.' };
    if (code.trim() !== pending.code) return { ok: false, error: '인증 코드가 올바르지 않습니다.' };

    const users = loadUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return { ok: false, error: '사용자 정보를 찾을 수 없습니다.' };

    users[idx].emailVerified = true;
    saveUsers(users);
    localStorage.removeItem(PENDING_KEY);

    const { passwordHash: _, ...rest } = users[idx];
    void _;
    setUser(rest);
    localStorage.setItem(SESSION_KEY, rest.id);
    return { ok: true };
  };

  // 로그인
  const login = async (email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(u => u.email === email);
    if (!found) return { ok: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    if (!found.emailVerified) return { ok: false, error: '이메일 인증이 완료되지 않았습니다. 인증 메일을 확인해 주세요.' };

    const hash = await hashPassword(password);
    if (found.passwordHash !== hash) return { ok: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };

    const { passwordHash: _, ...rest } = found;
    void _;
    setUser(rest);
    localStorage.setItem(SESSION_KEY, rest.id);
    return { ok: true };
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, verifyEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
