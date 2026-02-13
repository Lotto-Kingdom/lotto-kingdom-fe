import { useMemo } from 'react';
import { BarChart3, Flame, Snowflake, TrendingUp, Hash, Shuffle, Star } from 'lucide-react';
import { getLottoNumberColor } from '../utils/lottoGenerator';

// ─────────────────────────────────────────────
// 데이터 (useLottoWinning의 MOCK_DRAWS와 동일)
// ─────────────────────────────────────────────
interface Draw {
  drwNo: number;
  drwNoDate: string;
  numbers: number[];
  bonusNo: number;
}

const DRAWS: Draw[] = [
  { drwNo: 1160, drwNoDate: '2026-02-08', numbers: [3, 14, 22, 31, 38, 42], bonusNo: 7  },
  { drwNo: 1159, drwNoDate: '2026-02-01', numbers: [5, 11, 19, 27, 33, 44], bonusNo: 2  },
  { drwNo: 1158, drwNoDate: '2026-01-25', numbers: [1,  9, 18, 26, 35, 43], bonusNo: 12 },
  { drwNo: 1157, drwNoDate: '2026-01-18', numbers: [7, 15, 23, 30, 37, 45], bonusNo: 4  },
  { drwNo: 1156, drwNoDate: '2026-01-11', numbers: [2, 10, 20, 28, 36, 41], bonusNo: 17 },
  { drwNo: 1155, drwNoDate: '2026-01-04', numbers: [4, 13, 21, 29, 34, 40], bonusNo: 8  },
  { drwNo: 1154, drwNoDate: '2025-12-28', numbers: [6, 12, 24, 32, 39, 44], bonusNo: 19 },
  { drwNo: 1153, drwNoDate: '2025-12-21', numbers: [8, 16, 25, 33, 38, 43], bonusNo: 3  },
  { drwNo: 1152, drwNoDate: '2025-12-14', numbers: [9, 17, 26, 31, 37, 42], bonusNo: 11 },
  { drwNo: 1151, drwNoDate: '2025-12-07', numbers: [1,  8, 19, 27, 36, 45], bonusNo: 22 },
  { drwNo: 1150, drwNoDate: '2025-11-30', numbers: [3, 11, 20, 29, 38, 44], bonusNo: 5  },
  { drwNo: 1149, drwNoDate: '2025-11-23', numbers: [2, 14, 23, 32, 40, 43], bonusNo: 9  },
  { drwNo: 1148, drwNoDate: '2025-11-16', numbers: [7, 13, 22, 30, 35, 41], bonusNo: 16 },
  { drwNo: 1147, drwNoDate: '2025-11-09', numbers: [4, 10, 18, 28, 37, 42], bonusNo: 24 },
  { drwNo: 1146, drwNoDate: '2025-11-02', numbers: [5, 15, 24, 33, 39, 44], bonusNo: 1  },
  { drwNo: 1145, drwNoDate: '2025-10-26', numbers: [6, 12, 21, 31, 36, 45], bonusNo: 13 },
  { drwNo: 1144, drwNoDate: '2025-10-19', numbers: [8, 16, 25, 34, 38, 41], bonusNo: 6  },
  { drwNo: 1143, drwNoDate: '2025-10-12', numbers: [9, 17, 26, 35, 40, 43], bonusNo: 20 },
  { drwNo: 1142, drwNoDate: '2025-10-05', numbers: [1, 11, 22, 32, 37, 44], bonusNo: 15 },
  { drwNo: 1141, drwNoDate: '2025-09-28', numbers: [3, 13, 23, 30, 39, 45], bonusNo: 10 },
];

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
function HotCold({ freq }: { freq: Record<number, number> }) {
  const sorted = Object.entries(freq)
    .map(([n, c]) => ({ n: Number(n), c }))
    .sort((a, b) => b.c - a.c);

  const hot = sorted.slice(0, 5);
  const cold = sorted.slice(-5).reverse();

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
          {hot.map(({ n, c }, idx) => (
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
                    style={{ width: `${(c / hot[0].c) * 100}%` }}
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
          {cold.map(({ n, c }, idx) => (
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
                    style={{ width: `${((c + 1) / (hot[0].c)) * 100}%` }}
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
const ZONES = [
  { label: '1~10', range: [1, 10],  color: 'bg-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { label: '11~20', range: [11, 20], color: 'bg-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  { label: '21~30', range: [21, 30], color: 'bg-red-400',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200'    },
  { label: '31~40', range: [31, 40], color: 'bg-gray-400',   text: 'text-gray-700',   bg: 'bg-gray-50',   border: 'border-gray-200'   },
  { label: '41~45', range: [41, 45], color: 'bg-green-400',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200'  },
];

function ZoneDistribution({ draws }: { draws: Draw[] }) {
  const zoneCounts = useMemo(() => {
    return ZONES.map((z) => {
      let count = 0;
      draws.forEach((d) => {
        d.numbers.forEach((n) => {
          if (n >= z.range[0] && n <= z.range[1]) count++;
        });
      });
      return { ...z, count };
    });
  }, [draws]);

  const total = zoneCounts.reduce((s, z) => s + z.count, 0);
  const maxCount = Math.max(...zoneCounts.map((z) => z.count));

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
function OddEvenAnalysis({ draws }: { draws: Draw[] }) {
  const stats = useMemo(() => {
    let odd = 0, even = 0;
    const patterns: Record<string, number> = {};
    draws.forEach((d) => {
      const o = d.numbers.filter((n) => n % 2 !== 0).length;
      const e = 6 - o;
      odd += o;
      even += e;
      const key = `홀${o}짝${e}`;
      patterns[key] = (patterns[key] ?? 0) + 1;
    });
    const topPattern = Object.entries(patterns).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { odd, even, total: odd + even, topPattern };
  }, [draws]);

  const oddPct = Math.round((stats.odd / stats.total) * 100);
  const evenPct = 100 - oddPct;

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
          <p className="text-2xl font-black text-violet-700">{stats.odd}</p>
          <p className="text-xs text-violet-500 font-semibold mt-0.5">홀수 출현</p>
          <p className="text-[10px] text-gray-400">평균 {(stats.odd / draws.length).toFixed(1)}개/회</p>
        </div>
        <div className="bg-pink-50 rounded-2xl p-3.5 text-center border border-pink-100">
          <p className="text-2xl font-black text-pink-700">{stats.even}</p>
          <p className="text-xs text-pink-500 font-semibold mt-0.5">짝수 출현</p>
          <p className="text-[10px] text-gray-400">평균 {(stats.even / draws.length).toFixed(1)}개/회</p>
        </div>
      </div>

      {/* 자주 나온 조합 패턴 */}
      <div>
        <p className="text-xs font-bold text-gray-500 mb-2">자주 나온 홀짝 조합</p>
        <div className="flex gap-2 flex-wrap">
          {stats.topPattern.map(([key, cnt]) => (
            <div key={key} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
              <span className="text-sm font-black text-indigo-700">{key}</span>
              <span className="text-xs text-indigo-400 font-bold">{cnt}회</span>
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
function SumDistribution({ draws }: { draws: Draw[] }) {
  const buckets = useMemo(() => {
    const ranges = [
      { label: '~100',   min: 0,   max: 100  },
      { label: '101~120',min: 101, max: 120  },
      { label: '121~140',min: 121, max: 140  },
      { label: '141~160',min: 141, max: 160  },
      { label: '161~180',min: 161, max: 180  },
      { label: '181~',   min: 181, max: 999  },
    ];
    return ranges.map((r) => ({
      ...r,
      count: draws.filter((d) => {
        const s = d.numbers.reduce((a, b) => a + b, 0);
        return s >= r.min && s <= r.max;
      }).length,
    }));
  }, [draws]);

  const sums = draws.map((d) => d.numbers.reduce((a, b) => a + b, 0));
  const avg = Math.round(sums.reduce((a, b) => a + b, 0) / sums.length);
  const minSum = Math.min(...sums);
  const maxSum = Math.max(...sums);
  const maxCount = Math.max(...buckets.map((b) => b.count));

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-teal-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">번호 합계 분포</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-teal-50 rounded-2xl p-3 text-center border border-teal-100">
          <p className="text-xl font-black text-teal-700">{avg}</p>
          <p className="text-[10px] text-teal-500 font-semibold">평균 합계</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
          <p className="text-xl font-black text-blue-700">{minSum}</p>
          <p className="text-[10px] text-blue-500 font-semibold">최소 합계</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-3 text-center border border-orange-100">
          <p className="text-xl font-black text-orange-700">{maxSum}</p>
          <p className="text-[10px] text-orange-500 font-semibold">최대 합계</p>
        </div>
      </div>

      {/* 막대 차트 */}
      <div className="flex items-end gap-2 h-28">
        {buckets.map((b) => {
          const pct = maxCount > 0 ? (b.count / maxCount) * 100 : 0;
          return (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-xs font-black text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {b.count}회
              </span>
              <div className="w-full flex items-end" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-teal-500 to-cyan-400 group-hover:from-teal-400 group-hover:to-cyan-300 transition-all"
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-400 font-medium text-center leading-tight">{b.label}</span>
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
function BonusAnalysis({ draws }: { draws: Draw[] }) {
  const bonusFreq = useMemo(() => {
    const freq: Record<number, number> = {};
    draws.forEach((d) => {
      freq[d.bonusNo] = (freq[d.bonusNo] ?? 0) + 1;
    });
    return Object.entries(freq)
      .map(([n, c]) => ({ n: Number(n), c }))
      .sort((a, b) => b.c - a.c);
  }, [draws]);

  const top5 = bonusFreq.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-gray-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">보너스 번호 분석</h3>
        <span className="text-xs text-gray-400 font-medium">TOP 5</span>
      </div>
      <div className="space-y-3">
        {top5.map(({ n, c }, idx) => (
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
                  style={{ width: `${(c / top5[0].c) * 100}%` }}
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
function ConsecutivePattern({ draws }: { draws: Draw[] }) {
  const stats = useMemo(() => {
    let hasConsec = 0;
    let totalConsecPairs = 0;
    const consecCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

    draws.forEach((d) => {
      const sorted = [...d.numbers].sort((a, b) => a - b);
      let pairs = 0;
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] === 1) pairs++;
      }
      if (pairs > 0) hasConsec++;
      totalConsecPairs += pairs;
      const key = Math.min(pairs, 3);
      consecCounts[key] = (consecCounts[key] ?? 0) + 1;
    });

    return { hasConsec, totalConsecPairs, consecCounts, pct: Math.round((hasConsec / draws.length) * 100) };
  }, [draws]);

  const items = [
    { label: '연속 없음', count: stats.consecCounts[0] ?? 0, color: 'bg-gray-200', text: 'text-gray-600' },
    { label: '1쌍 연속', count: stats.consecCounts[1] ?? 0, color: 'bg-blue-400', text: 'text-blue-700' },
    { label: '2쌍 연속', count: stats.consecCounts[2] ?? 0, color: 'bg-purple-400', text: 'text-purple-700' },
    { label: '3쌍 이상', count: stats.consecCounts[3] ?? 0, color: 'bg-pink-400', text: 'text-pink-700' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-pink-500" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">연속 번호 패턴</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-purple-50 rounded-2xl p-3.5 text-center border border-purple-100">
          <p className="text-2xl font-black text-purple-700">{stats.pct}%</p>
          <p className="text-[10px] text-purple-500 font-semibold">연속 번호 포함률</p>
        </div>
        <div className="bg-pink-50 rounded-2xl p-3.5 text-center border border-pink-100">
          <p className="text-2xl font-black text-pink-700">{(stats.totalConsecPairs / draws.length).toFixed(1)}</p>
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
              style={{ width: `${(item.count / draws.length) * 100}%` }}
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
              {Math.round((item.count / draws.length) * 100)}%
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
  const draws = DRAWS;

  const freq = useMemo(() => {
    const f: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) f[i] = 0;
    draws.forEach((d) => d.numbers.forEach((n) => { f[n]++; }));
    return f;
  }, [draws]);

  const topNum = Object.entries(freq).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
  const coldNum = Object.entries(freq).sort((a, b) => Number(a[1]) - Number(b[1]))[0];
  const totalNums = Object.values(freq).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full space-y-4 sm:space-y-6">

      {/* 페이지 헤더 */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl sm:text-2xl font-black text-gray-800">통계</h2>
      </div>

      {/* 히어로 배너 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-3xl shadow-xl p-5 sm:p-7">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3">
            당첨 번호 분석 · 최근 {draws.length}회차
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            <div>
              <p className="text-white/70 text-xs mb-1">분석 회차</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{draws.length}회</p>
              <p className="text-white/60 text-[10px] mt-0.5">{draws[draws.length-1].drwNo}~{draws[0].drwNo}회</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">총 추출 번호</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{totalNums}</p>
              <p className="text-white/60 text-[10px] mt-0.5">6개 × {draws.length}회</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">🔥 최다 출현</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{topNum[0]}번</p>
              <p className="text-white/60 text-[10px] mt-0.5">{topNum[1]}회 출현</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">❄️ 최소 출현</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{coldNum[0]}번</p>
              <p className="text-white/60 text-[10px] mt-0.5">{coldNum[1]}회 출현</p>
            </div>
          </div>
        </div>
      </div>

      {/* HOT / COLD */}
      <HotCold freq={freq} />

      {/* 구간별 분포 + 홀짝 분석 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ZoneDistribution draws={draws} />
        <OddEvenAnalysis draws={draws} />
      </div>

      {/* 번호 합계 + 연속 번호 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SumDistribution draws={draws} />
        <ConsecutivePattern draws={draws} />
      </div>

      {/* 보너스 번호 */}
      <BonusAnalysis draws={draws} />

      {/* 안내 */}
      <div className="bg-indigo-50 rounded-2xl p-4 text-center">
        <p className="text-xs text-indigo-600 font-medium">
          최근 {draws.length}회차 당첨 번호를 기반으로 분석한 통계입니다.
        </p>
        <p className="text-xs text-indigo-400 mt-1">
          로또는 매 회차 독립적인 확률로 추첨됩니다. 본 통계는 참고용입니다.
        </p>
      </div>
    </div>
  );
}
