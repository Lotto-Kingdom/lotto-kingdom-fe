import { TrendingUp, Hash, Clock, Award } from 'lucide-react';
import { LottoNumber } from '../types';

interface StatisticsPanelProps {
  history: LottoNumber[];
}

export function StatisticsPanel({ history }: StatisticsPanelProps) {
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
      .slice(0, 5)
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

  return (
    <div className="space-y-4">
      {/* 통계 카드 */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">실시간 통계</h3>
        </div>

        <div className="space-y-4">
          {/* 총 생성 횟수 */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">총 생성 횟수</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{history.length}회</span>
          </div>

          {/* 생성된 번호 수 */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">생성된 번호</span>
            </div>
            <span className="text-lg font-bold text-purple-600">{totalNumbers}개</span>
          </div>

          {/* 마지막 생성 */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">마지막 생성</span>
            </div>
            <span className="text-lg font-bold text-orange-600">{getLastGeneratedTime()}</span>
          </div>
        </div>
      </div>

      {/* 자주 나온 번호 */}
      {frequentNumbers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">자주 나온 번호</h3>
          </div>

          <div className="space-y-2">
            {frequentNumbers.map(({ num, count }, index) => (
              <div key={num} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                      {num}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
                        style={{ width: `${(count / history.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 ml-2">{count}회</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 행운의 메시지 */}
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl shadow-lg p-5">
        <div className="text-center space-y-2">
          <div className="text-3xl">🍀</div>
          <p className="text-sm font-semibold text-gray-700">행운을 빕니다!</p>
          <p className="text-xs text-gray-500">꾸준한 도전이<br />행운을 만듭니다</p>
        </div>
      </div>
    </div>
  );
}
