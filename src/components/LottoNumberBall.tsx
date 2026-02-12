import { getLottoNumberColor } from '../utils/lottoGenerator';

interface LottoNumberBallProps {
  number: number;
  index: number;
}

export function LottoNumberBall({ number, index }: LottoNumberBallProps) {
  return (
    <div
      className={`
        w-12 h-12 sm:w-16 sm:h-16 rounded-full
        ${getLottoNumberColor(number)}
        text-white font-bold text-lg sm:text-2xl
        flex items-center justify-center
        shadow-lg
        animate-pop
        transition-transform hover:scale-110
        select-none
      `}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {number}
    </div>
  );
}
