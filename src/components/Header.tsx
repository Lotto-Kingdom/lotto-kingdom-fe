import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, MapPin, User, Dices, Trophy, Crown, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { BottomNav } from './BottomNav';

export function Header() {
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuGroups = [
    {
      label: '번호 생성',
      icon: Dices,
      path: '/',
    },
    {
      label: '당첨',
      icon: Trophy,
      submenu: [
        { label: '역대 당첨번호', path: '/winning' },
        { label: '역대 당첨판매점', path: '/region' },
      ],
    },
    {
      label: '통계',
      icon: TrendingUp,
      path: '/stats',
    },
    {
      label: '당첨 판매점 찾기',
      icon: MapPin,
      path: '/store/nearby',
    },
  ];

  const handleMenuClick = (path: string | null) => {
    if (path) {
      navigate(path);
    } else {
      alert('준비중인 페이지입니다');
    }
  };

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  // CustomEvent 리스너 추가
  useEffect(() => {
    const handleOpenAuthModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      setAuthModal(customEvent.detail === 'signup' ? 'signup' : 'login');
    };
    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => window.removeEventListener('openAuthModal', handleOpenAuthModal);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* 로고 */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
                  로또나라
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Lotto Kingdom</p>
              </div>
            </button>

            {/* 데스크톱 메뉴 */}
            <div className="hidden md:flex items-center justify-end gap-6 ml-auto">
              <nav className="flex items-center gap-2">
                {menuGroups.map((group, index) => {
                  const isActive = group.path && location.pathname === group.path || group.submenu?.some(sub => location.pathname === sub.path);
                  return (
                    <div key={index} className="relative group py-2">
                      <button
                        onClick={() => group.path ? handleMenuClick(group.path) : undefined}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                      >
                        <group.icon className="w-5 h-5" />
                        <span className="font-medium">{group.label}</span>
                        {group.submenu && <ChevronDown className="w-4 h-4" />}
                      </button>
                      {group.submenu && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <div className="w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                            {group.submenu.map((sub, i) => (
                              <button
                                key={i}
                                onClick={() => handleMenuClick(sub.path)}
                                className={`w-full text-left px-4 py-2.5 text-sm ${location.pathname === sub.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleMenuClick('/my-numbers')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${location.pathname === '/my-numbers' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-bold">내 번호</span>
                </button>
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">{user.nickname[0]}</div>
                       <span className="text-sm font-semibold">{user.nickname}</span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <button onClick={() => { navigate('/my-numbers'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                          <User className="w-4 h-4" /> 내 번호 기록
                        </button>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50">로그아웃</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setAuthModal('login')} className="px-3 py-2 text-sm font-bold text-gray-700">로그인</button>
                    <button onClick={() => setAuthModal('signup')} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl">회원가입</button>
                  </div>
                )}
              </div>
            </div>
            {/* 모바일: 우측 유저 버튼 (로그인 버튼은 BottomNav로 이동) */}
            <div className="md:hidden">
              {user && (
                <button
                  onClick={() => handleMenuClick('/my-numbers')}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                >
                  {user.nickname[0].toUpperCase()}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 하단 내비게이션 */}
      <BottomNav onLoginClick={() => setAuthModal('login')} />

      {authModal && (
        <AuthModal initialMode={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
