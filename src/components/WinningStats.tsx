import { useEffect, useState } from 'react';
import { BarChart3, Flame, Snowflake, TrendingUp, Hash, Shuffle, Star, Loader2 } from 'lucide-react';
import { getLottoNumberColor } from '../utils/lottoGenerator';
import { useLottoFullStatistics, NumberFrequency, RangeDist, LottoStatisticsData } from '../hooks/useLottoFullStatistics';
import { SEO } from './SEO';

// ─────────────────────────────────────────────
// 번호 공 컴포넌트
// ─────────────────────────────────────────────
function Ball({ num, size = 'md', bonus = false, dim = false }: {
  num: number; size?: 'sm' | 'md' | 'lg'; bonus?: boolean; dim?: boolean;
}) {
  const sizeClass = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }[size];
  const bg = bonus
    ? 'bg-gradient-to-br from-gray-500 to-gray-700 ring-2 ring-gray-400'
    : getLottoNumberColor(num);
  return (
    <div className={`${sizeClass} ${bg} rounded-full text-white font-black flex items-center justify-center shadow-md select-none flex-shrink-0 transition-opacity ${dim ? 'opacity-25' : ''}`}>
      {num}
    </div>
  );
}

// ─────────────────────────────────────────────
// ① HOT / COLD 번호
// ─────────────────────────────────────────────
function HotCold({ hot, cold }: { hot: NumberFrequency[], cold: NumberFrequency[] }) {
  const maxHot = hot.length > 0 ? hot[0].count : 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {/* HOT */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border border-orange-100 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-black text-gray-800 text-base">HOT 번호 TOP 5</h3>
          <span className="text-xs text-orange-500 font-bold">자주 나온</span>
        </div>
        <div className="space-y-2.5">
          {hot.map(({ number: n, count: c }, idx) => (
            <div key={n} className="flex items-center gap-3">
              <span className="text-sm font-black text-orange-300 w-4">{idx + 1}</span>
              <Ball num={n} size="sm" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-600">{n}번</span>
                  <span className="text-xs font-black text-orange-600">{c}회</span>
                </div>
                <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                    style={{ width: `${(c / maxHot) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLD */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Snowflake className="w-5 h-5 text-blue-500" />
          <h3 className="font-black text-gray-800 text-base">COLD 번호 TOP 5</h3>
          <span className="text-xs text-blue-500 font-bold">적게 나온</span>
        </div>
        <div className="space-y-2.5">
          {cold.map(({ number: n, count: c }, idx) => (
            <div key={n} className="flex items-center gap-3">
              <span className="text-sm font-black text-blue-300 w-4">{idx + 1}</span>
              <Ball num={n} size="sm" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-600">{n}번</span>
                  <span className="text-xs font-black text-blue-600">{c}회</span>
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                    // COLD 바 차트는 적을수록 비중을 작게 그리는 방식이거나 상대적인 값 사용
                    style={{ width: `${((c + 1) / (maxHot || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ③ 구간별(색상대별) 분포
// ─────────────────────────────────────────────
const ZONES_DEF = [
  { label: '1~10', color: 'bg-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { label: '11~20', color: 'bg-blue-400', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  { label: '21~30', color: 'bg-red-400', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  { label: '31~40', color: 'bg-gray-400', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
  { label: '41~45', color: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
];

function ZoneDistribution({ rangeDist }: { rangeDist: RangeDist[] }) {
  const total = rangeDist.reduce((s, z) => s + z.count, 0);
  const maxCount = Math.max(...rangeDist.map((z) => z.count), 1);

  // API의 rangeDistribution 범위(range) 값을 기반으로 ZONES_DEF와 매칭
  const zoneCounts = rangeDist.map(z => {
    const def = ZONES_DEF.find(d => d.label === z.range) || ZONES_DEF[0];
    return { ...def, count: z.count, label: z.range };
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">구간별 번호 분포</h3>
        <span className="text-xs text-gray-400 font-medium">색상대 기준</span>
      </div>

      {/* 스택 바 */}
      <div className="flex h-6 rounded-full overflow-hidden gap-0.5 mb-5">
        {zoneCounts.map((z) => (
          <div
            key={z.label}
            className={`${z.color} transition-all`}
            style={{ width: `${(z.count / total) * 100}%` }}
            title={`${z.label}: ${z.count}회 (${Math.round((z.count / total) * 100)}%)`}
          />
        ))}
      </div>

      <div className="space-y-2.5">
        {zoneCounts.map((z) => (
          <div key={z.label} className={`rounded-2xl border p-3 ${z.bg} ${z.border}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${z.color}`} />
                <span className={`text-sm font-black ${z.text}`}>{z.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${z.text}`}>{z.count}회</span>
                <span className="text-xs text-gray-400">({Math.round((z.count / total) * 100)}%)</span>
              </div>
            </div>
            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${z.color}`}
                style={{ width: `${(z.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ④ 홀수/짝수 분석
// ─────────────────────────────────────────────
function OddEvenAnalysis({ data }: { data: LottoStatisticsData }) {
  const oddPct = Math.round(data.oddPercentage);
  const evenPct = Math.round(data.evenPercentage);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shuffle className="w-5 h-5 text-indigo-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">홀수 / 짝수 분석</h3>
      </div>

      {/* 메인 비율 바 */}
      <div className="flex h-8 rounded-2xl overflow-hidden shadow-sm mb-3">
        <div
          className="bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-black transition-all"
          style={{ width: `${oddPct}%` }}
        >
          홀 {oddPct}%
        </div>
        <div
          className="bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-black transition-all"
          style={{ width: `${evenPct}%` }}
        >
          짝 {evenPct}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-violet-50 rounded-2xl p-3.5 text-center border border-violet-100">
          <p className="text-2xl font-black text-violet-700">{data.oddCount}</p>
          <p className="text-xs text-violet-500 font-semibold mt-0.5">홀수 출현</p>
          <p className="text-[10px] text-gray-400">평균 {data.avgOddPerRound.toFixed(1)}개/회</p>
        </div>
        <div className="bg-pink-50 rounded-2xl p-3.5 text-center border border-pink-100">
          <p className="text-2xl font-black text-pink-700">{data.evenCount}</p>
          <p className="text-xs text-pink-500 font-semibold mt-0.5">짝수 출현</p>
          <p className="text-[10px] text-gray-400">평균 {data.avgEvenPerRound.toFixed(1)}개/회</p>
        </div>
      </div>

      {/* 자주 나온 조합 패턴 */}
      <div>
        <p className="text-xs font-bold text-gray-500 mb-2">자주 나온 홀짝 조합</p>
        <div className="flex gap-2 flex-wrap">
          {data.oddEvenCombinations.map(({ pattern, count }) => (
            <div key={pattern} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
              <span className="text-sm font-black text-indigo-700">{pattern}</span>
              <span className="text-xs text-indigo-400 font-bold">{count}회</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ⑤ 번호 합계 분포
// ─────────────────────────────────────────────
function SumDistribution({ data }: { data: LottoStatisticsData }) {
  const maxCount = Math.max(...data.sumDistribution.map((b) => b.count), 1);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-teal-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">번호 합계 분포</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-teal-50 rounded-2xl p-3 text-center border border-teal-100">
          <p className="text-xl font-black text-teal-700">{data.avgSum}</p>
          <p className="text-[10px] text-teal-500 font-semibold">평균 합계</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
          <p className="text-xl font-black text-blue-700">{data.minSum}</p>
          <p className="text-[10px] text-blue-500 font-semibold">최소 합계</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-3 text-center border border-orange-100">
          <p className="text-xl font-black text-orange-700">{data.maxSum}</p>
          <p className="text-[10px] text-orange-500 font-semibold">최대 합계</p>
        </div>
      </div>

      {/* 막대 차트 */}
      <div className="flex items-end gap-2 h-28">
        {data.sumDistribution.map((b) => {
          const pct = maxCount > 0 ? (b.count / maxCount) * 100 : 0;
          return (
            <div key={b.range} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-xs font-black text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {b.count}회
              </span>
              <div className="w-full flex items-end" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-teal-500 to-cyan-400 group-hover:from-teal-400 group-hover:to-cyan-300 transition-all"
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-400 font-medium text-center leading-tight">{b.range.replace('~', '~\n')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ⑥ 보너스 번호 분석
// ─────────────────────────────────────────────
function BonusAnalysis({ bonuses }: { bonuses: NumberFrequency[] }) {
  const top5 = bonuses.slice(0, 5);
  const maxCount = top5.length > 0 ? top5[0].count : 1;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-gray-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">보너스 번호 분석</h3>
        <span className="text-xs text-gray-400 font-medium">TOP 5</span>
      </div>
      <div className="space-y-3">
        {top5.map(({ number: n, count: c }, idx) => (
          <div key={n} className="flex items-center gap-3">
            <span className="text-sm font-black text-gray-300 w-4">{idx + 1}</span>
            <Ball num={n} size="sm" bonus />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-600">{n}번</span>
                <span className="text-xs font-black text-gray-600">{c}회</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gray-400 to-slate-500 rounded-full"
                  style={{ width: `${(c / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ⑦ 연속 번호 패턴
// ─────────────────────────────────────────────
function ConsecutivePattern({ data }: { data: LottoStatisticsData }) {
  
  const patternStats = data.consecutivePatterns;
  const items = [
    { label: '연속 없음', count: patternStats.noneCount, color: 'bg-gray-200', text: 'text-gray-600' },
    { label: '1쌍 연속', count: patternStats.oneCount, color: 'bg-blue-400', text: 'text-blue-700' },
    { label: '2쌍 연속', count: patternStats.twoCount, color: 'bg-purple-400', text: 'text-purple-700' },
    { label: '3쌍 이상', count: patternStats.threeOrMoreCount, color: 'bg-pink-400', text: 'text-pink-700' },
  ];
  
  const total = items.reduce((a, b) => a + b.count, 0) || 1;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-pink-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">연속 번호 패턴</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-purple-50 rounded-2xl p-3.5 text-center border border-purple-100">
          <p className="text-2xl font-black text-purple-700">{data.consecutiveRate.toFixed(1)}%</p>
          <p className="text-[10px] text-purple-500 font-semibold">연속 번호 포함률</p>
        </div>
        <div className="bg-pink-50 rounded-2xl p-3.5 text-center border border-pink-100">
          <p className="text-2xl font-black text-pink-700">{data.avgConsecutiveCount.toFixed(2)}</p>
          <p className="text-[10px] text-pink-500 font-semibold">평균 연속 쌍 수</p>
        </div>
      </div>

      {/* 스택 바 */}
      <div className="flex h-5 rounded-full overflow-hidden gap-0.5 mb-3">
        {items.map((item) =>
          item.count > 0 ? (
            <div
              key={item.label}
              className={`${item.color}`}
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          ) : null
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${item.color}`} />
            <span className="text-sm text-gray-600 flex-1">{item.label}</span>
            <span className={`text-sm font-black ${item.text}`}>{item.count}회</span>
            <span className="text-xs text-gray-400 w-10 text-right">
              {Math.round((item.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export function WinningStats() {
  const { data, loading, error, loadStatistics } = useLottoFullStatistics();
  const [selectedCount, setSelectedCount] = useState<number>(20);

  useEffect(() => {
    loadStatistics(selectedCount);
  }, [loadStatistics, selectedCount]);

  if (loading || !data) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[500px] text-indigo-500 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-sm font-bold animate-pulse">통계 데이터를 분석하고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-1 flex items-center justify-center min-h-[500px] text-red-500 text-sm font-bold">
        {error}
      </div>
    );
  }

  return (
    <>
      <SEO title="로또 통계 및 분석 - 로또나라" description="로또 번호별 출현 빈도, 홀짝 통계, 합계 분포 등 전문적인 통계 데이터를 확인하세요." />
      <div className="w-full space-y-4 sm:space-y-6">

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-800">통계</h2>
        </div>
        <select
          value={selectedCount}
          onChange={(e) => setSelectedCount(Number(e.target.value))}
          className="text-xs sm:text-sm font-bold border-gray-200 text-indigo-700 bg-indigo-50/50 rounded-xl px-3 py-1.5 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value={20}>최근 20회차</option>
          <option value={50}>최근 50회차</option>
          <option value={100}>최근 100회차</option>
          <option value={0}>역대 전체 (누적)</option>
        </select>
      </div>

      {/* 히어로 배너 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-3xl shadow-xl p-5 sm:p-7">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3">
            당첨 번호 분석 · {data.analysisCount === 0 ? '전체 (누적)' : `최근 ${data.analysisCount}회차`}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            <div>
              <p className="text-white/70 text-xs mb-1">분석 회차 수</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{data.analysisCount === 0 ? '전체' : `${data.analysisCount}회`}</p>
              <p className="text-white/60 text-[10px] mt-0.5">
                {data.startRound}~{data.baseRound}회 기준
              </p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">총 추출 번호</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{data.totalNumbers}</p>
              <p className="text-white/60 text-[10px] mt-0.5">분석 대상 총 번호 수</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">🔥 최다 출현</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{data.maxFrequencyNumber}번</p>
              <p className="text-white/60 text-[10px] mt-0.5">{data.maxFrequency}회 출현</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">❄️ 최소 출현</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{data.minFrequencyNumber}번</p>
              <p className="text-white/60 text-[10px] mt-0.5">{data.minFrequency}회 출현</p>
            </div>
          </div>
        </div>
      </div>

      {/* HOT / COLD */}
      <HotCold hot={data.hotNumbers} cold={data.coldNumbers} />

      {/* 구간별 분포 + 홀짝 분석 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ZoneDistribution rangeDist={data.rangeDistribution} />
        <OddEvenAnalysis data={data} />
      </div>

      {/* 번호 합계 + 연속 번호 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SumDistribution data={data} />
        <ConsecutivePattern data={data} />
      </div>

      {/* 보너스 번호 */}
      <BonusAnalysis bonuses={data.bonusNumberFrequencies} />

      {/* 안내 */}
      <div className="bg-indigo-50 rounded-2xl p-4 text-center">
        <p className="text-xs text-indigo-600 font-medium">
          {data.analysisCount === 0 
            ? '역대 전체 회차 당첨 번호를 기반으로 분석한 누적 통계입니다.' 
            : `최근 ${data.analysisCount}회차 당첨 번호를 기반으로 계산된 실시간 분석 통계입니다.`}
        </p>
        <p className="text-xs text-indigo-400 mt-1">
          로또는 매 회차 독립적인 확률로 추첨됩니다. 본 통계는 참고용으로만 사용해 주세요.
        </p>
      </div>
    </div>
    </>
  );
}
