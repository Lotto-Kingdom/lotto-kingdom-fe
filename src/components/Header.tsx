import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, MapPin, DollarSign, BarChart3, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: TrendingUp, label: '역대 당첨', path: '/winning' },
    { icon: MapPin,     label: '당첨 지역', path: '/region' },
    { icon: DollarSign, label: '당첨 금액', path: '/amount' },
    { icon: BarChart3,  label: '통계',      path: '/stats' },
    { icon: User,       label: '내 번호',   path: '/my-stats' },
  ];

  const handleMenuClick = (path: string | null) => {
    if (path) {
      navigate(path);
    } else {
      alert('준비중인 페이지입니다');
    }
    setIsMenuOpen(false);
  };

  // 바깥 클릭 시 유저 메뉴 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
              onClick={() => { navigate('/'); setIsMenuOpen(false); }}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-black text-sm sm:text-lg">645</span>
                    </div>
                  </div>
                  <div className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4 bg-white/40 rounded-full blur-sm"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent leading-none">
                  로또나라
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Lotto Kingdom</p>
              </div>
            </button>

            {/* 데스크톱: 메뉴 + 로그인 */}
            <div className="hidden md:flex items-center gap-2">
              <nav className="flex items-center gap-1">
                {menuItems.map((item, index) => {
                  const isActive = item.path && location.pathname === item.path;
                  return (
                    <button
                      key={index}
                      onClick={() => handleMenuClick(item.path)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`} />
                      <span className={`font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
                        {item.label}
                      </span>
                      {isActive && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                    </button>
                  );
                })}
              </nav>

              {/* 구분선 */}
              <div className="w-px h-6 bg-gray-200 mx-1" />

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
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-800">{user.nickname}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
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
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>

            {/* 모바일: 로그인 아이콘 + 햄버거 */}
            <div className="md:hidden flex items-center gap-2">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                >
                  {user.nickname[0].toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => setAuthModal('login')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="로그인"
                >
                  <LogIn className="w-5 h-5 text-gray-700" />
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="메뉴"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 드롭다운 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-up">
            <nav className="container mx-auto px-4 py-3 space-y-1">
              {menuItems.map((item, index) => {
                const isActive = item.path && location.pathname === item.path;
                return (
                  <button
                    key={index}
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50'
                        : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`font-medium text-left ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    {isActive && <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                  </button>
                );
              })}

              {/* 모바일 로그인/로그아웃 */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{user.nickname}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">로그아웃</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-4 pb-1">
                    <button
                      onClick={() => { setAuthModal('login'); setIsMenuOpen(false); }}
                      className="flex-1 py-2.5 text-sm font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => { setAuthModal('signup'); setIsMenuOpen(false); }}
                      className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}

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

      {/* 인증 모달 */}
      {authModal && (
        <AuthModal initialMode={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
