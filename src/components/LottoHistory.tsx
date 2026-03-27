import { useState, useMemo } from 'react';
import { History, Trash2 } from 'lucide-react';
import { LottoNumber } from '../types';
import { HistoryItem } from './HistoryItem';

interface LottoHistoryProps {
  history: LottoNumber[];
  onDelete: (id: number | string) => void;
  onClearAll: () => void;
  onUpdate: (id: number | string, updates: Partial<LottoNumber>) => void;
}

export function LottoHistory({ history, onDelete, onClearAll, onUpdate: _onUpdate }: LottoHistoryProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'winning'>('history');

  // 당첨 내역 필터링
  const winningHistory = useMemo(() => {
    return history.filter(item => item.winningInfo);
  }, [history]);

  // 필터링된 히스토리
  const filteredHistory = activeTab === 'winning' ? winningHistory : history;

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
    if (window.confirm('해당 회차의 전체 내역을 삭제하시겠습니까?')) {
      onClearAll();
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-4 sm:p-6">
        {/* 탭 헤더 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {/* 탭 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'history'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>생성 기록</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${activeTab === 'history' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                  {history.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('winning')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'winning'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <span className="text-base sm:text-lg">🏆</span>
                <span>당첨 내역</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${activeTab === 'winning' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                  {winningHistory.length}
                </span>
              </button>
            </div>

            {/* 전체 삭제 버튼 (생성 기록 탭에서만) */}
            {activeTab === 'history' && history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors touch-manipulation"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">회차 삭제</span>
                <span className="sm:hidden">전체삭제</span>
              </button>
            )}
          </div>
        </div>



        {/* 히스토리 리스트 */}
        <div className="space-y-2.5 sm:space-y-4 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
          {activeTab === 'winning' && winningHistory.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl sm:text-8xl mb-4">🎰</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">당첨 내역이 없습니다</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                생성한 번호의 당첨 여부를 확인해보세요
              </p>
              <button
                onClick={() => setActiveTab('history')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                생성 기록으로 이동
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm sm:text-base">
                {activeTab === 'winning' ? '선택한 회차의 당첨 내역이 없습니다.' : '선택한 회차의 생성 기록이 없습니다.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((entry) => (
              <HistoryItem key={entry.id} entry={entry} onDelete={onDelete} onUpdate={_onUpdate} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
