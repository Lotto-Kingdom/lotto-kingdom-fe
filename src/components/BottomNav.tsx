import { useNavigate, useLocation } from 'react-router-dom';
import { Dices, Trophy, TrendingUp, MapPin, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  onLoginClick: () => void;
}

const NAV_ITEMS = [
  {
    label: '번호생성',
    icon: Dices,
    path: '/',
    match: (p: string) => p === '/',
  },
  {
    label: '당첨',
    icon: Trophy,
    path: '/winning',
    match: (p: string) => ['/winning', '/region'].includes(p),
  },
  {
    label: '통계',
    icon: TrendingUp,
    path: '/stats',
    match: (p: string) => p === '/stats',
  },
  {
    label: '당첨 판매점',
    icon: MapPin,
    path: '/store/nearby',
    match: (p: string) => p === '/store/nearby',
  },
];

export function BottomNav({ onLoginClick }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {NAV_ITEMS.map(({ label, icon: Icon, path, match }) => {
          const isActive = match(location.pathname);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full touch-manipulation"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}

        {/* 로그인 / 유저 */}
        <button
          onClick={onLoginClick}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full touch-manipulation"
        >
          {user ? (
            <>
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                {user.nickname[0].toUpperCase()}
              </div>
              <span className="text-[10px] font-semibold text-gray-400">{user.nickname.slice(0, 4)}</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 text-gray-400" strokeWidth={1.8} />
              <span className="text-[10px] font-semibold text-gray-400">로그인</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
