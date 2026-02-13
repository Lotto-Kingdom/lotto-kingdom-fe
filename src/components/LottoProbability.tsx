import { useMemo } from 'react';
import { Percent, Zap, ChevronUp } from 'lucide-react';
import { LottoNumber } from '../types';
import { getLottoNumberColor } from '../utils/lottoGenerator';

// ── 로또 이론 확률 상수 ──────────────────────────────────
const RANK_PROB: Record<number, number> = {
  1: 8_145_060,   // 1/8,145,060
  2: 1_357_510,   // 1/1,357,510
  3: 35_724,      // 1/35,724
  4: 733,         // 1/733
  5: 45,          // 1/45
};

const RANK_LABEL = ['1등', '2등', '3등', '4등', '5등'];
const RANK_MATCH = ['6개', '5개+보너스', '5개', '4개', '3개'];
const RANK_COLORS = [
  { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', bar: 'bg-yellow-400' },
  { bg: 'bg-gray-50',   border: 'border-gray-300',   text: 'text-gray-600',   bar: 'bg-gray-400' },
  { bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-700',  bar: 'bg-amber-500' },
  { bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-700',   bar: 'bg-blue-400' },
  { bg: 'bg-green-50',  border: 'border-green-300',  text: 'text-green-700',  bar: 'bg-green-400' },
];

// 누적 확률: 1 - (1 - 1/p)^n
function cumulativeProb(n: number, p: number): number {
  if (n === 0) return 0;
  return 1 - Math.pow(1 - 1 / p, n);
}

// 확률 포맷: 소수점 아래 유효숫자 표시
function fmtProb(p: number): string {
  if (p === 0) return '0%';
  if (p >= 0.01) return `${(p * 100).toFixed(2)}%`;
  if (p >= 0.0001) return `${(p * 100).toFixed(4)}%`;
  return `${(p * 100).toExponential(2)}%`;
}

// 1/N 형태 표시
function fmtOdds(n: number, p: number): string {
  if (n === 0) return '-';
  const val = Math.round(p / n);
  return `1/${val.toLocaleString()}`;
}

interface Props {
  history: LottoNumber[];
}

export function LottoProbability({ history }: Props) {
  const totalSets = history.length;

  // 당첨 기록
  const winCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const e of history) {
      if (e.winningInfo && e.winningInfo.rank >= 1 && e.winningInfo.rank <= 5) {
        counts[e.winningInfo.rank - 1]++;
      }
    }
    return counts;
  }, [history]);

  // 회차별 그룹핑
  const roundGroups = useMemo(() => {
    const map = new Map<number, LottoNumber[]>();
    for (const e of history) {
      const arr = map.get(e.round) ?? [];
      arr.push(e);
      map.set(e.round, arr);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0] - a[0]) // 최신 회차 먼저
      .slice(0, 10);               // 최근 10회차
  }, [history]);

  if (totalSets === 0) return null;

  const prob1 = cumulativeProb(totalSets, RANK_PROB[1]);
  const prob5 = cumulativeProb(totalSets, RANK_PROB[5]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Percent className="w-5 h-5 text-white" />
          <h3 className="text-white font-bold text-base">내 당첨 확률</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-xl p-3">
            <p className="text-white/70 text-xs mb-1">총 생성 세트</p>
            <p className="text-white font-black text-2xl leading-none">{totalSets}<span className="text-sm font-normal ml-1">세트</span></p>
          </div>
          <div className="bg-white/15 rounded-xl p-3">
            <p className="text-white/70 text-xs mb-1">누적 1등 확률</p>
            <p className="text-white font-black text-xl leading-none">{fmtOdds(totalSets, RANK_PROB[1])}</p>
            <p className="text-white/60 text-xs mt-0.5">{fmtProb(prob1)}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* 등수별 확률 테이블 */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">등수별 누적 확률 ({totalSets}세트 기준)</p>
          <div className="space-y-2">
            {[1,2,3,4,5].map((rank) => {
              const prob = cumulativeProb(totalSets, RANK_PROB[rank]);
              const c = RANK_COLORS[rank - 1];
              const hit = winCounts[rank - 1];
              // 로그 스케일 진행바 (1등 = 최소, 5등 = 최대)
              const barPct = Math.min(100, Math.max(2, (prob / cumulativeProb(totalSets, RANK_PROB[5])) * 100));
              return (
                <div key={rank} className={`border ${c.border} ${c.bg} rounded-xl px-3 py-2`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black ${c.text} w-8`}>{RANK_LABEL[rank-1]}</span>
                      <span className="text-xs text-gray-400">{RANK_MATCH[rank-1]} 일치</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${c.text}`}>{fmtOdds(totalSets, RANK_PROB[rank])}</span>
                      {hit > 0 && (
                        <span className="flex items-center gap-1 text-xs bg-white border border-current rounded-full px-2 py-0.5 font-bold text-emerald-600 border-emerald-300">
                          <Zap className="w-3 h-3" />당첨 {hit}건
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            기준 확률: 1등 1/8,145,060 · 5등 1/45
          </p>
        </div>

        {/* 5등 확률 강조 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ChevronUp className="w-4 h-4 text-green-600" />
            <p className="text-sm font-bold text-green-700">5등 이상 당첨 가능성</p>
          </div>
          <p className="text-2xl font-black text-green-600">{fmtProb(prob5)}</p>
          <p className="text-xs text-green-500 mt-1">{totalSets}세트 생성 시 3개 이상 일치할 누적 확률</p>
        </div>

        {/* 회차별 현황 */}
        {roundGroups.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">회차별 생성 현황 (최근 10회차)</p>
            <div className="space-y-2">
              {roundGroups.map(([round, entries]) => {
                const bestRank = entries
                  .filter(e => e.winningInfo)
                  .map(e => e.winningInfo!.rank)
                  .sort((a, b) => a - b)[0];

                return (
                  <div key={round} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    {/* 회차 배지 */}
                    <span className="flex-shrink-0 text-xs font-bold text-gray-500 w-14 text-right">
                      {round}회
                    </span>

                    {/* 세트 수 */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {entries.map((e) => {
                        const rank = e.winningInfo?.rank;
                        const c = rank ? RANK_COLORS[rank - 1] : null;
                        return (
                          <div
                            key={e.id}
                            className={`w-2 h-6 rounded-sm ${c ? c.bar : 'bg-gray-200'}`}
                            title={rank ? `${RANK_LABEL[rank-1]} 당첨` : `${e.numbers.join(', ')}`}
                          />
                        );
                      })}
                    </div>

                    {/* 번호 미리보기 (첫 세트) */}
                    <div className="flex gap-1 flex-wrap flex-1">
                      {entries[0].numbers.map(n => (
                        <span
                          key={n}
                          className={`w-5 h-5 rounded-full ${getLottoNumberColor(n)} text-white text-[10px] font-bold flex items-center justify-center`}
                        >
                          {n}
                        </span>
                      ))}
                      {entries.length > 1 && (
                        <span className="text-xs text-gray-400 self-center">+{entries.length - 1}</span>
                      )}
                    </div>

                    {/* 이 회차 1등 확률 */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-gray-400">{entries.length}세트</p>
                      <p className="text-xs font-bold text-indigo-500">{fmtOdds(entries.length, RANK_PROB[1])}</p>
                    </div>

                    {/* 당첨 뱃지 */}
                    {bestRank && (
                      <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border ${RANK_COLORS[bestRank-1].bg} ${RANK_COLORS[bestRank-1].border} ${RANK_COLORS[bestRank-1].text}`}>
                        {RANK_LABEL[bestRank-1]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
