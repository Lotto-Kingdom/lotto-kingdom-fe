import { useState } from 'react';
import { Menu, X, TrendingUp, MapPin, DollarSign, BarChart3 } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: TrendingUp, label: '역대 당첨', onClick: () => alert('준비중인 페이지입니다') },
    { icon: MapPin, label: '당첨 지역', onClick: () => alert('준비중인 페이지입니다') },
    { icon: DollarSign, label: '당첨 금액', onClick: () => alert('준비중인 페이지입니다') },
    { icon: BarChart3, label: '통계', onClick: () => alert('준비중인 페이지입니다') },
  ];

  const handleMenuClick = (onClick: () => void) => {
    onClick();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* 로고 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                {/* 로또 공 디자인 */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-black text-sm sm:text-lg">645</span>
                    </div>
                  </div>
                  {/* 광택 효과 */}
                  <div className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4 bg-white/40 rounded-full blur-sm"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent leading-none">
                  로또나라
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Lotto Kingdom</p>
              </div>
            </div>

            {/* 데스크톱 메뉴 */}
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
                >
                  <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="메뉴"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-up">
            <nav className="container mx-auto px-4 py-3 space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.onClick)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 active:scale-95"
                >
                  <item.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium text-left">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
