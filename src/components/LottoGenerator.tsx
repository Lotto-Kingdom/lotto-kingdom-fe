import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { generateLottoNumbers, getCurrentLottoRound, GenerationMode } from '../utils/lottoGenerator';
import { LottoNumberBall } from './LottoNumberBall';

interface LottoGeneratorProps {
  onGenerate: (numbers: number[]) => void;
}

const MODES: { id: GenerationMode; emoji: string; label: string; desc: string }[] = [
  { id: 'hot',      emoji: '🔥', label: '핫 번호',    desc: '최근 자주 등장한 번호 중심' },
  { id: 'cold',     emoji: '🧊', label: '냉동 번호',  desc: '오랫동안 안 나온 번호 중심' },
  { id: 'balanced', emoji: '⚖️', label: '홀짝 밸런스', desc: '홀수 3개 + 짝수 3개 균형' },
  { id: 'random',   emoji: '🎲', label: '완전 무작위', desc: '순수 랜덤 번호 생성' },
  { id: 'ai',       emoji: '🤖', label: 'AI 추천',    desc: '통계 + 구간 분산 + 핫넘버' },
];

const ALL_NUMBERS = Array.from({ length: 45 }, (_, i) => i + 1);

function getNumberColor(num: number) {
  if (num <= 10) return { bg: 'bg-yellow-400', text: 'text-white' };
  if (num <= 20) return { bg: 'bg-blue-500',   text: 'text-white' };
  if (num <= 30) return { bg: 'bg-red-500',    text: 'text-white' };
  if (num <= 40) return { bg: 'bg-gray-500',   text: 'text-white' };
  return                { bg: 'bg-green-500',  text: 'text-white' };
}

export function LottoGenerator({ onGenerate }: LottoGeneratorProps) {
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedMode, setSelectedMode] = useState<GenerationMode>('random');

  // 반자동 설정
  const [showSettings, setShowSettings] = useState(false);
  const [padMode, setPadMode] = useState<'fixed' | 'exclude'>('fixed');
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);

  useEffect(() => {
    setCurrentRound(getCurrentLottoRound());
  }, []);

  const toggleNumber = (num: number) => {
    if (padMode === 'fixed') {
      if (fixedNumbers.includes(num)) {
        setFixedNumbers((prev) => prev.filter((n) => n !== num));
      } else if (!excludedNumbers.includes(num) && fixedNumbers.length < 5) {
        setFixedNumbers((prev) => [...prev, num]);
      }
    } else {
      if (excludedNumbers.includes(num)) {
        setExcludedNumbers((prev) => prev.filter((n) => n !== num));
      } else if (!fixedNumbers.includes(num)) {
        setExcludedNumbers((prev) => [...prev, num]);
      }
    }
  };

  const clearAll = () => {
    setFixedNumbers([]);
    setExcludedNumbers([]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const numbers = await generateLottoNumbers(selectedMode, fixedNumbers, excludedNumbers);
      setCurrentNumbers(numbers);
      onGenerate(numbers);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '로또 번호 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentModeInfo = MODES.find((m) => m.id === selectedMode)!;
  const hasSettings = fixedNumbers.length > 0 || excludedNumbers.length > 0;

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
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base font-bold rounded-full shadow-md">
              제 {currentRound}회
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-base">행운의 번호를 만들어보세요</p>
        </div>

        {/* 모드 선택 */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`
                    flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border-2 transition-all duration-200 touch-manipulation
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl leading-none">{mode.emoji}</span>
                  <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                    {mode.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-center text-gray-400">{currentModeInfo.desc}</p>
        </div>

        {/* 반자동 설정 아코디언 */}
        <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors touch-manipulation"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">🎯 반자동 설정</span>
              {hasSettings && (
                <div className="flex gap-1">
                  {fixedNumbers.length > 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      고정 {fixedNumbers.length}
                    </span>
                  )}
                  {excludedNumbers.length > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                      제외 {excludedNumbers.length}
                    </span>
                  )}
                </div>
              )}
            </div>
            {showSettings
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>

          {showSettings && (
            <div className="p-4 space-y-4">
              {/* 안내 */}
              <p className="text-xs text-gray-500 text-center">
                번호를 터치해서 <span className="text-green-600 font-bold">고정</span> 또는 <span className="text-red-500 font-bold">제외</span>할 번호를 설정하세요
              </p>

              {/* 모드 탭 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPadMode('fixed')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors touch-manipulation ${
                    padMode === 'fixed'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  🔒 고정 번호 <span className="opacity-70">({fixedNumbers.length}/5)</span>
                </button>
                <button
                  onClick={() => setPadMode('exclude')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors touch-manipulation ${
                    padMode === 'exclude'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  🚫 제외 번호 <span className="opacity-70">({excludedNumbers.length}개)</span>
                </button>
              </div>

              {/* 번호판 1~45 */}
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                {ALL_NUMBERS.map((num) => {
                  const isFixed    = fixedNumbers.includes(num);
                  const isExcluded = excludedNumbers.includes(num);
                  const color      = getNumberColor(num);

                  // 상태별 스타일
                  let btnClass = '';
                  if (isFixed) {
                    btnClass = 'bg-green-500 text-white outline outline-2 outline-green-300';
                  } else if (isExcluded) {
                    btnClass = 'bg-red-500 text-white outline outline-2 outline-red-800';
                  } else if (padMode === 'fixed' && fixedNumbers.length >= 5) {
                    btnClass = `${color.bg} ${color.text} opacity-30 cursor-not-allowed`;
                  } else {
                    btnClass = `${color.bg} ${color.text} opacity-60 hover:opacity-100 active:scale-95`;
                  }

                  const isDisabled =
                    (padMode === 'fixed'   && !isFixed    && (fixedNumbers.length >= 5 || isExcluded)) ||
                    (padMode === 'exclude' && !isExcluded && isFixed);

                  return (
                    <button
                      key={num}
                      onClick={() => !isDisabled && toggleNumber(num)}
                      disabled={isDisabled}
                      className={`
                        aspect-square rounded-full text-[10px] font-bold flex items-center justify-center
                        transition-all duration-150 touch-manipulation select-none
                        ${btnClass}
                      `}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* 선택된 번호 요약 + 초기화 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {fixedNumbers.sort((a, b) => a - b).map((n) => (
                    <button
                      key={`f${n}`}
                      onClick={() => setFixedNumbers((prev) => prev.filter((x) => x !== n))}
                      className="flex items-center gap-0.5 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full hover:bg-green-200"
                    >
                      {n} <X className="w-2.5 h-2.5" />
                    </button>
                  ))}
                  {excludedNumbers.sort((a, b) => a - b).map((n) => (
                    <button
                      key={`e${n}`}
                      onClick={() => setExcludedNumbers((prev) => prev.filter((x) => x !== n))}
                      className="flex items-center gap-0.5 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full hover:bg-red-200 line-through"
                    >
                      {n} <X className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
                {hasSettings && (
                  <button
                    onClick={clearAll}
                    className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-600 underline ml-2"
                  >
                    전체 초기화
                  </button>
                )}
              </div>
            </div>
          )}
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
            text-white shadow-lg transition-all duration-300 touch-manipulation
            ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] active:scale-95'}
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className={`w-5 h-5 sm:w-6 sm:h-6 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? '생성 중...' : '번호 생성하기'}</span>
          </div>
        </button>

        {/* 안내 문구 */}
        <div className="text-center text-xs sm:text-sm text-gray-400 space-y-1">
          <p>1부터 45까지의 숫자 중 6개가 선택됩니다</p>
          <p>생성된 번호는 자동으로 저장됩니다</p>
        </div>
      </div>
    </div>
  );
}
