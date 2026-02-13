import { useEffect, useState, useMemo } from 'react';
import { Search, Trophy, Users, Banknote, TrendingUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { useLottoWinning, WinningDraw } from '../hooks/useLottoWinning';
import { getLottoNumberColor } from '../utils/lottoGenerator';
import { getCurrentLottoRound } from '../utils/lottoGenerator';

function NumberBall({
  num,
  size = 'md',
  bonus = false,
}: {
  num: number;
  size?: 'sm' | 'md' | 'lg';
  bonus?: boolean;
}) {
  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg',
  }[size];

  const bg = bonus
    ? 'bg-gradient-to-br from-gray-600 to-gray-800 ring-2 ring-gray-400'
    : getLottoNumberColor(num);

  return (
    <div
      className={`${sizeClass} ${bg} rounded-full text-white font-black flex items-center justify-center shadow-md select-none flex-shrink-0`}
    >
      {num}
    </div>
  );
}

function DrawCard({ draw, highlight = false }: { draw: WinningDraw; highlight?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 shadow-lg'
          : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
      }`}
    >
      {/* 카드 메인 행 */}
      <div className="p-3.5 sm:p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 회차 배지 */}
          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-black whitespace-nowrap ${
              highlight
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            }`}
          >
            {draw.drwNo}회
          </div>

          {/* 날짜 */}
          <span className="text-xs text-gray-400 font-medium">{draw.drwNoDate}</span>

          {/* 번호들 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {draw.numbers.map((n) => (
              <NumberBall key={n} num={n} size="sm" />
            ))}
            <span className="text-gray-300 font-bold text-sm">+</span>
            <NumberBall num={draw.bonusNo} size="sm" bonus />
          </div>

          {/* 1등 당첨자 & 금액 */}
          <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
              <Users className="w-3 h-3" />
              {draw.firstPrzwnerCo}명
            </span>
            <span className="text-xs font-black text-orange-600">
              {Math.round(draw.firstWinamnt / 100000000).toLocaleString()}억
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 확장 상세 정보 */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-0.5">1인당 당첨금</p>
              <p className="text-sm font-black text-amber-700">
                {draw.firstWinamnt.toLocaleString()}원
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-0.5">1등 당첨자</p>
              <p className="text-sm font-black text-emerald-700">{draw.firstPrzwnerCo}명</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-500 mb-0.5">총 판매금액</p>
              <p className="text-sm font-black text-blue-700">
                {Math.round(draw.totSellamnt / 100000000).toLocaleString()}억원
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 번호별 출현 빈도
function FrequencyHeatmap({ draws }: { draws: WinningDraw[] }) {
  const frequency = useMemo(() => {
    const freq: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) freq[i] = 0;
    draws.forEach((d) => {
      d.numbers.forEach((n) => (freq[n] = (freq[n] || 0) + 1));
    });
    return freq;
  }, [draws]);

  const top5 = useMemo(
    () =>
      Object.entries(frequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([n]) => Number(n)),
    [frequency]
  );

  const bottom5 = useMemo(
    () =>
      Object.entries(frequency)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 5)
        .map(([n]) => Number(n)),
    [frequency]
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">번호 출현 빈도</h3>
        <span className="text-xs text-gray-400 font-medium">최근 {draws.length}회차</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 rounded-xl p-3">
          <p className="text-xs font-bold text-amber-700 mb-2">🔥 자주 나온 번호 TOP 5</p>
          <div className="flex gap-1.5 flex-wrap">
            {top5.map((n) => (
              <NumberBall key={n} num={n} size="sm" />
            ))}
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs font-bold text-blue-700 mb-2">❄️ 적게 나온 번호 TOP 5</p>
          <div className="flex gap-1.5 flex-wrap">
            {bottom5.map((n) => (
              <NumberBall key={n} num={n} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 통계 요약 카드
function StatsSummary({ draws }: { draws: WinningDraw[] }) {
  const maxPrize = useMemo(
    () => draws.reduce((max, d) => Math.max(max, d.firstWinamnt), 0),
    [draws]
  );
  const maxPrizeDraw = useMemo(
    () => draws.find((d) => d.firstWinamnt === maxPrize),
    [draws, maxPrize]
  );
  const avgWinners = useMemo(
    () =>
      draws.length > 0
        ? Math.round(draws.reduce((s, d) => s + d.firstPrzwnerCo, 0) / draws.length)
        : 0,
    [draws]
  );
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
        <div className="text-2xl mb-1">🏆</div>
        <p className="text-xs text-gray-500 mb-1">최고 1등 당첨금</p>
        <p className="text-base font-black text-amber-600">
          {Math.round(maxPrize / 100000000).toLocaleString()}억
        </p>
        {maxPrizeDraw && (
          <p className="text-[10px] text-gray-400 mt-0.5">{maxPrizeDraw.drwNo}회</p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
        <div className="text-2xl mb-1">👤</div>
        <p className="text-xs text-gray-500 mb-1">평균 1등 당첨자</p>
        <p className="text-base font-black text-emerald-600">{avgWinners}명</p>
        <p className="text-[10px] text-gray-400 mt-0.5">최근 {draws.length}회</p>
      </div>
    </div>
  );
}

export function WinningHistory() {
  const {
    draws,
    latestDraw,
    searchDraw,
    loading,
    searchLoading,
    error,
    loadRecent,
    searchRound,
    clearSearch,
  } = useLottoWinning();

  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const currentRound = getCurrentLottoRound();
    loadRecent(currentRound, 20);
  }, [loadRecent]);

  const handleSearch = () => {
    const n = parseInt(searchInput.trim());
    if (!n || n < 1) return;
    searchRound(n);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const totalPages = Math.ceil(draws.length / PAGE_SIZE);
  const displayedDraws = draws.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* 헤더 타이틀 */}
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl sm:text-2xl font-black text-gray-800">역대 당첨 번호</h2>
      </div>

      {/* 로딩 / 에러 */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">당첨 정보를 불러오는 중...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* 최신 당첨 번호 히어로 */}
      {latestDraw && !loading && (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl shadow-xl p-5 sm:p-7">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-2">
                  최신 당첨 번호
                </span>
                <h3 className="text-white font-black text-2xl sm:text-3xl">
                  {latestDraw.drwNo}회
                </h3>
                <p className="text-white/70 text-sm">{latestDraw.drwNoDate} 추첨</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs mb-1">1등 당첨금</p>
                <p className="text-white font-black text-xl sm:text-2xl">
                  {Math.round(latestDraw.firstWinamnt / 100000000).toLocaleString()}억원
                </p>
                <p className="text-white/70 text-xs mt-1">
                  당첨자 {latestDraw.firstPrzwnerCo}명
                </p>
              </div>
            </div>

            {/* 번호 공 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {latestDraw.numbers.map((n) => (
                <div
                  key={n}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <span
                    className={`text-base sm:text-lg font-black ${
                      n <= 10
                        ? 'text-yellow-500'
                        : n <= 20
                        ? 'text-blue-500'
                        : n <= 30
                        ? 'text-red-500'
                        : n <= 40
                        ? 'text-gray-600'
                        : 'text-green-500'
                    }`}
                  >
                    {n}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-center text-white/70 font-bold text-lg">
                +
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 border-2 border-white/50 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-base sm:text-lg">
                  {latestDraw.bonusNo}
                </span>
              </div>
            </div>

            {/* 판매금액 */}
            <div className="mt-4 flex items-center gap-2 text-white/60 text-xs">
              <Banknote className="w-3.5 h-3.5" />
              <span>
                총 판매금액:{' '}
                <span className="text-white/90 font-semibold">
                  {Math.round(latestDraw.totSellamnt / 100000000).toLocaleString()}억원
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 회차 검색 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <h3 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-500" />
          회차 검색
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="조회할 회차를 입력하세요 (예: 1000)"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-md transition-all disabled:opacity-60 flex items-center gap-1.5"
          >
            {searchLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            검색
          </button>
        </div>

        {/* 검색 결과 */}
        {searchDraw && (
          <div className="mt-3 relative">
            <button
              onClick={clearSearch}
              className="absolute top-3 right-3 z-10 p-1 rounded-lg bg-white/80 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <DrawCard draw={searchDraw} highlight />
          </div>
        )}
      </div>

      {/* 통계 요약 */}
      {draws.length > 0 && !loading && <StatsSummary draws={draws} />}

      {/* 번호 출현 빈도 */}
      {draws.length > 0 && !loading && <FrequencyHeatmap draws={draws} />}

      {/* 당첨 기록 */}
      {draws.length > 0 && !loading && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-800 text-base sm:text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              당첨 기록
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                {draws.length}회
              </span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {displayedDraws.map((draw, i) => (
              <DrawCard key={draw.drwNo} draw={draw} highlight={page === 1 && i === 0} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-5">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push('...');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                        page === p
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 안내 문구 */}
      <div className="bg-blue-50 rounded-2xl p-4 text-center">
        <p className="text-xs text-blue-600 font-medium">
          당첨 정보는 동행복권 공식 데이터를 기반으로 합니다.
        </p>
        <p className="text-xs text-blue-400 mt-1">
          실제 당첨 여부는 반드시 공식 사이트에서 확인하세요.
        </p>
      </div>
    </div>
  );
}
