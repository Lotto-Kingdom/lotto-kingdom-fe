import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, MapPin, DollarSign, BarChart3 } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: TrendingUp, label: '역대 당첨', path: '/winning' },
    { icon: MapPin,     label: '당첨 지역', path: '/region' },
    { icon: DollarSign, label: '당첨 금액', path: '/amount' },
    { icon: BarChart3,  label: '통계',      path: null },
  ];

  const handleMenuClick = (path: string | null) => {
    if (path) {
      navigate(path);
    } else {
      alert('준비중인 페이지입니다');
    }
    setIsMenuOpen(false);
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

            {/* 데스크톱 메뉴 */}
            <nav className="hidden md:flex items-center gap-2">
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

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="메뉴"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
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
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
