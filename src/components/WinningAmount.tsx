import { useMemo, useState } from 'react';
import {
  DollarSign, TrendingUp, Trophy, Users, ChevronDown, ChevronUp,
  Banknote, Star, Award, Sparkles, BarChart3,
} from 'lucide-react';
import { SEO } from './SEO';

// ─────────────────────────────────────────────
// useLottoWinning 의 MOCK_DRAWS 를 직접 임포트
// ─────────────────────────────────────────────
interface DrawData {
  drwNo: number;
  drwNoDate: string;
  firstWinamnt: number;
  firstPrzwnerCo: number;
  firstAccumamnt: number;
  totSellamnt: number;
}

const DRAWS: DrawData[] = [
  { drwNo: 1160, drwNoDate: '2026-02-08', firstWinamnt: 2_345_678_901, firstPrzwnerCo: 3, firstAccumamnt: 7_037_036_703,  totSellamnt: 105_432_000_000 },
  { drwNo: 1159, drwNoDate: '2026-02-01', firstWinamnt: 1_876_543_210, firstPrzwnerCo: 5, firstAccumamnt: 9_382_716_050,  totSellamnt: 98_765_000_000  },
  { drwNo: 1158, drwNoDate: '2026-01-25', firstWinamnt: 3_012_345_678, firstPrzwnerCo: 2, firstAccumamnt: 6_024_691_356,  totSellamnt: 112_300_000_000 },
  { drwNo: 1157, drwNoDate: '2026-01-18', firstWinamnt: 4_500_000_000, firstPrzwnerCo: 1, firstAccumamnt: 4_500_000_000,  totSellamnt: 120_000_000_000 },
  { drwNo: 1156, drwNoDate: '2026-01-11', firstWinamnt: 1_234_567_890, firstPrzwnerCo: 7, firstAccumamnt: 8_641_975_230,  totSellamnt: 95_500_000_000  },
  { drwNo: 1155, drwNoDate: '2026-01-04', firstWinamnt: 2_789_012_345, firstPrzwnerCo: 4, firstAccumamnt: 11_156_049_380, totSellamnt: 108_900_000_000 },
  { drwNo: 1154, drwNoDate: '2025-12-28', firstWinamnt: 5_100_000_000, firstPrzwnerCo: 1, firstAccumamnt: 5_100_000_000,  totSellamnt: 130_200_000_000 },
  { drwNo: 1153, drwNoDate: '2025-12-21', firstWinamnt: 1_567_890_123, firstPrzwnerCo: 6, firstAccumamnt: 9_407_340_738,  totSellamnt: 97_100_000_000  },
  { drwNo: 1152, drwNoDate: '2025-12-14', firstWinamnt: 3_456_789_012, firstPrzwnerCo: 2, firstAccumamnt: 6_913_578_024,  totSellamnt: 115_400_000_000 },
  { drwNo: 1151, drwNoDate: '2025-12-07', firstWinamnt: 2_100_000_000, firstPrzwnerCo: 3, firstAccumamnt: 6_300_000_000,  totSellamnt: 102_600_000_000 },
  { drwNo: 1150, drwNoDate: '2025-11-30', firstWinamnt: 1_890_000_000, firstPrzwnerCo: 5, firstAccumamnt: 9_450_000_000,  totSellamnt: 99_300_000_000  },
  { drwNo: 1149, drwNoDate: '2025-11-23', firstWinamnt: 6_200_000_000, firstPrzwnerCo: 1, firstAccumamnt: 6_200_000_000,  totSellamnt: 135_800_000_000 },
  { drwNo: 1148, drwNoDate: '2025-11-16', firstWinamnt: 2_450_000_000, firstPrzwnerCo: 4, firstAccumamnt: 9_800_000_000,  totSellamnt: 107_200_000_000 },
  { drwNo: 1147, drwNoDate: '2025-11-09', firstWinamnt: 1_730_000_000, firstPrzwnerCo: 6, firstAccumamnt: 10_380_000_000, totSellamnt: 94_500_000_000  },
  { drwNo: 1146, drwNoDate: '2025-11-02', firstWinamnt: 3_800_000_000, firstPrzwnerCo: 2, firstAccumamnt: 7_600_000_000,  totSellamnt: 118_700_000_000 },
  { drwNo: 1145, drwNoDate: '2025-10-26', firstWinamnt: 2_670_000_000, firstPrzwnerCo: 3, firstAccumamnt: 8_010_000_000,  totSellamnt: 103_400_000_000 },
  { drwNo: 1144, drwNoDate: '2025-10-19', firstWinamnt: 1_990_000_000, firstPrzwnerCo: 5, firstAccumamnt: 9_950_000_000,  totSellamnt: 100_100_000_000 },
  { drwNo: 1143, drwNoDate: '2025-10-12', firstWinamnt: 4_150_000_000, firstPrzwnerCo: 2, firstAccumamnt: 8_300_000_000,  totSellamnt: 122_500_000_000 },
  { drwNo: 1142, drwNoDate: '2025-10-05', firstWinamnt: 2_880_000_000, firstPrzwnerCo: 3, firstAccumamnt: 8_640_000_000,  totSellamnt: 109_600_000_000 },
  { drwNo: 1141, drwNoDate: '2025-09-28', firstWinamnt: 1_650_000_000, firstPrzwnerCo: 7, firstAccumamnt: 11_550_000_000, totSellamnt: 96_800_000_000  },
];

// ─────────────────────────────────────────────
// 등수별 기준 정보
// ─────────────────────────────────────────────
const RANK_INFO = [
  {
    rank: 1, label: '1등', match: '6개 일치',
    color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200',
    icon: Star, avgAmt: null, // 실제 데이터 사용
    desc: '당첨금의 75%를 1등 당첨자 수로 나눔',
  },
  {
    rank: 2, label: '2등', match: '5개 + 보너스',
    color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200',
    icon: Award, avgAmt: 58_320_000,
    desc: '당첨금의 12.5%를 2등 당첨자 수로 나눔',
  },
  {
    rank: 3, label: '3등', match: '5개 일치',
    color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',
    icon: TrendingUp, avgAmt: 1_471_000,
    desc: '당첨금의 12.5%를 3등 당첨자 수로 나눔',
  },
  {
    rank: 4, label: '4등', match: '4개 일치',
    color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200',
    icon: Sparkles, avgAmt: 50_000,
    desc: '고정 50,000원',
  },
  {
    rank: 5, label: '5등', match: '3개 일치',
    color: 'from-gray-400 to-slate-500', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200',
    icon: DollarSign, avgAmt: 5_000,
    desc: '고정 5,000원',
  },
];

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────
function fmtBillion(won: number) {
  const eok = won / 1_0000_0000;
  return eok >= 1
    ? `${eok.toFixed(1).replace(/\.0$/, '')}억`
    : `${(won / 10000).toLocaleString()}만`;
}

function fmtWon(won: number) {
  if (won >= 1_0000_0000) return `${(won / 1_0000_0000).toFixed(1)}억원`;
  if (won >= 10_000) return `${(won / 10_000).toLocaleString()}만원`;
  return `${won.toLocaleString()}원`;
}

// ─────────────────────────────────────────────
// 당첨금 막대 차트 (CSS only)
// ─────────────────────────────────────────────
function PrizeBarChart({ draws }: { draws: DrawData[] }) {
  const maxAmt = Math.max(...draws.map((d) => d.firstWinamnt));
  // 오래된 순으로 표시
  const sorted = [...draws].sort((a, b) => a.drwNo - b.drwNo);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-amber-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">1등 당첨금 추이</h3>
        <span className="text-xs text-gray-400 font-medium">최근 {draws.length}회차</span>
      </div>

      {/* 차트 영역 */}
      <div className="flex items-end gap-1 sm:gap-1.5 h-40 sm:h-52">
        {sorted.map((d) => {
          const pct = (d.firstWinamnt / maxAmt) * 100;
          const isMax = d.firstWinamnt === maxAmt;
          return (
            <div
              key={d.drwNo}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              {/* 툴팁 */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold rounded-lg px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                <p>{d.drwNo}회</p>
                <p className="text-amber-300">{fmtBillion(d.firstWinamnt)}</p>
                <p className="text-gray-400 font-normal">{d.drwNoDate}</p>
              </div>

              {/* 막대 */}
              <div className="w-full flex items-end" style={{ height: '100%' }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110 ${
                    isMax
                      ? 'bg-gradient-to-t from-amber-500 to-yellow-300'
                      : 'bg-gradient-to-t from-blue-400 to-purple-400'
                  }`}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* x축 레이블 - 5개만 표시 */}
      <div className="flex justify-between mt-2 px-0.5">
        {[sorted[0], sorted[Math.floor(sorted.length / 4)], sorted[Math.floor(sorted.length / 2)], sorted[Math.floor(sorted.length * 3 / 4)], sorted[sorted.length - 1]].map((d) => (
          <span key={d.drwNo} className="text-[10px] text-gray-400 font-medium">{d.drwNo}회</span>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-amber-500 to-yellow-300" />
          <span className="text-xs text-gray-500">역대 최고</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-blue-400 to-purple-400" />
          <span className="text-xs text-gray-500">일반 회차</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 등수별 당첨 기준 카드
// ─────────────────────────────────────────────
function RankCard({
  info,
  avgFirst,
}: {
  info: typeof RANK_INFO[number];
  avgFirst: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const amt = info.avgAmt ?? avgFirst;
  const Icon = info.icon;

  return (
    <div className={`rounded-2xl border ${info.border} ${info.bg} overflow-hidden`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        {/* 등수 원 */}
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-black text-base ${info.text}`}>{info.label}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 ${info.text}`}>
              {info.match}
            </span>
          </div>
          <p className={`text-sm font-black mt-0.5 ${info.text}`}>
            {info.rank <= 3 ? `평균 ${fmtWon(amt)}` : fmtWon(amt)}
          </p>
        </div>

        <div className={`${info.text} opacity-60`}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className={`px-4 pb-4 pt-0 border-t ${info.border}`}>
          <p className="text-xs text-gray-500 mt-3">{info.desc}</p>
          {info.rank <= 3 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="bg-white/70 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-gray-500">최소</p>
                <p className={`text-sm font-black ${info.text}`}>
                  {fmtWon(Math.round(amt * 0.5))}
                </p>
              </div>
              <div className="bg-white/70 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-gray-500">최대</p>
                <p className={`text-sm font-black ${info.text}`}>
                  {fmtWon(Math.round(amt * 1.8))}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 당첨자 수 분포 (가로 바)
// ─────────────────────────────────────────────
function WinnerDistribution({ draws }: { draws: DrawData[] }) {
  const dist = useMemo(() => {
    const one = draws.filter((d) => d.firstPrzwnerCo === 1).length;
    const two = draws.filter((d) => d.firstPrzwnerCo === 2).length;
    const three = draws.filter((d) => d.firstPrzwnerCo >= 3 && d.firstPrzwnerCo <= 5).length;
    const many = draws.filter((d) => d.firstPrzwnerCo >= 6).length;
    return [
      { label: '1명 단독', count: one, color: 'bg-amber-400' },
      { label: '2명', count: two, color: 'bg-blue-400' },
      { label: '3~5명', count: three, color: 'bg-emerald-400' },
      { label: '6명 이상', count: many, color: 'bg-purple-400' },
    ];
  }, [draws]);

  const total = draws.length;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">1등 당첨자 수 분포</h3>
        <span className="text-xs text-gray-400 font-medium">{total}회차 기준</span>
      </div>

      {/* 스택 바 */}
      <div className="flex h-5 rounded-full overflow-hidden gap-0.5 mb-4">
        {dist.map((d) =>
          d.count > 0 ? (
            <div
              key={d.label}
              className={`${d.color} transition-all`}
              style={{ width: `${(d.count / total) * 100}%` }}
            />
          ) : null
        )}
      </div>

      <div className="space-y-2.5">
        {dist.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${d.color}`} />
            <span className="text-sm text-gray-600 w-16 flex-shrink-0">{d.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${d.color}`}
                style={{ width: `${(d.count / total) * 100}%` }}
              />
            </div>
            <span className="text-sm font-black text-gray-700 w-8 text-right">{d.count}회</span>
            <span className="text-xs text-gray-400 w-10 text-right">
              {Math.round((d.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 회차별 당첨금 상세 테이블
// ─────────────────────────────────────────────
function DrawTable({ draws }: { draws: DrawData[] }) {
  const [showAll, setShowAll] = useState(false);
  const maxAmt = Math.max(...draws.map((d) => d.firstWinamnt));
  const sorted = [...draws].sort((a, b) => b.drwNo - a.drwNo);
  const displayed = showAll ? sorted : sorted.slice(0, 10);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Banknote className="w-5 h-5 text-emerald-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">회차별 당첨금 내역</h3>
      </div>

      <div className="space-y-2">
        {displayed.map((d) => {
          const isMax = d.firstWinamnt === maxAmt;
          const barPct = (d.firstWinamnt / maxAmt) * 100;
          return (
            <div
              key={d.drwNo}
              className={`rounded-2xl p-3.5 border transition-all ${
                isMax
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm'
                  : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 flex-wrap">
                {/* 회차 */}
                <span className={`flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-xl text-white ${
                  isMax
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {d.drwNo}회
                </span>

                {/* 날짜 */}
                <span className="text-xs text-gray-400 font-medium hidden sm:block flex-shrink-0">
                  {d.drwNoDate}
                </span>

                {/* 당첨자 수 */}
                <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 flex-shrink-0">
                  <Users className="w-3 h-3" />
                  {d.firstPrzwnerCo}명
                </span>

                {/* 인당 당첨금 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isMax ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-gradient-to-r from-blue-400 to-purple-400'}`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 금액 */}
                <span className={`flex-shrink-0 text-sm font-black ${isMax ? 'text-amber-600' : 'text-gray-800'}`}>
                  {fmtBillion(d.firstWinamnt)}
                </span>

                {isMax && (
                  <span className="flex-shrink-0 text-[10px] font-black px-1.5 py-0.5 bg-amber-400 text-white rounded-full">
                    최고
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {draws.length > 10 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 w-full py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600 flex items-center justify-center gap-1.5"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`} />
          {showAll ? '접기' : `${draws.length - 10}개 더 보기`}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export function WinningAmount() {
  const draws = DRAWS;

  const stats = useMemo(() => {
    const maxDraw = draws.reduce((max, d) => d.firstWinamnt > max.firstWinamnt ? d : max, draws[0]);
    const minDraw = draws.reduce((min, d) => d.firstWinamnt < min.firstWinamnt ? d : min, draws[0]);
    const avg = Math.round(draws.reduce((s, d) => s + d.firstWinamnt, 0) / draws.length);
    const totalAccum = draws.reduce((s, d) => s + d.firstAccumamnt, 0);
    const soloCount = draws.filter((d) => d.firstPrzwnerCo === 1).length;
    return { maxDraw, minDraw, avg, totalAccum, soloCount };
  }, [draws]);

  const avgFirst = stats.avg;

  // TOP 5 회차
  const top5 = useMemo(
    () => [...draws].sort((a, b) => b.firstWinamnt - a.firstWinamnt).slice(0, 5),
    [draws]
  );

  return (
    <>
      <SEO title="역대 당첨금 및 기준 확인 - 로또나라" description="로또 1등 당첨금 내역과 등수별 당첨 기준을 확인하세요." />
      <div className="w-full space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl sm:text-2xl font-black text-gray-800">당첨 금액</h2>
      </div>

      {/* 히어로 배너 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400 rounded-3xl shadow-xl p-5 sm:p-7">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-4">
            당첨금 현황 · 최근 {draws.length}회차
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            <div>
              <p className="text-white/70 text-xs mb-1">역대 최고 1등</p>
              <p className="text-white font-black text-2xl sm:text-3xl leading-none">
                {fmtBillion(stats.maxDraw.firstWinamnt)}
              </p>
              <p className="text-white/60 text-[10px] mt-1">{stats.maxDraw.drwNo}회 ({stats.maxDraw.drwNoDate})</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">평균 1등 당첨금</p>
              <p className="text-white font-black text-2xl sm:text-3xl leading-none">
                {fmtBillion(stats.avg)}
              </p>
              <p className="text-white/60 text-[10px] mt-1">1인당 기준</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">총 지급 당첨금</p>
              <p className="text-white font-black text-2xl sm:text-3xl leading-none">
                {fmtBillion(stats.totalAccum)}
              </p>
              <p className="text-white/60 text-[10px] mt-1">1등 누적 합계</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">단독 당첨</p>
              <p className="text-white font-black text-2xl sm:text-3xl leading-none">
                {stats.soloCount}회
              </p>
              <p className="text-white/60 text-[10px] mt-1">전체의 {Math.round((stats.soloCount / draws.length) * 100)}%</p>
            </div>
          </div>

          {/* 최저 당첨금 안내 */}
          <div className="mt-4 flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5 w-fit">
            <TrendingUp className="w-4 h-4 text-white/80 flex-shrink-0" />
            <span className="text-white/80 text-xs">최저 1등 당첨금</span>
            <span className="text-white font-black text-sm">{fmtBillion(stats.minDraw.firstWinamnt)}</span>
            <span className="text-white/60 text-xs">({stats.minDraw.drwNo}회)</span>
          </div>
        </div>
      </div>

      {/* 당첨금 추이 차트 */}
      <PrizeBarChart draws={draws} />

      {/* TOP 5 최고 당첨금 회차 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-gray-800 text-base sm:text-lg">최고 당첨금 TOP 5</h3>
        </div>

        <div className="space-y-2.5">
          {top5.map((d, idx) => {
            const medal = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][idx];
            const barPct = (d.firstWinamnt / top5[0].firstWinamnt) * 100;
            return (
              <div key={d.drwNo} className={`rounded-2xl p-3.5 border flex items-center gap-3 ${
                idx === 0
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
                  : 'bg-gray-50 border-gray-100'
              }`}>
                <span className="text-xl flex-shrink-0">{medal}</span>
                <div className="flex-shrink-0 text-center w-14">
                  <span className={`text-xs font-black px-2 py-1 rounded-xl text-white inline-block ${
                    idx === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}>
                    {d.drwNo}회
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{d.drwNoDate}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />{d.firstPrzwnerCo}명
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-gradient-to-r from-blue-300 to-purple-300'}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
                <span className={`flex-shrink-0 text-base font-black ${idx === 0 ? 'text-amber-600' : 'text-gray-700'}`}>
                  {fmtBillion(d.firstWinamnt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 등수별 당첨 기준 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-500" />
          <h3 className="font-black text-gray-800 text-base sm:text-lg">등수별 당첨 기준 및 금액</h3>
        </div>
        <div className="space-y-2.5">
          {RANK_INFO.map((info) => (
            <RankCard key={info.rank} info={info} avgFirst={avgFirst} />
          ))}
        </div>
      </div>

      {/* 당첨자 수 분포 */}
      <WinnerDistribution draws={draws} />

      {/* 회차별 상세 목록 */}
      <DrawTable draws={draws} />

      {/* 안내 */}
      <div className="bg-amber-50 rounded-2xl p-4 text-center">
        <p className="text-xs text-amber-600 font-medium">
          당첨 금액은 총 판매금액의 일정 비율로 결정되며, 당첨자 수에 따라 달라집니다.
        </p>
        <p className="text-xs text-amber-400 mt-1">
          본 데이터는 참고용이며 실제 현황과 다를 수 있습니다.
        </p>
      </div>
    </div>
    </>
  );
}
