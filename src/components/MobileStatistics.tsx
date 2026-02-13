import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Hash, Clock, Award } from 'lucide-react';
import { LottoNumber } from '../types';
import { getLottoNumberColor } from '../utils/lottoGenerator';
import { LottoProbability } from './LottoProbability';

interface MobileStatisticsProps {
  history: LottoNumber[];
}

export function MobileStatistics({ history }: MobileStatisticsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 가장 많이 나온 번호 계산
  const getMostFrequentNumbers = () => {
    const frequency: { [key: number]: number } = {};

    history.forEach((entry) => {
      entry.numbers.forEach((num) => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([num, count]) => ({ num: parseInt(num), count }));
  };

  // 최근 생성 시간
  const getLastGeneratedTime = () => {
    if (history.length === 0) return '-';
    const lastEntry = history[0];
    const now = Date.now();
    const diff = now - lastEntry.timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  const frequentNumbers = getMostFrequentNumbers();
  const totalNumbers = history.length * 6;

  if (history.length === 0) return null;

  return (
    <div className="w-full lg:hidden">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 요약 헤더 (항상 표시) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors touch-manipulation"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-gray-800">통계</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* 간단한 요약 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">총</span>
              <span className="font-bold text-blue-600">{history.length}회</span>
            </div>

            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* 상세 통계 (펼쳤을 때만 표시) */}
        {isExpanded && (
          <div className="border-t border-gray-100 p-4 space-y-3 animate-slide-up">
            {/* 통계 카드들 */}
            <div className="grid grid-cols-2 gap-2">
              {/* 총 생성 횟수 */}
              <div className="flex flex-col gap-1 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-medium text-gray-700">생성 횟수</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{history.length}회</span>
              </div>

              {/* 생성된 번호 수 */}
              <div className="flex flex-col gap-1 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-700">생성 번호</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{totalNumbers}개</span>
              </div>
            </div>

            {/* 마지막 생성 */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-medium text-gray-700">마지막 생성</span>
              </div>
              <span className="text-sm font-bold text-orange-600">{getLastGeneratedTime()}</span>
            </div>

            {/* 당첨 확률 */}
            <LottoProbability history={history} />

            {/* 자주 나온 번호 TOP 3 */}
            {frequentNumbers.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-bold text-gray-800">자주 나온 번호</h4>
                </div>

                <div className="space-y-2">
                  {frequentNumbers.map(({ num, count }, index) => (
                    <div key={num} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className={`
                        w-8 h-8 rounded-full
                        ${getLottoNumberColor(num)}
                        text-white font-bold text-xs
                        flex items-center justify-center
                        shadow-md
                      `}>
                        {num}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
                          style={{ width: `${(count / history.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{count}회</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
