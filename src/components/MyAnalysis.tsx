import { useMemo } from 'react';
import { useLottoHistory } from '../hooks/useLottoHistory';
import { Sparkles, BarChart2, Trophy, AlertCircle, History } from 'lucide-react';
import { LottoHistory } from './LottoHistory';

// ── 섹션 카드 래퍼 ───────────────────────────────────────
function Section({ title, icon: Icon, children, accent = 'blue' }: {
  title: string; icon: React.ElementType; children: React.ReactNode; accent?: string;
}) {
  const accents: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-500',
    orange: 'from-orange-400 to-amber-500',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${accents[accent] || 'from-blue-500 to-indigo-500'} px-5 py-3 flex items-center gap-2`}>
        <Icon className="w-4 h-4 text-white" />
        <h2 className="text-white font-bold text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────
export function MyAnalysis() {
  let { history, deleteEntry, clearHistory, updateEntry } = useLottoHistory();

  // UI 확인을 위한 임시 목데이터 주입
  if (history.length === 0) {
      const now = Date.now();
      const d = new Date().toISOString();
      history = [
          { id: 'm1', numbers: [3, 14, 22, 28, 33, 41], timestamp: now - 100000, date: d, round: 1102 },
          { id: 'm2', numbers: [7, 12, 18, 25, 34, 45], timestamp: now - 200000, date: d, round: 1101 },
          { id: 'm3', numbers: [2, 15, 22, 38, 41, 44], timestamp: now - 300000, date: d, round: 1099, winningInfo: { rank: 1, matchCount: 6, prize: 2130000000, matchedNumbers: [2, 15, 22, 38, 41, 44] } },
          { id: 'm4', numbers: [11, 22, 33, 34, 35, 36], timestamp: now - 400000, date: d, round: 1100, winningInfo: { rank: 3, matchCount: 5, prize: 1540000, matchedNumbers: [11, 22, 33, 34, 35] } },
          { id: 'm5', numbers: [5, 10, 15, 20, 25, 30], timestamp: now - 500000, date: d, round: 1100 },
          { id: 'm6', numbers: [8, 16, 24, 32, 40, 42], timestamp: now - 600000, date: d, round: 1101, winningInfo: { rank: 5, matchCount: 3, prize: 5000, matchedNumbers: [8, 16, 24] } },
          { id: 'm7', numbers: [1, 2, 3, 4, 15, 22], timestamp: now - 700000, date: d, round: 1101 },
          { id: 'm8', numbers: [19, 21, 33, 38, 42, 45], timestamp: now - 800000, date: d, round: 1098 },
          { id: 'm9', numbers: [5, 6, 7, 18, 28, 38], timestamp: now - 900000, date: d, round: 1102 },
          { id: 'm10', numbers: [13, 23, 24, 35, 41, 43], timestamp: now - 1000000, date: d, round: 1102, winningInfo: { rank: 4, matchCount: 4, prize: 50000, matchedNumbers: [13, 23, 35, 43] } },
      ];
  }

  const hasData = history.length > 0;

  // 전체 번호 플랫 리스트
  const allNums = useMemo(() => history.flatMap(e => e.numbers), [history]);

  // 번호별 빈도 [num, count][] 내림차순
  const freq = useMemo<[number, number][]>(() => {
    const map = new Map<number, number>();
    for (const n of allNums) map.set(n, (map.get(n) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [allNums]);

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
          홈에서 로또 번호를 생성하면<br />여기서 패턴 분석과 당첨 내역을 확인할 수 있어요.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <AlertCircle className="w-4 h-4" />
          <span>번호를 생성하면 자동으로 등록됩니다</span>
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

      {/* ── 전체 생성/당첨 내역 ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-2xl font-black text-gray-800 flex items-center gap-2 mb-6">
          <History className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          전체 생성/당첨 내역
          <span className="text-xs sm:text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full ml-auto">
            총 {history.length}건
          </span>
        </h3>
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <LottoHistory
            history={history}
            onDelete={deleteEntry}
            onClearAll={clearHistory}
            onUpdate={updateEntry}
          />
        </div>
      </div>

      {/* ── 당첨 기록 요약 ────────────────────────────────── */}
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
    </div>
  );
}
