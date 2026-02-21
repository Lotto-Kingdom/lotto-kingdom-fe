import { useState, useRef, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TermsOfService } from './TermsOfService';
import { PrivacyPolicy } from './PrivacyPolicy';

type Mode = 'login' | 'signup' | 'verify';

interface Props {
  initialMode?: 'login' | 'signup';
  onClose: () => void;
}

// ── 입력 필드 ─────────────────────────────────────────────
function Field({
  label, type, value, onChange, placeholder, icon: Icon, error, disabled,
}: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon: React.ElementType; error?: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white'
        }`}>
        <Icon className={`w-4 h-4 flex-shrink-0 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} className="text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

// ── 메인 모달 ──────────────────────────────────────────────
export function AuthModal({ initialMode = 'login', onClose }: Props) {
  const { login, signup, verifyEmail } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);

  // 로그인
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // 회원가입
  const [signupNick, setSignupNick] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPwCf, setSignupPwCf] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [viewingPolicy, setViewingPolicy] = useState<'terms' | 'privacy' | null>(null);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupLoading, setSignupLoading] = useState(false);

  // 이메일 인증
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // 코드 입력 6칸 ref
  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    setVerifyCode(codeDigits.join(''));
  }, [codeDigits]);

  const handleCodeInput = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...codeDigits];
    next[idx] = digit;
    setCodeDigits(next);
    if (digit && idx < 5) codeRefs[idx + 1].current?.focus();
  };

  const handleCodeKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeDigits[idx] && idx > 0) {
      codeRefs[idx - 1].current?.focus();
    }
  };

  // 배경 클릭 닫기
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── 로그인 제출 ──────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPw) { setLoginError('이메일과 비밀번호를 입력해 주세요.'); return; }
    setLoginLoading(true);
    const res = await login(loginEmail, loginPw);
    setLoginLoading(false);
    if (res.ok) { onClose(); } else { setLoginError(res.error ?? '로그인 실패'); }
  };

  // ── 회원가입 제출 ────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!signupNick) errs.nick = '닉네임을 입력해 주세요.';
    else if (signupNick.length < 2) errs.nick = '닉네임은 2자 이상이어야 합니다.';
    if (!signupEmail) errs.email = '이메일을 입력해 주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) errs.email = '올바른 이메일 형식이 아닙니다.';
    if (!signupPw) errs.pw = '비밀번호를 입력해 주세요.';
    else if (signupPw.length < 6) errs.pw = '비밀번호는 6자 이상이어야 합니다.';
    if (signupPw !== signupPwCf) errs.pwcf = '비밀번호가 일치하지 않습니다.';
    if (!agreeTerms) errs.terms = '이용약관에 동의해 주세요.';
    if (!agreePrivacy) errs.privacy = '개인정보 수집 및 이용에 동의해 주세요.';
    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSignupLoading(true);
    const res = await signup(signupNick, signupEmail, signupPw);
    setSignupLoading(false);
    if (res.ok) {
      setPendingEmail(signupEmail);
      setMode('verify');
    } else {
      setSignupErrors({ email: res.error ?? '회원가입 실패' });
    }
  };

  // ── 인증 코드 제출 ────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.length < 6) { setVerifyError('6자리 코드를 모두 입력해 주세요.'); return; }
    setVerifyLoading(true);
    const res = await verifyEmail(pendingEmail, verifyCode);
    setVerifyLoading(false);
    if (res.ok) { onClose(); } else { setVerifyError(res.error ?? '인증 실패'); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg">
              {mode === 'login' ? '로그인' : mode === 'signup' ? '회원가입' : '이메일 인증'}
            </h2>
            <p className="text-white/70 text-xs mt-0.5">
              {mode === 'login' ? '로또나라 계정으로 로그인하세요'
                : mode === 'signup' ? '새 계정을 만들어보세요'
                  : `${pendingEmail} 로 발송된 코드를 입력하세요`}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* 탭 (로그인/회원가입) */}
        {mode !== 'verify' && (
          <div className="flex border-b border-gray-100">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === m
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {m === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>
        )}

        <div className="p-6">

          {/* ── 로그인 폼 ─────────────────────────────────── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="이메일" type="email" value={loginEmail} onChange={setLoginEmail}
                placeholder="example@email.com" icon={Mail} />
              <Field label="비밀번호" type="password" value={loginPw} onChange={setLoginPw}
                placeholder="비밀번호 입력" icon={Lock} />
              {loginError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                로그인
              </button>
              <p className="text-center text-xs text-gray-400">
                계정이 없으신가요?{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-blue-600 font-bold hover:underline">
                  회원가입
                </button>
              </p>
            </form>
          )}

          {/* ── 회원가입 폼 ───────────────────────────────── */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <Field label="닉네임" type="text" value={signupNick} onChange={setSignupNick}
                placeholder="2자 이상" icon={User} error={signupErrors.nick} />
              <Field label="이메일" type="email" value={signupEmail} onChange={setSignupEmail}
                placeholder="example@email.com" icon={Mail} error={signupErrors.email} />
              <Field label="비밀번호" type="password" value={signupPw} onChange={setSignupPw}
                placeholder="6자 이상" icon={Lock} error={signupErrors.pw} />
              <Field label="비밀번호 확인" type="password" value={signupPwCf} onChange={setSignupPwCf}
                placeholder="비밀번호 재입력" icon={Lock} error={signupErrors.pwcf} />

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                    <CheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    <span className="text-blue-600 font-bold">[필수]</span> 이용약관 동의
                  </span>
                  <button type="button" onClick={() => setViewingPolicy('terms')} className="ml-auto text-xs text-gray-400 hover:text-blue-600 underline">보기</button>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                    <CheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    <span className="text-blue-600 font-bold">[필수]</span> 개인정보 수집 및 이용 동의
                  </span>
                  <button type="button" onClick={() => setViewingPolicy('privacy')} className="ml-auto text-xs text-gray-400 hover:text-blue-600 underline">보기</button>
                </label>

                {(signupErrors.terms || signupErrors.privacy) && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-red-600 text-xs mt-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>필수 약관에 모두 동의해 주세요.</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {signupLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                가입하고 인증 메일 받기
              </button>
              <p className="text-center text-xs text-gray-400">
                이미 계정이 있으신가요?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-blue-600 font-bold hover:underline">
                  로그인
                </button>
              </p>
            </form>
          )}

          {/* ── 이메일 인증 화면 ──────────────────────────── */}
          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold text-gray-800">{pendingEmail}</span><br />
                  으로 인증 코드를 발송했습니다.<br />
                  <span className="text-xs text-gray-400">(Mock 모드: 코드는 <strong>123456</strong> 입니다)</span>
                </p>
              </div>

              {/* 6칸 코드 입력 */}
              <div className="flex justify-center gap-2">
                {codeDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={codeRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleCodeInput(i, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(i, e)}
                    className={`w-11 h-14 text-center text-xl font-black rounded-xl border-2 transition-colors outline-none ${d ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50'
                      } focus:border-blue-400`}
                  />
                ))}
              </div>

              {verifyError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{verifyError}
                </div>
              )}

              <button
                type="submit"
                disabled={verifyLoading || verifyCode.length < 6}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {verifyLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />인증 중...</>
                  : <><CheckCircle className="w-4 h-4" />인증 완료</>
                }
              </button>
            </form>
          )}

        </div>
      </div>

      {/* 정책 모달 오버레이 (AuthModal 위쪽 layer) */}
      {viewingPolicy && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-start justify-center animate-fade-in"
          onClick={() => setViewingPolicy(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl my-4 sm:my-8 animate-slide-up"
          >
            <button
              onClick={() => setViewingPolicy(null)}
              className="absolute top-10 right-8 sm:top-14 sm:right-12 z-10 w-10 h-10 flex items-center justify-center bg-gray-100/80 hover:bg-gray-200 text-gray-700 rounded-full transition-colors backdrop-blur-sm shadow-sm"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="policy-modal-container bg-white/50 rounded-3xl p-1 shadow-2xl">
              {viewingPolicy === 'terms' ? <TermsOfService /> : <PrivacyPolicy />}
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setViewingPolicy(null)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
