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

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-lg transition-shadow animate-slide-up">
      {/* 타임스탬프 및 회차 */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full">
            {entry.round}회
          </span>
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
      <div className="flex flex-wrap gap-1.5 sm:gap-3">
        {entry.numbers.map((num) => (
          <div
            key={num}
            className={`
              w-9 h-9 sm:w-12 sm:h-12 rounded-full
              ${getLottoNumberColor(num)}
              text-white font-bold text-sm sm:text-base
              flex items-center justify-center
              shadow-md
              select-none
            `}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}
