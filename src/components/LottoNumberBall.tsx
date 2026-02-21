import { Plus } from 'lucide-react';
import { getLottoNumberColor } from '../utils/lottoGenerator';

interface LottoNumberBallProps {
  number: number;
  index: number;
}

export function LottoNumberBall({ number, index }: LottoNumberBallProps) {
  const isBonus = index === 6;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {isBonus && (
        <div className="flex flex-col items-center justify-center animate-pop" style={{ animationDelay: '0.5s' }}>
          <Plus className="w-5 h-5 sm:w-8 sm:h-8 text-gray-400" />
          <span className="text-[10px] sm:text-xs text-gray-400 font-bold">보너스</span>
        </div>
      )}
      <div className="flex flex-col items-center gap-1">
        <div
          className={`
            w-12 h-12 sm:w-16 sm:h-16 rounded-full
            ${isBonus ? 'bg-gradient-to-br from-gray-500 to-gray-700 ring-4 ring-yellow-400' : getLottoNumberColor(number)}
            text-white font-bold text-lg sm:text-2xl
            flex items-center justify-center
            shadow-lg
            animate-pop
            transition-transform hover:scale-110
            select-none
            relative
          `}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {number}
        </div>
        {isBonus && <span className="text-[10px] sm:text-xs font-bold text-yellow-500 hidden opacity-0">.</span>}
      </div>
    </div>
  );
}
