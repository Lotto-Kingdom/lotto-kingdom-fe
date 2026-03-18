import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, MapPin, User, LogOut, LogIn, Dices, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { BottomNav } from './BottomNav';
import { ChevronDown } from 'lucide-react';

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
      label: '판매점 찾기',
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
      // User menu
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }

      // Other dropdowns (simple check by clicking outside any dropdown container)
      const target = e.target as Element;

      // 모바일 메뉴 안에서의 클릭은 전역 리스너가 dropdown을 강제로 닫지 않게 함
      if (target.closest('.mobile-nav-container')) {
        return;
      }

      // desktop dropdowns are CSS hover-based, nothing to close here
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  // CustomEvent 리스너 추가 (비로그인 CTA 등에서 모달을 띄우기 위함)
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
              <div>
                <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
                  로또나라
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Lotto Kingdom</p>
              </div>
            </button>

            {/* 데스크톱: 전체 화면 헤더 메뉴 */}
            <div className="hidden md:flex items-center justify-end gap-4 sm:gap-6 ml-auto">

              {/* 왼쪽/중앙 네비게이션 영역 */}
              <nav className="flex items-center gap-1 sm:gap-2">
                {menuGroups.map((group, index) => {
                  const isDropdownActive = group.submenu?.some(sub => location.pathname === sub.path);
                  const isMainMenuActive = group.path && location.pathname === group.path;
                  const isActive = isMainMenuActive || isDropdownActive;

                  return (
                    <div
                      key={index}
                      className="relative group py-2 nav-dropdown-container"
                    >
                      <button
                        onClick={() => group.path ? handleMenuClick(group.path) : undefined}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 text-gray-700'
                          }`}
                      >
                        <group.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`} />
                        <span className={`font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
                          {group.label}
                        </span>
                        {group.submenu && (
                          <ChevronDown className={`w-4 h-4 transition-transform group-hover:rotate-180 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        )}
                        {isActive && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                      </button>

                      {/* 드롭다운 메뉴 컨테이너 (gap 방지용 투명 영역 포함, CSS hover로 제어) */}
                      {group.submenu && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                          {/* 호버 유지용 투명 브릿지 */}
                          <div className="absolute -top-4 left-0 right-0 h-6 bg-transparent" />
                          <div className="w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden mt-1 relative">
                            <div className="py-2">
                              {group.submenu.map((sub, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleMenuClick(sub.path)}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${location.pathname === sub.path
                                    ? 'bg-blue-50 text-blue-600 font-bold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium'
                                    }`}
                                >
                                  {sub.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* 데스크톱 구분선 */}
              <div className="hidden lg:block w-px h-6 bg-gray-200" />

              {/* 우측 사용자 영역 (내 번호 + 로그인/사용자정보) */}
              <div className="flex items-center gap-2">
                {/* 내 번호 버튼 */}
                <button
                  onClick={() => handleMenuClick('/my-stats')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group ${location.pathname === '/my-stats'
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-600'
                    : 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600 text-gray-700'
                    }`}
                >
                  <User className={`w-5 h-5 transition-colors ${location.pathname === '/my-stats' ? 'text-orange-600' : 'text-gray-600 group-hover:text-orange-600'}`} />
                  <span className="font-bold">내 번호</span>
                </button>

                <div className="w-px h-6 bg-gray-200 mr-2" />

                {/* 로그인/사용자 영역 */}
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(o => !o)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.nickname[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{user.nickname}</span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-slide-up">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-xs font-bold text-gray-800">{user.nickname}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />로그아웃
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAuthModal('login')}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <LogIn className="w-4 h-4" />로그인
                    </button>
                    <button
                      onClick={() => setAuthModal('signup')}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 모바일: 로고 우측 로그인 버튼 */}
            <div className="md:hidden">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                >
                  {user.nickname[0].toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => setAuthModal('login')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl"
                >
                  <LogIn className="w-4 h-4" />로그인
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 모바일 유저 드롭다운 */}
        {userMenuOpen && user && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-3 px-4 py-2 mb-1">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.nickname[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{user.nickname}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" /><span className="font-medium">로그아웃</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 모바일 하단 네비게이션 */}
      <BottomNav onLoginClick={() => {
        if (user) {
          setUserMenuOpen(o => !o);
        } else {
          setAuthModal('login');
        }
      }} />

      {/* 인증 모달 */}
      {authModal && (
        <AuthModal initialMode={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
