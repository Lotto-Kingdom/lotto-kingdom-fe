import { useState, useMemo } from 'react';
import {
  MapPin, Trophy, Store, ChevronLeft, ChevronRight, ChevronDown,
  X, Star, Award, TrendingUp, Zap, Hash,
} from 'lucide-react';
import {
  MOCK_STORES,
  MOCK_ROUNDS,
  getRegionStats,
  type WinningStore,
  type RoundStore,
} from '../hooks/useWinningRegion';

// ─────────────────────────────────────────────
// 지역 색상 팔레트
// ─────────────────────────────────────────────
const REGION_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  서울: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    badge: 'bg-red-500' },
  경기: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-500' },
  부산: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   badge: 'bg-blue-500' },
  대구: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-500' },
  인천: { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   badge: 'bg-cyan-500' },
  광주: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  badge: 'bg-green-500' },
  대전: { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   badge: 'bg-teal-500' },
  울산: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  badge: 'bg-amber-500' },
  세종: { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-200',   badge: 'bg-lime-500' },
  강원: { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',badge: 'bg-emerald-500' },
  충북: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-500' },
  충남: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-500' },
  전북: { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-200',   badge: 'bg-pink-500' },
  전남: { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   badge: 'bg-rose-500' },
  경북: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-500' },
  경남: { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    badge: 'bg-sky-500' },
  제주: { bg: 'bg-fuchsia-50',text: 'text-fuchsia-700',border: 'border-fuchsia-200',badge: 'bg-fuchsia-500' },
};

function regionColor(region: string) {
  return REGION_COLORS[region] ?? {
    bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-500',
  };
}

// ─────────────────────────────────────────────
// 지역 배지
// ─────────────────────────────────────────────
function RegionBadge({ region, small = false }: { region: string; small?: boolean }) {
  const c = regionColor(region);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold ${small ? 'text-[10px]' : 'text-xs'} ${c.bg} ${c.text} border ${c.border}`}>
      <MapPin className={small ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {region}
    </span>
  );
}

// ─────────────────────────────────────────────
// 지역별 현황 카드
// ─────────────────────────────────────────────
function RegionCard({
  stat,
  rank,
  maxCount,
  isSelected,
  onClick,
}: {
  stat: ReturnType<typeof getRegionStats>[number];
  rank: number;
  maxCount: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const c = regionColor(stat.name);
  const pct = Math.round((stat.rank1Count / maxCount) * 100);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
        isSelected
          ? `${c.bg} ${c.border} shadow-md`
          : 'bg-white border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2">
          {rank <= 3 ? (
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm ${
              rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
              rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
              'bg-gradient-to-br from-orange-400 to-amber-600'
            }`}>
              {rank}
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
              {rank}
            </div>
          )}
          <span className="font-black text-gray-800 text-base">{stat.name}</span>
        </div>
        <span className={`text-lg font-black ${c.text}`}>{stat.rank1Count}회</span>
      </div>

      {/* 진행 바 */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${c.badge}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>판매점 {stat.storeCount}곳</span>
        <span className={`font-semibold ${c.text} truncate max-w-[100px]`}>{stat.topStore}</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// 회차별 당첨가게 행
// ─────────────────────────────────────────────
function RoundRow({
  round,
  onStoreClick,
}: {
  round: RoundStore;
  onStoreClick: (storeId: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      {/* 회차 */}
      <div className="flex-shrink-0 w-14 text-center">
        <span className="inline-block px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-black rounded-xl">
          {round.drwNo}회
        </span>
      </div>

      {/* 날짜 */}
      <span className="text-xs text-gray-400 font-medium flex-shrink-0 hidden sm:block">
        {round.drwNoDate}
      </span>

      {/* 가게 정보 */}
      <button
        onClick={() => onStoreClick(round.storeId)}
        className="flex items-center gap-2 flex-1 min-w-0 group-hover:text-blue-600 transition-colors"
      >
        <Store className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-blue-500" />
        <span className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600">
          {round.storeName}
        </span>
        <RegionBadge region={round.region} small />
      </button>

      {/* 방식 */}
      <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
        round.method === 'auto'
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          : 'bg-purple-50 text-purple-600 border border-purple-200'
      }`}>
        {round.method === 'auto' ? '자동' : '수동'}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// 당첨가게 상세 모달
// ─────────────────────────────────────────────
function StoreDetailModal({
  store,
  onClose,
}: {
  store: WinningStore;
  onClose: () => void;
}) {
  const c = regionColor(store.region);
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    store.lng - 0.005
  }%2C${store.lat - 0.003}%2C${store.lng + 0.005}%2C${store.lat + 0.003}&layer=mapnik&marker=${store.lat}%2C${store.lng}`;

  const relatedRounds = MOCK_ROUNDS.filter((r) => r.storeId === store.id)
    .sort((a, b) => b.drwNo - a.drwNo);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className={`${c.bg} border-b ${c.border} p-5 flex-shrink-0`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${c.badge}`}>
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg leading-tight">{store.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{store.address}</p>
                <div className="mt-1.5">
                  <RegionBadge region={store.region} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/70 hover:bg-white transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* 지도 */}
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <iframe
              title="store-map"
              src={mapUrl}
              width="100%"
              height="100%"
              className="border-0"
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-gray-500 font-medium">
              © OpenStreetMap
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* 당첨 통계 */}
            <div>
              <h4 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                당첨 통계
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-3.5 text-center border border-amber-100">
                  <div className="flex items-center justify-center mb-1.5">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                      <Star className="w-3.5 h-3.5 text-white" fill="white" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-amber-700">{store.rank1Count}</p>
                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">1등 당첨</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3.5 text-center border border-blue-100">
                  <div className="flex items-center justify-center mb-1.5">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                      <Award className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-blue-700">{store.rank2Count}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5">2등 당첨</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-3.5 text-center border border-emerald-100">
                  <div className="flex items-center justify-center mb-1.5">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-emerald-700">{store.rank3Count}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">3등 당첨</p>
                </div>
              </div>
            </div>

            {/* 1등 당첨 회차 목록 */}
            {relatedRounds.length > 0 && (
              <div>
                <h4 className="font-black text-gray-800 text-sm mb-2.5 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-purple-500" />
                  1등 당첨 회차
                </h4>
                <div className="flex flex-wrap gap-2">
                  {relatedRounds.map((r) => (
                    <div key={r.drwNo} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm">
                      <span className="text-xs font-black text-gray-700">{r.drwNo}회</span>
                      <span className="text-[10px] text-gray-400">{r.drwNoDate}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        r.method === 'auto'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-purple-50 text-purple-600'
                      }`}>
                        {r.method === 'auto' ? '자동' : '수동'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
const PAGE_SIZE = 10;

export function WinningRegion() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<WinningStore | null>(null);
  const [page, setPage] = useState(1);
  const [regionExpanded, setRegionExpanded] = useState(false);

  const regionStats = useMemo(() => getRegionStats(), []);
  const maxCount = regionStats[0]?.rank1Count ?? 1;

  // 선택된 지역으로 필터된 회차 목록
  const filteredRounds = useMemo(() => {
    if (!selectedRegion) return MOCK_ROUNDS;
    return MOCK_ROUNDS.filter((r) => r.region === selectedRegion);
  }, [selectedRegion]);

  const totalPages = Math.ceil(filteredRounds.length / PAGE_SIZE);
  const displayedRounds = filteredRounds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRegionClick = (region: string) => {
    if (selectedRegion === region) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(region);
      setPage(1);
    }
  };

  const handleStoreClick = (storeId: string) => {
    const store = MOCK_STORES.find((s) => s.id === storeId);
    if (store) setSelectedStore(store);
  };

  // 총계 요약
  const totalRank1 = MOCK_STORES.reduce((s, st) => s + st.rank1Count, 0);
  const topStore = [...MOCK_STORES].sort((a, b) => b.rank1Count - a.rank1Count)[0];

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-2">
        <MapPin className="w-6 h-6 text-rose-500" />
        <h2 className="text-xl sm:text-2xl font-black text-gray-800">당첨 지역</h2>
      </div>

      {/* 히어로 요약 배너 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl shadow-xl p-5 sm:p-7">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3">
            전국 당첨 현황
          </span>
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div>
              <p className="text-white/70 text-xs mb-1">총 1등 당첨</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{totalRank1}회</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">당첨 지역</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{regionStats.length}개</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">등록 판매점</p>
              <p className="text-white font-black text-2xl sm:text-3xl">{MOCK_STORES.length}곳</p>
            </div>
          </div>
          {topStore && (
            <div className="mt-4 flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5 w-fit">
              <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <span className="text-white/80 text-xs">최다 배출점</span>
              <span className="text-white font-black text-sm">{topStore.name}</span>
              <span className="text-yellow-300 font-black text-sm">{topStore.rank1Count}회</span>
            </div>
          )}
        </div>
      </div>

      {/* 지역별 당첨 현황 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800 text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            지역별 1등 당첨 횟수
          </h3>
          {selectedRegion && (
            <button
              onClick={() => { setSelectedRegion(null); setPage(1); }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-xl"
            >
              <X className="w-3.5 h-3.5" />
              필터 해제
            </button>
          )}
        </div>

        {/* 모바일: 접기/펼치기 / 데스크톱: 항상 전체 표시 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {regionStats
            .slice(0, regionExpanded ? undefined : 4)
            .map((stat, idx) => (
              <RegionCard
                key={stat.name}
                stat={stat}
                rank={idx + 1}
                maxCount={maxCount}
                isSelected={selectedRegion === stat.name}
                onClick={() => handleRegionClick(stat.name)}
              />
            ))}
          {/* 데스크톱에서는 숨겨진 나머지도 항상 표시 */}
          {!regionExpanded &&
            regionStats.slice(4).map((stat, idx) => (
              <div key={stat.name} className="hidden sm:block">
                <RegionCard
                  stat={stat}
                  rank={idx + 5}
                  maxCount={maxCount}
                  isSelected={selectedRegion === stat.name}
                  onClick={() => handleRegionClick(stat.name)}
                />
              </div>
            ))}
        </div>

        {/* 모바일 전용 펼치기 버튼 */}
        {regionStats.length > 4 && (
          <button
            onClick={() => setRegionExpanded((v) => !v)}
            className="sm:hidden mt-3 w-full py-2.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-bold text-gray-600 flex items-center justify-center gap-1.5"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${regionExpanded ? 'rotate-180' : ''}`} />
            {regionExpanded
              ? '접기'
              : `${regionStats.length - 4}개 지역 더 보기`}
          </button>
        )}
      </div>

      {/* 회차별 당첨가게 목록 */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-gray-800 text-base sm:text-lg flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-500" />
            회차별 당첨 판매점
            {selectedRegion ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-xs font-bold text-gray-700 border border-gray-200 shadow-sm">
                <MapPin className="w-3 h-3" />
                {selectedRegion} 필터
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                {filteredRounds.length}건
              </span>
            )}
          </h3>
        </div>

        {/* 가로 스크롤 지역 필터 칩 (모바일 전용) */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3 sm:hidden no-scrollbar">
          <button
            onClick={() => { setSelectedRegion(null); setPage(1); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRegion === null
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            전체
          </button>
          {regionStats.map((stat) => {
            const c = regionColor(stat.name);
            const active = selectedRegion === stat.name;
            return (
              <button
                key={stat.name}
                onClick={() => handleRegionClick(stat.name)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? `${c.badge} text-white shadow-sm`
                    : `${c.bg} ${c.text} border ${c.border}`
                }`}
              >
                {stat.name}
                <span className={`text-[10px] font-black ${active ? 'text-white/80' : ''}`}>
                  {stat.rank1Count}
                </span>
              </button>
            );
          })}
        </div>

        {displayedRounds.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">해당 지역의 당첨 이력이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedRounds.map((round) => (
              <RoundRow key={round.drwNo} round={round} onStoreClick={handleStoreClick} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
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
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 안내 */}
      <div className="bg-teal-50 rounded-2xl p-4 text-center">
        <p className="text-xs text-teal-600 font-medium">
          판매점 클릭 시 상세 정보(지도, 당첨 통계)를 확인할 수 있습니다.
        </p>
        <p className="text-xs text-teal-400 mt-1">
          본 데이터는 참고용이며 실제 현황과 다를 수 있습니다.
        </p>
      </div>

      {/* 당첨가게 상세 모달 */}
      {selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </div>
  );
}
