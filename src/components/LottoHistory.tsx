import { History, Trash2 } from 'lucide-react';
import { LottoNumber } from '../types';
import { HistoryItem } from './HistoryItem';

interface LottoHistoryProps {
  history: LottoNumber[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function LottoHistory({ history, onDelete, onClearAll }: LottoHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 text-center">
          <History className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-1 sm:mb-2">생성 기록이 없습니다</h3>
          <p className="text-gray-400 text-xs sm:text-sm">번호를 생성하면 여기에 저장됩니다</p>
        </div>
      </div>
    );
  }

  const handleClearAll = () => {
    if (window.confirm('모든 생성 기록을 삭제하시겠습니까?')) {
      onClearAll();
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-4 sm:p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            <h2 className="text-base sm:text-2xl font-bold text-gray-800">
              생성 기록
            </h2>
            <span className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
              {history.length}
            </span>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors touch-manipulation"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">전체 삭제</span>
              <span className="sm:hidden">삭제</span>
            </button>
          )}
        </div>

        {/* 히스토리 리스트 */}
        <div className="space-y-2.5 sm:space-y-4 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
          {history.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
