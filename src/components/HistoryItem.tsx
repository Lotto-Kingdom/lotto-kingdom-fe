import { Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { LottoNumber } from '../types';
import { formatDate, getLottoNumberColor } from '../utils/lottoGenerator';

interface HistoryItemProps {
  entry: LottoNumber;
  onDelete: (id: string) => void;
}

export function HistoryItem({ entry, onDelete }: HistoryItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const numbersText = entry.numbers.join(', ');
    navigator.clipboard.writeText(numbersText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('이 번호를 삭제하시겠습니까?')) {
      onDelete(entry.id);
    }
  };

  const getRankEmoji = (rank: number) => {
    const emojis = ['🥇', '🥈', '🥉', '🎊', '🎉'];
    return emojis[rank - 1] || '🎰';
  };

  const getRankText = (rank: number) => {
    return `${rank}등`;
  };

  return (
    <div className={`bg-white rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-lg transition-shadow animate-slide-up ${entry.winningInfo ? 'border-4 border-yellow-400' : ''
      }`}>
      {/* 타임스탬프 및 회차 */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
            {entry.round}회
          </span>
          {entry.winningInfo && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1">
              <span>{getRankEmoji(entry.winningInfo.rank)}</span>
              <span>{getRankText(entry.winningInfo.rank)} 당첨</span>
            </span>
          )}
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {formatDate(entry.timestamp)}
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          {/* 복사 버튼 */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            title="번호 복사"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {/* 삭제 버튼 */}
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
            title="삭제"
          >
            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
          </button>
        </div>
      </div>

      {/* 번호 표시 */}
      <div className="flex flex-wrap gap-1.5 sm:gap-3 items-center">
        {entry.numbers.map((num, i) => {
          const isMatched = entry.winningInfo?.matchedNumbers.includes(num);
          const isBonus = i === 6;
          return (
            <div key={`${num}-${i}`} className="flex items-center gap-1.5 sm:gap-3">
              {isBonus && (
                <div className="flex items-center justify-center text-gray-300 text-lg sm:text-xl font-black">
                  +
                </div>
              )}
              <div
                className={`
                  w-9 h-9 sm:w-12 sm:h-12 rounded-full
                  ${isBonus ? 'bg-gradient-to-br from-gray-500 to-gray-700 ring-2 ring-gray-400' : getLottoNumberColor(num)}
                  text-white font-bold text-sm sm:text-base
                  flex items-center justify-center
                  shadow-md
                  select-none
                  relative
                  ${isMatched ? 'ring-4 ring-yellow-400 scale-110' : ''}
                `}
                title={isBonus ? '보너스 번호' : undefined}
              >
                {num}
                {isMatched && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 당첨 정보 추가 표시 */}
      {entry.winningInfo && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600">
              <span className="font-semibold text-orange-600">{entry.winningInfo.matchCount}개</span> 일치
            </span>
            {entry.winningInfo.prize && (
              <span className="font-bold text-orange-600">
                {entry.winningInfo.prize.toLocaleString()}원
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
