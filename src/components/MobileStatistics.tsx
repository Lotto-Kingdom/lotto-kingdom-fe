import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Flame, Snowflake, Trophy, Star } from 'lucide-react';
import { LottoNumber } from '../types';
import { getLottoNumberColor } from '../utils/lottoGenerator';
import { RECENT_DRAWS, ALL_TIME_HOT, LONG_TERM_COLD } from '../utils/lottoData';

interface MobileStatisticsProps {
  history?: LottoNumber[];
}

export function MobileStatistics({ }: MobileStatisticsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. 직전 회차 당첨 번호
  const latestDraw = RECENT_DRAWS[0];

  return (
    <div className="w-full lg:hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 요약 헤더 (항상 표시) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors touch-manipulation"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-gray-800">통계 인사이트</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
              <Trophy className="w-3 h-3" />
              <span>{latestDraw.drwNo}회 당첨번호</span>
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
          <div className="border-t border-gray-100 p-4 space-y-4 animate-slide-up bg-gray-50/50">

            {/* 1. 직전 당첨 번호 */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <h4 className="text-xs font-bold">직전 당첨 번호 ({latestDraw.drwNo}회)</h4>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 justify-center flex-wrap">
                  {latestDraw.numbers.map((num) => (
                    <div
                      key={`m-win-${num}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${getLottoNumberColor(num)} font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-inner border border-white/20`}
                    >
                      {num}
                    </div>
                  ))}
                  <div className="flex items-center justify-center text-white/50 text-xs mx-0.5">
                    +
                  </div>
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-inner ring-2 ring-white/50 relative"
                  >
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 text-yellow-300">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                    {latestDraw.bonusNo}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 역대 최다 출현 번호 TOP 5 */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h4 className="text-sm font-bold text-gray-800">역대 최다 출현 TOP 5</h4>
                </div>
                <span className="text-[9px] text-gray-400">1회~현재</span>
              </div>

              <div className="space-y-2.5">
                {ALL_TIME_HOT.map(({ num, count }, index) => (
                  <div key={`m-hot-${num}`} className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-orange-200 w-3">{index + 1}</span>
                    <div className={`
                      w-6 h-6 sm:w-7 sm:h-7 rounded-full
                      ${getLottoNumberColor(num)}
                      text-white font-bold text-[10px] sm:text-xs
                      flex items-center justify-center
                      shadow-sm flex-shrink-0
                    `}>
                      {num}
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-0.5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-gray-800">{num}번</span>
                        <span className="text-[10px] font-black text-orange-600">{count}회</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-full transition-all duration-500"
                          style={{ width: `${(count / ALL_TIME_HOT[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 장기 미출현 번호 */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-gray-800">장기 미출현</h4>
                </div>
                <span className="text-[9px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full font-medium">10주+</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {LONG_TERM_COLD.map(({ num, weeks }) => (
                  <div
                    key={`m-cold-${num}`}
                    className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-lg py-1.5"
                  >
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${getLottoNumberColor(num)} text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-sm mb-1 opacity-70`}>
                      {num}
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold tracking-tighter">
                      {weeks}주 째
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
