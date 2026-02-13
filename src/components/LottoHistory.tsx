import { useState, useMemo } from 'react';
import { History, Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { LottoNumber } from '../types';
import { HistoryItem } from './HistoryItem';

interface LottoHistoryProps {
  history: LottoNumber[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onUpdate: (id: string, updates: Partial<LottoNumber>) => void;
}

export function LottoHistory({ history, onDelete, onClearAll, onUpdate: _onUpdate }: LottoHistoryProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'winning'>('history');
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  const [inputRound, setInputRound] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // 회차 범위 추출
  const roundRange = useMemo(() => {
    if (history.length === 0) return { min: 0, max: 0 };
    const rounds = history.map(item => item.round);
    return {
      min: Math.min(...rounds),
      max: Math.max(...rounds),
    };
  }, [history]);

  // 당첨 내역 필터링
  const winningHistory = useMemo(() => {
    return history.filter(item => item.winningInfo);
  }, [history]);

  // 필터링된 히스토리
  const filteredHistory = useMemo(() => {
    let items = activeTab === 'winning' ? winningHistory : history;

    if (selectedRound === 'all') {
      return items;
    }
    return items.filter(item => item.round === selectedRound);
  }, [history, winningHistory, selectedRound, activeTab]);

  // 회차 조회 핸들러
  const handleSearch = () => {
    const round = parseInt(inputRound);
    if (isNaN(round) || inputRound.trim() === '') {
      alert('회차를 입력해주세요.');
      return;
    }

    const hasRound = history.some(item => item.round === round);
    if (!hasRound) {
      alert(`${round}회차의 생성 기록이 없습니다.`);
      return;
    }

    setSelectedRound(round);
  };

  // 전체 보기 핸들러
  const handleShowAll = () => {
    setSelectedRound('all');
    setInputRound('');
  };

  // 엔터키로 조회
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
        {/* 탭 헤더 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {/* 탭 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>생성 기록</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'history' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {history.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('winning')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'winning'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base sm:text-lg">🏆</span>
                <span>당첨 내역</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === 'winning' ? 'bg-white/20' : 'bg-gray-100'
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
                <span className="hidden sm:inline">전체 삭제</span>
                <span className="sm:hidden">삭제</span>
              </button>
            )}
          </div>
        </div>

        {/* 회차 필터 */}
        {history.length > 0 && (
          <div className="mb-4 sm:mb-6">
            {/* 모바일: 토글 헤더 */}
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="lg:hidden w-full flex items-center justify-between p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors touch-manipulation mb-2"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  회차별 조회
                  {selectedRound !== 'all' && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {selectedRound}회
                    </span>
                  )}
                </span>
              </div>
              {isFilterExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* 데스크톱: 항상 표시 헤더 */}
            <div className="hidden lg:flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                회차별 조회
                {roundRange.min !== roundRange.max && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({roundRange.min}~{roundRange.max}회)
                  </span>
                )}
              </label>
            </div>

            {/* 필터 내용 - 모바일: 접을 수 있음, 데스크톱: 항상 표시 */}
            <div className={`space-y-2 ${isFilterExpanded ? 'block' : 'hidden'} lg:block`}>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputRound}
                  onChange={(e) => setInputRound(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`회차 입력 (예: ${roundRange.max})`}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm sm:text-base font-medium text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl text-sm sm:text-base font-semibold transition-colors touch-manipulation whitespace-nowrap"
                >
                  조회
                </button>
                {selectedRound !== 'all' && (
                  <button
                    onClick={handleShowAll}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white rounded-xl text-sm sm:text-base font-semibold transition-colors touch-manipulation whitespace-nowrap"
                  >
                    전체
                  </button>
                )}
              </div>

              {/* 현재 필터 상태 표시 - 데스크톱만 */}
              {selectedRound !== 'all' && (
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    현재 조회:
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                    제 {selectedRound}회 ({filteredHistory.length}개)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

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
              <HistoryItem key={entry.id} entry={entry} onDelete={onDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
