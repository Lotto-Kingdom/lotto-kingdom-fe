import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Store } from 'lucide-react';
import { WinningHistory } from './WinningHistory';
import { WinningRegion } from './WinningRegion';

const TABS = [
  { label: '역대 당첨번호', path: '/winning', icon: Trophy },
  { label: '역대 당첨판매점', path: '/region', icon: Store },
];

export function WinningPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space-y-4">
      {/* 탭 바 - 모바일만 */}
      <div className="md:hidden flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1 gap-1">
        {TABS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      {location.pathname === '/winning' ? <WinningHistory /> : <WinningRegion />}
    </div>
  );
}
