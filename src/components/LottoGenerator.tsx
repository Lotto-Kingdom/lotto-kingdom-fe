import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateLottoNumbers } from '../utils/lottoGenerator';
import { LottoNumberBall } from './LottoNumberBall';

interface LottoGeneratorProps {
  onGenerate: (numbers: number[]) => void;
}

export function LottoGenerator({ onGenerate }: LottoGeneratorProps) {
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    // 애니메이션 효과를 위한 딜레이
    setTimeout(() => {
      const numbers = generateLottoNumbers();
      setCurrentNumbers(numbers);
      onGenerate(numbers);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 space-y-5 sm:space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500" />
            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              번호 생성기
            </h2>
            <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-purple-500" />
          </div>
          <p className="text-gray-500 text-xs sm:text-base">행운의 번호를 만들어보세요</p>
        </div>

        {/* 번호 디스플레이 */}
        <div className="min-h-[90px] sm:min-h-[100px] flex items-center justify-center py-2">
          {currentNumbers.length === 0 ? (
            <div className="text-gray-400 text-center px-4">
              <p className="text-base sm:text-xl font-medium">번호를 생성해주세요</p>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">아래 버튼을 눌러 행운의 번호를 받아보세요</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {currentNumbers.map((num, index) => (
                <LottoNumberBall key={num} number={num} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`
            w-full py-3.5 sm:py-5 rounded-2xl font-bold text-base sm:text-xl
            bg-gradient-to-r from-blue-500 to-purple-600
            text-white shadow-lg
            transition-all duration-300
            touch-manipulation
            ${isGenerating
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-xl hover:scale-[1.02] active:scale-95'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className={`w-5 h-5 sm:w-6 sm:h-6 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? '생성 중...' : '번호 생성하기'}</span>
          </div>
        </button>

        {/* 안내 문구 */}
        <div className="text-center text-xs sm:text-sm text-gray-400 space-y-1">
          <p>1부터 45까지의 숫자 중 6개가 무작위로 선택됩니다</p>
          <p>생성된 번호는 자동으로 저장됩니다</p>
        </div>
      </div>
    </div>
  );
}
