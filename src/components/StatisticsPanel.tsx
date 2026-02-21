import { Trophy, Flame, Snowflake, Star } from 'lucide-react';
import { LottoNumber } from '../types';
import { RECENT_DRAWS, ALL_TIME_HOT, LONG_TERM_COLD } from '../utils/lottoData';
import { getLottoNumberColor } from '../utils/lottoGenerator';

interface StatisticsPanelProps {
  history?: LottoNumber[];
}

export function StatisticsPanel({ }: StatisticsPanelProps) {
  // 1. 직전 회차 당첨 번호
  const latestDraw = RECENT_DRAWS[0];

  return (
    <div className="space-y-4">

      {/* 1. 직전 회차 당첨 번호 */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <h3 className="font-bold text-sm">직전 당첨 번호</h3>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-bold">
              제 {latestDraw.drwNo}회
            </span>
          </div>

          <div className="flex items-center gap-1.5 justify-center mt-2 flex-wrap">
            {latestDraw.numbers.map((num) => (
              <div
                key={`win-${num}`}
                className={`w-8 h-8 rounded-full ${getLottoNumberColor(num)} font-bold text-xs flex items-center justify-center shadow-inner border border-white/20`}
              >
                {num}
              </div>
            ))}
            <div className="flex items-center justify-center text-white/50 text-xs mx-0.5">
              +
            </div>
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 font-bold text-xs flex items-center justify-center shadow-inner ring-2 ring-white/50 relative"
              title="보너스 번호"
            >
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 text-yellow-300">
                <Star className="w-3 h-3 fill-current" />
              </div>
              {latestDraw.bonusNo}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 역대 최다 출현 번호 HOT 5 */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-800">역대 가장 많이 나온 번호</h3>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">1회~현재 누적</span>
        </div>

        <div className="space-y-3">
          {ALL_TIME_HOT.map(({ num, count }, index) => (
            <div key={`hot-${num}`} className="flex items-center gap-3 group">
              <span className="text-sm font-black text-orange-200 w-4 group-hover:text-orange-400 transition-colors">{index + 1}</span>
              <div className={`w-7 h-7 rounded-full ${getLottoNumberColor(num)} text-white font-bold text-xs flex items-center justify-center shadow-sm flex-shrink-0`}>
                {num}
              </div>
              <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-gray-800">{num}번</span>
                  <span className="text-xs font-black text-orange-600">{count}회 출현</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-full transition-all duration-700 ease-out"
                    style={{ width: `${(count / ALL_TIME_HOT[0].count) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 장기 미출현 번호 */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-800">장기 미출현 번호</h3>
          </div>
          <span className="text-[10px] text-blue-400 font-medium bg-blue-50 px-2 py-0.5 rounded-full">최근 10주 이상</span>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {LONG_TERM_COLD.map(({ num, weeks }) => (
            <div
              key={`cold-${num}`}
              className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 flex-1 min-w-[50px] transition-transform hover:-translate-y-1"
            >
              <div className={`w-8 h-8 rounded-full ${getLottoNumberColor(num)} text-white font-bold text-xs flex items-center justify-center shadow-sm mb-1 opacity-70`}>
                {num}
              </div>
              <span className="text-[10px] text-gray-500 font-bold tracking-tighter">
                {weeks}주째 잠수
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-3 text-center">
          "언젠가는 나오겠지?" 수동 조합 추천 번호
        </p>
      </div>

    </div>
  );
}
