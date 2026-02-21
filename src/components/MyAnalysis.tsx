import { useMemo, useState } from 'react';
import { useLottoHistory } from '../hooks/useLottoHistory';
import { getLottoNumberColor } from '../utils/lottoGenerator';
import { Sparkles, TrendingUp, BarChart2, Trophy, AlertCircle, RefreshCw, History } from 'lucide-react';
import { LottoHistory } from './LottoHistory';

// ── 번호 공 ──────────────────────────────────────────────
function Ball({ n, size = 'md', dim = false }: { n: number; size?: 'sm' | 'md' | 'lg'; dim?: boolean }) {
  const color = getLottoNumberColor(n);
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-sm font-black' : 'w-8 h-8 text-xs';
  return (
    <span className={`${sz} ${color} ${dim ? 'opacity-30' : ''} rounded-full flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0`}>
      {n}
    </span>
  );
}

// ── 섹션 카드 래퍼 ───────────────────────────────────────
function Section({ title, icon: Icon, children, accent = 'blue' }: {
  title: string; icon: React.ElementType; children: React.ReactNode; accent?: string;
}) {
  const accents: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-400 to-amber-500',
    green: 'from-emerald-500 to-teal-500',
    red: 'from-rose-500 to-pink-500',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${accents[accent]} px-5 py-3 flex items-center gap-2`}>
        <Icon className="w-4 h-4 text-white" />
        <h2 className="text-white font-bold text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── 추천 번호 생성 로직 ──────────────────────────────────
function generateRecommended(freq: [number, number][], count = 6): number[] {
  if (freq.length === 0) {
    const nums = Array.from({ length: 45 }, (_, i) => i + 1);
    return nums.sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b);
  }
  // 상위 빈도 기반 가중치 추출
  const total = freq.reduce((s, [, f]) => s + f, 0);
  const weighted: number[] = [];
  for (const [num, f] of freq) {
    const weight = Math.max(1, Math.round((f / total) * 100));
    for (let i = 0; i < weight; i++) weighted.push(num);
  }
  const picked = new Set<number>();
  let tries = 0;
  while (picked.size < count && tries < 1000) {
    const idx = Math.floor(Math.random() * weighted.length);
    picked.add(weighted[idx]);
    tries++;
  }
  // 부족하면 채우기
  while (picked.size < count) {
    picked.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(picked).sort((a, b) => a - b);
}

// ── 메인 컴포넌트 ────────────────────────────────────────
export function MyAnalysis() {
  const { history, deleteEntry, clearHistory, updateEntry } = useLottoHistory();
  const [recommends, setRecommends] = useState<number[][]>([]);
  const [recGenerated, setRecGenerated] = useState(false);

  const hasData = history.length > 0;

  // 전체 번호 플랫 리스트
  const allNums = useMemo(() => history.flatMap(e => e.numbers), [history]);

  // 번호별 빈도 [num, count][] 내림차순
  const freq = useMemo<[number, number][]>(() => {
    const map = new Map<number, number>();
    for (const n of allNums) map.set(n, (map.get(n) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [allNums]);

  // 홀짝 분석
  const oddEven = useMemo(() => {
    const odd = allNums.filter(n => n % 2 !== 0).length;
    const even = allNums.length - odd;
    const oddPct = allNums.length ? Math.round((odd / allNums.length) * 100) : 50;
    return { odd, even, oddPct };
  }, [allNums]);

  // 구간별 분포
  const zones = useMemo(() => {
    const z = [0, 0, 0, 0, 0];
    for (const n of allNums) {
      if (n <= 10) z[0]++;
      else if (n <= 20) z[1]++;
      else if (n <= 30) z[2]++;
      else if (n <= 40) z[3]++;
      else z[4]++;
    }
    return z;
  }, [allNums]);

  const zoneLabels = ['1–10', '11–20', '21–30', '31–40', '41–45'];
  const zoneColors = ['bg-yellow-400', 'bg-blue-500', 'bg-red-500', 'bg-gray-500', 'bg-green-500'];

  // 합계 분포
  const sums = useMemo(() => history.map(e => e.numbers.reduce((s, n) => s + n, 0)), [history]);
  const avgSum = useMemo(() => sums.length ? Math.round(sums.reduce((s, v) => s + v, 0) / sums.length) : 0, [sums]);

  // 당첨 통계 (winningInfo 기반)
  const winStats = useMemo(() => {
    const ranked = history.filter(e => e.winningInfo && e.winningInfo.rank <= 5);
    const rankCount = [0, 0, 0, 0, 0]; // 1~5등
    let totalPrize = 0;
    for (const e of ranked) {
      if (e.winningInfo) {
        rankCount[e.winningInfo.rank - 1]++;
        totalPrize += e.winningInfo.prize ?? 0;
      }
    }
    return { ranked, rankCount, totalPrize };
  }, [history]);

  // 추천 번호 생성
  const handleGenerate = () => {
    const recs: number[][] = [];
    for (let i = 0; i < 5; i++) recs.push(generateRecommended(freq));
    setRecommends(recs);
    setRecGenerated(true);
  };

  const maxFreq = freq[0]?.[1] ?? 1;
  const maxZone = Math.max(...zones, 1);

  const rankLabels = ['1등', '2등', '3등', '4등', '5등'];
  const rankColors = ['text-yellow-600', 'text-gray-500', 'text-amber-700', 'text-blue-500', 'text-gray-500'];
  const rankBg = ['bg-yellow-50 border-yellow-200', 'bg-gray-50 border-gray-200', 'bg-amber-50 border-amber-200', 'bg-blue-50 border-blue-200', 'bg-gray-50 border-gray-200'];

  if (!hasData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <BarChart2 className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-3">아직 생성한 번호가 없어요</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          홈에서 로또 번호를 생성하면<br />여기서 패턴 분석과 추천 번호를 확인할 수 있어요.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <AlertCircle className="w-4 h-4" />
          <span>번호를 생성하면 자동으로 분석됩니다</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ── 히어로 요약 ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5" />
          <h1 className="text-lg font-black">내 번호 분석</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: '총 생성 세트', value: `${history.length}세트` },
            { label: '총 번호 개수', value: `${allNums.length}개` },
            { label: '가장 많이 생성', value: freq[0] ? `${freq[0][0]}번 (${freq[0][1]}회)` : '-' },
            { label: '당첨 기록', value: `${winStats.ranked.length}건` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/15 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">{label}</p>
              <p className="text-white font-black text-lg leading-none">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 그리드: 빈도 + 홀짝 ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 자주 생성한 번호 TOP 10 */}
        <Section title="자주 생성한 번호 TOP 10" icon={TrendingUp} accent="blue">
          <div className="space-y-2">
            {freq.slice(0, 10).map(([num, cnt], i) => (
              <div key={num} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                <Ball n={num} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-gray-500">{cnt}회</span>
                    <span className="text-xs text-gray-400">{Math.round((cnt / maxFreq) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getLottoNumberColor(num)} rounded-full transition-all`}
                      style={{ width: `${(cnt / maxFreq) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {freq.length === 0 && <p className="text-sm text-gray-400 text-center py-4">데이터 없음</p>}
          </div>
        </Section>

        {/* 홀짝 & 구간 분포 */}
        <div className="space-y-6">
          {/* 홀짝 */}
          <Section title="홀수 / 짝수 비율" icon={BarChart2} accent="purple">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>홀수 {oddEven.odd}개</span>
                  <span>짝수 {oddEven.even}개</span>
                </div>
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${oddEven.oddPct}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all"
                    style={{ width: `${100 - oddEven.oddPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-purple-600 font-bold">{oddEven.oddPct}%</span>
                  <span className="text-blue-500 font-bold">{100 - oddEven.oddPct}%</span>
                </div>
              </div>
            </div>
          </Section>

          {/* 구간 분포 */}
          <Section title="번호 구간 분포" icon={BarChart2} accent="orange">
            <div className="space-y-2">
              {zones.map((cnt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-12 flex-shrink-0">{zoneLabels[i]}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${zoneColors[i]} rounded-full transition-all`}
                      style={{ width: `${(cnt / maxZone) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{cnt}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── 합계 분포 ────────────────────────────────── */}
      <Section title="번호 합계 분포" icon={BarChart2} accent="green">
        <div className="flex items-end gap-1 h-24 mb-3">
          {(() => {
            // 구간별 카운트: 50~250 범위를 10구간
            const buckets = Array(20).fill(0);
            const minS = 21, maxS = 279, step = (maxS - minS) / 20;
            for (const s of sums) {
              const idx = Math.min(19, Math.floor((s - minS) / step));
              buckets[Math.max(0, idx)]++;
            }
            const bMax = Math.max(...buckets, 1);
            return buckets.map((cnt, i) => {
              const from = Math.round(minS + i * step);
              const to = Math.round(minS + (i + 1) * step);
              const highlight = from <= avgSum && avgSum < to;
              return (
                <div
                  key={i}
                  className="flex-1 group relative cursor-default"
                  title={`${from}~${to}: ${cnt}회`}
                >
                  <div
                    className={`w-full rounded-t transition-all ${highlight ? 'bg-emerald-500' : 'bg-emerald-200 group-hover:bg-emerald-400'}`}
                    style={{ height: `${(cnt / bMax) * 100}%` }}
                  />
                </div>
              );
            });
          })()}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>합계 최소: {sums.length ? Math.min(...sums) : '-'}</span>
          <span className="text-emerald-600 font-bold">평균 합계: {avgSum}</span>
          <span>합계 최대: {sums.length ? Math.max(...sums) : '-'}</span>
        </div>
      </Section>

      {/* ── 당첨 기록 ────────────────────────────────── */}
      <Section title="당첨 기록 요약" icon={Trophy} accent="orange">
        {winStats.ranked.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-1">아직 당첨 기록이 없어요</p>
            <p className="text-gray-300 text-xs">역대 당첨 페이지에서 내 번호와 당첨 번호를 비교해 보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {winStats.rankCount.map((cnt, i) => (
                <div key={i} className={`border rounded-xl p-3 text-center ${rankBg[i]}`}>
                  <p className={`text-xs font-bold ${rankColors[i]}`}>{rankLabels[i]}</p>
                  <p className="text-xl font-black text-gray-800 mt-1">{cnt}</p>
                  <p className="text-xs text-gray-400">건</p>
                </div>
              ))}
            </div>
            {winStats.totalPrize > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                <p className="text-xs text-yellow-600">누적 당첨금</p>
                <p className="text-2xl font-black text-yellow-700">
                  {winStats.totalPrize.toLocaleString()}원
                </p>
              </div>
            )}
          </div>
        )}
      </Section>

      {/* ── 패턴 기반 추천 번호 ──────────────────────── */}
      <Section title="내 패턴 기반 추천 번호" icon={Sparkles} accent="purple">
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-700 leading-relaxed">
            <p className="font-bold mb-1">어떻게 추천하나요?</p>
            <p className="text-xs text-purple-600">
              내가 자주 생성한 번호에 가중치를 두어 {history.length}세트의 생성 패턴을 반영한 번호 조합을 만들어드려요.
              당첨을 보장하지 않으며, 재미 요소로만 활용해 주세요. 🎲
            </p>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            {recGenerated ? '추천 번호 다시 생성' : '추천 번호 5세트 생성'}
          </button>

          {recommends.length > 0 && (
            <div className="space-y-3 mt-2">
              {recommends.map((nums, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-400 font-bold w-4">{i + 1}</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {nums.map(n => <Ball key={n} n={n} size="md" />)}
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 text-center">※ 버튼을 누를 때마다 새로운 조합이 생성됩니다</p>
            </div>
          )}
        </div>
      </Section>

      {/* ── 전체 번호 생성/당첨 내역 ──────────────────────── */}
      <div className="mt-10 sm:mt-12 bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-2xl font-black text-gray-800 flex items-center gap-2 mb-6">
          <History className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          전체 생성/당첨 내역
          <span className="text-xs sm:text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full ml-auto">
            총 {history.length}건
          </span>
        </h3>
        {/* LottoHistory 내부 여백 등을 자연스럽게 보이도록 */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <LottoHistory
            history={history}
            onDelete={deleteEntry}
            onClearAll={clearHistory}
            onUpdate={updateEntry}
          />
        </div>
      </div>

    </div>
  );
}

