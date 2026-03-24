import { useEffect, useState } from 'react';
import { Search, Trophy, Users, Banknote, TrendingUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, Filter } from 'lucide-react';
import { useLottoWinning, WinningDraw } from '../hooks/useLottoWinning';
import { useLottoFullStatistics, NumberFrequency } from '../hooks/useLottoFullStatistics';
import { getLottoNumberColor, getLastDrawnLottoRound } from '../utils/lottoGenerator';

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
              1등 {draw.firstPrzwnerCo}명
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
function FrequencyHeatmap({ hot, cold, analysisCount }: { hot: NumberFrequency[]; cold: NumberFrequency[]; analysisCount: number }) {
  // 상위/하위 5개 가져오기
  const top5 = hot.slice(0, 5).map(h => h.number);
  const bottom5 = cold.slice(0, 5).map(c => c.number);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="font-black text-gray-800 text-base sm:text-lg">번호 출현 빈도</h3>
        <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full mt-0.5">
          {analysisCount === 0 ? '전체 (누적)' : `최근 ${analysisCount}회차`} 통계
        </span>
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


export function WinningHistory() {
  const {
    draws,
    latestDraw,
    searchDraw,
    loading,
    searchLoading,
    error,
    totalPages: apiTotalPages,
    loadRecent,
    searchRound,
    clearSearch,
  } = useLottoWinning();

  const { data: statsData, loadStatistics: loadStats } = useLottoFullStatistics();

  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const getPageRange = (current: number, total: number, showCount: number) => {
    let start = Math.max(1, current - Math.floor(showCount / 2));
    let end = start + showCount - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - showCount + 1);
    }
    return Array.from({ length: Math.max(1, end - start + 1) }, (_, i) => start + i);
  };

  // 백엔드의 페이지는 0-indexed이므로 -1 해서 전달
  useEffect(() => {
    if (!searchDraw) {
      loadRecent(page - 1);
    }
  }, [loadRecent, page, searchDraw]);

  useEffect(() => {
    loadStats(20);
  }, [loadStats]);

  const handleSearch = () => {
    const n = parseInt(searchInput.trim());
    if (!n || n < 1) return;
    searchRound(n);
  };

  const handleClearSearch = () => {
    clearSearch();
    setSearchInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const totalPages = apiTotalPages;
  const displayedDraws = draws;

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
                  1등 당첨자 {latestDraw.firstPrzwnerCo}명
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

      {/* 번호 출현 빈도 */}
      {statsData ? (
        <FrequencyHeatmap hot={statsData.hotNumbers} cold={statsData.coldNumbers} analysisCount={statsData.analysisCount} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-xs font-medium">통계 데이터를 불러오는 중...</p>
        </div>
      )}

      {/* 당첨 기록 + 회차 검색 통합 */}
      {draws.length > 0 && !loading && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-4 sm:p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-800 text-base sm:text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              당첨 기록
            </h3>
          </div>

          {/* 회차 검색 필터 */}
          <div className="mb-4">
            {/* 모바일: 토글 헤더 */}
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="lg:hidden w-full flex items-center justify-between p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors touch-manipulation mb-2"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  회차 검색
                  {searchDraw && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      {searchDraw.drwNo}회
                    </span>
                  )}
                </span>
              </div>
              {isFilterExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* 데스크톱: 항상 표시 */}
            <div className="hidden lg:flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">회차 검색</label>
            </div>

            {/* 검색 입력 - 모바일: 접을 수 있음, 데스크톱: 항상 표시 */}
            <div className={`space-y-2 ${isFilterExpanded ? 'block' : 'hidden'} lg:block`}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`조회할 회차를 입력하세요 (예: ${getLastDrawnLottoRound()})`}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:shadow-md transition-all disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap"
                >
                  {searchLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  검색
                </button>
                {searchDraw && (
                  <button
                    onClick={handleClearSearch}
                    className="px-3 py-2 sm:py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    전체
                  </button>
                )}
              </div>

              {/* 검색 결과 상태 표시 */}
              {searchDraw && (
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">검색 결과:</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-semibold">
                    제 {searchDraw.drwNo}회 ({searchDraw.drwNoDate})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 검색 결과 또는 페이지네이션 목록 */}
          {searchDraw ? (
            <div className="space-y-2.5">
              <DrawCard draw={searchDraw} highlight />
            </div>
          ) : (
            <>
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
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* 모바일 뷰 (5개) */}
                  <div className="flex sm:hidden items-center gap-1">
                    {getPageRange(page, totalPages, 5).map((p) => (
                      <button
                        key={`m-${p}`}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          page === p
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* 데스크톱 뷰 (10개) */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {getPageRange(page, totalPages, 10).map((p) => (
                      <button
                        key={`d-${p}`}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                          page === p
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
            </>
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
