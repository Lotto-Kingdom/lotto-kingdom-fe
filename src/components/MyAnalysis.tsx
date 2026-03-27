import { useMyNumbers } from '../hooks/useMyNumbers';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Trophy, History, Loader2, ArrowDownCircle } from 'lucide-react';
import { LottoHistory } from './LottoHistory';
import { SEO } from './SEO';

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
  const { user } = useAuth();
  const {
    summary,
    content: history,
    loading,
    summaryLoading,
    totalElements,
    hasMore,
    togglePurchase,
    deleteEntry,
    clearAll,
    loadMore
  } = useMyNumbers();

  const isInitialLoading = summaryLoading && !summary;
  const hasData = (history.length > 0 || !!summary) && !!user;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4 animate-fade-in text-gray-800">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black mb-3">로그인이 필요합니다</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          내 번호 분석 기능은 로그인 후에 이용할 수 있습니다.<br />
          저장된 모든 번호를 안전하게 관리해 드릴게요!
        </p>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">내 번호를 분석하는 중...</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4 animate-fade-in text-gray-800">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <History className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-2xl font-black mb-3">아직 저장된 번호가 없어요</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          번호 생성기에서 로또 번호를 생성하면<br />여기서 패턴 분석과 당첨 내역을 한눈에 확인할 수 있어요.
        </p>
      </div>
    );
  }

  const rankLabels = ['1등', '2등', '3등', '4등', '5등'];
  const rankColors = ['text-yellow-600', 'text-gray-500', 'text-amber-700', 'text-blue-500', 'text-gray-500'];
  const rankBg = ['bg-yellow-50 border-yellow-200', 'bg-gray-50 border-gray-200', 'bg-amber-50 border-amber-200', 'bg-blue-50 border-blue-200', 'bg-gray-50 border-gray-200'];

  return (
    <>
      <SEO title="내 로또 번호 분석 및 당첨 확인 - 로또나라" description="저장된 로또 번호의 당첨 여부를 확인하고 나만의 패턴을 분석해보세요." />
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* ── 히어로 요약 ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h1 className="text-lg font-black">내 번호 분석 요약</h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '총 저장 세트', value: `${summary?.totalSets || 0}세트` },
              { label: '총 번호 개수', value: `${summary?.totalNumbers || 0}개` },
              { label: '많이 골른 번호', value: summary?.mostFrequentNumber ? `${summary.mostFrequentNumber.number}번 (${summary.mostFrequentNumber.count}회)` : '-' },
              { label: '누적 당첨금', value: summary?.winningSummary ? `${(summary.winningSummary.totalPrize / 10000).toFixed(1)}만원` : '0원' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <p className="text-white/70 text-[10px] sm:text-xs mb-1 font-bold">{label}</p>
                <p className="text-white font-black text-base sm:text-lg leading-none">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 전체 생성/당첨 내역 ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-2xl font-black text-gray-800 flex items-center gap-2">
                <History className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                나의 로또 히스토리
            </h3>
            <span className="text-xs sm:text-sm font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                총 {totalElements}건
            </span>
        </div>
        
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <LottoHistory
            history={history}
            onDelete={deleteEntry}
            onClearAll={clearAll}
            onUpdate={togglePurchase}
          />
        </div>

        {hasMore && (
            <div className="mt-8 text-center px-4">
                <button 
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-bold transition-all border border-gray-100 active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <ArrowDownCircle className="w-5 h-5" />
                            <span>번호 더 보기</span>
                        </>
                    )}
                </button>
            </div>
        )}
      </div>

      {/* ── 당첨 기록 요약 ────────────────────────────────── */}
      <Section title="실제 당첨 기록 (1~5등 합계)" icon={Trophy} accent="orange">
        {(!summary || summary.winningSummary.totalWinningSets === 0) ? (
          <div className="text-center py-10 bg-orange-50/50 rounded-xl border border-dashed border-orange-200">
            <p className="text-orange-900/50 text-sm font-bold mb-1">아직 당첨 기록이 보이지 않네요</p>
            <p className="text-orange-900/30 text-xs">매주 토요일 추첨 결과가 자동으로 반영됩니다 🍀</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
              {Object.entries(summary.winningSummary.rankCounts).map(([rankKey, cnt], i) => (
                <div key={rankKey} className={`border rounded-2xl p-3 sm:p-4 text-center transition-all hover:shadow-md ${rankBg[i]}`}>
                  <p className={`text-[10px] sm:text-xs font-black mb-1 ${rankColors[i]}`}>{rankLabels[i]}</p>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <p className="text-xl sm:text-2xl font-black text-gray-800">{cnt}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold">건</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                    <p className="text-[11px] text-blue-500 font-black mb-1 uppercase tracking-wider">총 당첨 건수</p>
                    <p className="text-2xl font-black text-blue-700">
                        {summary.winningSummary.totalWinningSets}건
                    </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
                    <p className="text-[11px] text-yellow-600 font-black mb-1 uppercase tracking-wider">누적 당첨금</p>
                    <p className="text-2xl font-black text-yellow-700">
                        {summary.winningSummary.totalPrize.toLocaleString()}원
                    </p>
                </div>
            </div>
          </div>
        )}
      </Section>
    </div>
    </>
  );
}
