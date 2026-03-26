import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}
import {
  MapPin, Trophy, Store, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  X, Star, Award, TrendingUp, Zap, Hash, Crown, Copy, Check, Search, Filter, Loader2
} from 'lucide-react';
import {
  useWinningStoreSummary,
  useWinningStoreRanking,
  useWinningStoreRounds,
  useWinningStoreDetail,
  type WinningStoreRanking,
  type RoundStore,
} from '../hooks/useWinningRegion';
import { getLastDrawnLottoRound } from '../utils/lottoGenerator';

// ─────────────────────────────────────────────
// 지역 색상 팔레트
// ─────────────────────────────────────────────
const REGION_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  서울: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     badge: 'bg-red-500'     },
  경기: { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  badge: 'bg-orange-500'  },
  부산: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    badge: 'bg-blue-500'    },
  대구: { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  badge: 'bg-purple-500'  },
  인천: { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200',    badge: 'bg-cyan-500'    },
  광주: { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200',   badge: 'bg-green-500'   },
  대전: { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    badge: 'bg-teal-500'    },
  울산: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   badge: 'bg-amber-500'   },
  세종: { bg: 'bg-lime-50',    text: 'text-lime-700',    border: 'border-lime-200',    badge: 'bg-lime-500'    },
  강원: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-500' },
  충북: { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200',  badge: 'bg-yellow-500'  },
  충남: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  badge: 'bg-indigo-500'  },
  전북: { bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200',    badge: 'bg-pink-500'    },
  전남: { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    badge: 'bg-rose-500'    },
  경북: { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  badge: 'bg-violet-500'  },
  경남: { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     badge: 'bg-sky-500'     },
  제주: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200', badge: 'bg-fuchsia-500' },
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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold flex-shrink-0 whitespace-nowrap ${small ? 'text-[10px]' : 'text-xs'} ${c.bg} ${c.text} border ${c.border}`}>
      <MapPin className={small ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {region}
    </span>
  );
}

// ─────────────────────────────────────────────
// TOP 판매점 카드
// ─────────────────────────────────────────────
function TopStoreCard({
  store,
  rank,
  maxCount,
  onClick,
}: {
  store: WinningStoreRanking;
  rank: number;
  maxCount: number;
  onClick: () => void;
}) {
  const c = regionColor(store.region);
  const pct = Math.round((store.rank1Count / Math.max(maxCount, 1)) * 100);

  const medalBg =
    rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-200' :
    rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-200' :
    rank === 3 ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-200' :
    'bg-gradient-to-br from-gray-200 to-gray-300 shadow-gray-100';

  const medalText = rank <= 3 ? 'text-white' : 'text-gray-500';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] bg-white ${
        rank === 1 ? 'border-amber-200 shadow-md' : 'border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0 ${medalBg} ${medalText}`}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5 mb-0.5">
            <span className="font-black text-gray-900 text-[13px] sm:text-sm leading-snug break-keep line-clamp-2">{store.storeName}</span>
            <div className="flex-shrink-0 mt-0.5">
              <RegionBadge region={store.region} small />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 truncate">{store.district}</p>

          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  rank === 1 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                  rank === 2 ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
                  rank === 3 ? 'bg-gradient-to-r from-orange-400 to-amber-400' :
                  c.badge
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <p className={`text-xl font-black ${rank === 1 ? 'text-amber-500' : 'text-gray-800'}`}>
            {store.rank1Count}
          </p>
          <p className="text-[10px] text-gray-400 whitespace-nowrap">1등</p>
        </div>
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
      <div className="flex-shrink-0 w-14 text-center">
        <span className="inline-block px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-black rounded-xl">
          {round.drwNo}회
        </span>
      </div>
      <span className="text-xs text-gray-400 font-medium flex-shrink-0 hidden sm:block">
        {round.drwNoDate}
      </span>
      <button
        onClick={() => onStoreClick(round.storeId)}
        className="flex items-start sm:items-center gap-1.5 sm:gap-2 flex-1 min-w-0 group-hover:text-blue-600 transition-colors text-left"
      >
        <Store className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0 group-hover:text-blue-500" />
        <span className="font-bold text-gray-800 text-[13px] sm:text-sm leading-snug break-keep line-clamp-2 sm:truncate group-hover:text-blue-600">
          {round.storeName}
        </span>
        <div className="flex-shrink-0 mt-0.5 sm:mt-0 flex items-center gap-1.5">
          <RegionBadge region={round.region} small />
          <span className={`whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            round.method === 'auto'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-purple-50 text-purple-600 border border-purple-200'
          }`}>
            {round.method === 'auto' ? '자동' : '수동'}
          </span>
        </div>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 당첨가게 상세 모달
// ─────────────────────────────────────────────
function StoreDetailModal({
  storeId,
  onClose,
}: {
  storeId: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { data: store, loading, error, fetchDetail } = useWinningStoreDetail();
  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
     const checkKakao = () => {
         if (window.kakao && window.kakao.maps) {
             setKakaoReady(true);
             return true;
         }
         return false;
     };

     if (!checkKakao()) {
         const interval = setInterval(() => {
             if (checkKakao()) clearInterval(interval);
         }, 100);
         return () => clearInterval(interval);
     }
  }, []);

  useEffect(() => {
    fetchDetail(storeId);
  }, [storeId, fetchDetail]);

  useEffect(() => {
    if (store && mapRef.current && kakaoReady) {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }
        const position = new window.kakao.maps.LatLng(store.latitude, store.longitude);
        const options = {
          center: position,
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapRef.current, options);
        
        const marker = new window.kakao.maps.Marker({
          position,
        });
        marker.setMap(map);
      });
    }
  }, [store, kakaoReady]);

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
            <p className="text-gray-500 font-medium">판매점 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="p-10 flex flex-col items-center justify-center">
            <X className="w-10 h-10 text-red-400 mb-3" />
            <p className="text-gray-600 font-medium">{error}</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-100 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition">닫기</button>
          </div>
        ) : store ? (
          <>
            {/* 모달 헤더 */}
            <div className={`${regionColor(store.region).bg} border-b ${regionColor(store.region).border} p-5 flex-shrink-0`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${regionColor(store.region).badge}`}>
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{store.storeName}</h3>
                    <button
                      onClick={() => handleCopyAddress(store.address)}
                      className="flex items-center gap-1.5 mt-0.5 group text-left"
                    >
                      <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                        {store.address}
                      </p>
                      <span className={`flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-all ${
                        copied
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                      }`}>
                        {copied
                          ? <><Check className="w-3 h-3" />복사됨</>
                          : <><Copy className="w-3 h-3" />복사</>
                        }
                      </span>
                    </button>
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
              <div ref={mapRef} className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden w-full">
                {!window.kakao && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 font-medium text-sm">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    지도 로딩 중...
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* 당첨 통계 */}
                <div>
                  <h4 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    당첨 통계
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-3.5 text-center border border-amber-100">
                      <div className="flex items-center justify-center mb-1.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                          <Star className="w-3.5 h-3.5 text-white" fill="white" />
                        </div>
                      </div>
                      <p className="text-2xl font-black text-amber-700">{store.rank1Count}</p>
                      <p className="text-[10px] text-amber-600 font-semibold mt-0.5 whitespace-nowrap">1등 당첨</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3.5 text-center border border-blue-100">
                      <div className="flex items-center justify-center mb-1.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                          <Award className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl font-black text-blue-700">{store.rank2Count}</p>
                      <p className="text-[10px] text-blue-600 font-semibold mt-0.5 whitespace-nowrap">2등 당첨</p>
                    </div>
                  </div>
                </div>

                {/* 1등 당첨 회차 */}
                {store.winRounds && store.winRounds.length > 0 && (
                  <div>
                    <h4 className="font-black text-gray-800 text-sm mb-2.5 flex items-center gap-1.5">
                      <Hash className="w-4 h-4 text-purple-500" />
                      1등 당첨 회차
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {store.winRounds.map((r) => (
                        <div key={r.drwNo} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-2 sm:px-3 py-1.5 shadow-sm">
                          <span className="text-xs font-black text-gray-700 whitespace-nowrap">{r.drwNo}회</span>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">{r.drwNoDate}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 flex-shrink-0 rounded-full whitespace-nowrap ${
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
          </>
        ) : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
const PAGE_SIZE = 10;
const TOP_N = 5;

export function WinningRegion() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showAllTop, setShowAllTop] = useState(false);
  const [regionExpanded, setRegionExpanded] = useState(false);
  const [roundSearchInput, setRoundSearchInput] = useState('');
  const [searchedRound, setSearchedRound] = useState<number | null>(null);
  const [isRoundFilterExpanded, setIsRoundFilterExpanded] = useState(false);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const getPageRange = (current: number, total: number, showCount: number) => {
    let start = Math.max(1, current - Math.floor(showCount / 2));
    let end = start + showCount - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - showCount + 1);
    }
    return Array.from({ length: Math.max(1, end - start + 1) }, (_, i) => start + i);
  };

  // APIs
  const { data: summary, loading: summaryLoading, fetchSummary } = useWinningStoreSummary();
  const { data: rankingData, loading: rankingLoading, fetchRanking } = useWinningStoreRanking();
  const { data: roundsData, loading: roundsLoading, fetchRounds } = useWinningStoreRounds();

  useEffect(() => {
    fetchSummary(selectedCount);
  }, [fetchSummary, selectedCount]);

  useEffect(() => {
    fetchRanking(showAllTop ? 10 : TOP_N, selectedCount);
  }, [fetchRanking, showAllTop, selectedCount]);

  useEffect(() => {
    // API page is 0-indexed
    fetchRounds(page - 1, PAGE_SIZE, selectedRegion, searchedRound, selectedCount);
  }, [fetchRounds, page, selectedRegion, searchedRound, selectedCount]);

  const handleRegionClick = (region: string) => {
    if (selectedRegion === region) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(region);
      setPage(1);
    }
  };

  const handleRoundSearch = () => {
    const n = parseInt(roundSearchInput.trim());
    if (!n || n < 1) return;
    setSearchedRound(n);
    setPage(1);
  };

  const handleRoundSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRoundSearch();
  };

  const handleClearRoundSearch = () => {
    setSearchedRound(null);
    setRoundSearchInput('');
    setPage(1);
  };

  const handleStoreClick = (storeId: string) => {
    setSelectedStoreId(storeId);
  };

  const maxRegionCount = summary?.regionStats?.[0]?.rank1Count ?? 1;
  const displayedTopStores = rankingData?.content ?? [];
  const maxStoreCount = displayedTopStores[0]?.rank1Count ?? 1;

  const totalPages = roundsData?.totalPages ?? 1;
  const displayedRounds = roundsData?.content ?? [];

  return (
    <div className="w-full space-y-4 sm:space-y-6 relative">
      {/* 글로벌 로딩 표시 - 처음 진입시에만 살짝 보여줌 */}
      {(summaryLoading && !summary && !rankingData && !roundsData) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center min-h-[500px] rounded-3xl pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
            <p className="text-gray-500 font-bold">데이터를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* ① 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-teal-500" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-800">당첨 지역</h2>
        </div>
        <select
          value={selectedCount}
          onChange={(e) => setSelectedCount(Number(e.target.value))}
          className="text-xs sm:text-sm font-bold border-gray-200 text-teal-700 bg-teal-50/50 rounded-xl px-3 py-1.5 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
        >
          <option value={20}>최근 20회차</option>
          <option value={50}>최근 50회차</option>
          <option value={100}>최근 100회차</option>
          <option value={0}>역대 전체 (누적)</option>
        </select>
      </div>

      {/* ② 히어로 배너 */}
      {summary && (
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl shadow-xl p-5 sm:p-7">
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3">
              전국 당첨 현황 {selectedCount === 0 ? '· 전체 (누적)' : `· 최근 ${selectedCount}회차`}
            </span>
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div>
                <p className="text-white/70 text-xs mb-1">총 1등 당첨</p>
                <p className="text-white font-black text-2xl sm:text-3xl">{summary.totalRank1Wins}회</p>
              </div>
              <div>
                <p className="text-white/70 text-xs mb-1">당첨 지역</p>
                <p className="text-white font-black text-2xl sm:text-3xl">{summary.totalWinningRegions}개</p>
              </div>
              <div>
                <p className="text-white/70 text-xs mb-1">등록 판매점</p>
                <p className="text-white font-black text-2xl sm:text-3xl">{summary.totalRegisteredStores}곳</p>
              </div>
            </div>
            {summary.bestStore && (
              <div className="mt-4 flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5 w-fit">
                <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <span className="text-white/80 text-xs">최다 배출점</span>
                <span className="text-white font-black text-sm">{summary.bestStore.storeName}</span>
                <span className="text-yellow-300 font-black text-sm">{summary.bestStore.rank1Count}회</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ③ 최다 1등 당첨 판매점 TOP N */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 relative">
        {rankingLoading && !rankingData && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800 text-base sm:text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            최다 1등 당첨 판매점
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
              TOP {showAllTop ? 10 : TOP_N}
            </span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {displayedTopStores.map((store, idx) => (
            <TopStoreCard
              key={store.storeId}
              store={store}
              rank={idx + 1}
              maxCount={maxStoreCount}
              onClick={() => handleStoreClick(store.storeId)}
            />
          ))}
        </div>

        {rankingData && rankingData.totalElements > TOP_N && (
          <button
            onClick={() => setShowAllTop((v) => !v)}
            className="mt-3 w-full py-2.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-bold text-gray-600 flex items-center justify-center gap-1.5"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllTop ? 'rotate-180' : ''}`} />
            {showAllTop ? 'TOP 5만 보기' : `TOP 10 전체 보기`}
          </button>
        )}
      </div>

      {/* ④ 지역별 현황 */}
      {summary && summary.regionStats && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
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

          <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden no-scrollbar">
            <button
              onClick={() => { setSelectedRegion(null); setPage(1); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRegion === null
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              전체
            </button>
            {summary.regionStats.map((stat) => {
              const c = regionColor(stat.name);
              const active = selectedRegion === stat.name;
              return (
                <button
                  key={stat.name}
                  onClick={() => handleRegionClick(stat.name)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active ? `${c.badge} text-white shadow-sm` : `${c.bg} ${c.text} border ${c.border}`
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

          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {summary.regionStats
              .slice(0, regionExpanded ? undefined : 6)
              .map((stat, idx) => {
                const c = regionColor(stat.name);
                const pct = Math.round((stat.rank1Count / maxRegionCount) * 100);
                const isSelected = selectedRegion === stat.name;
                return (
                  <button
                    key={stat.name}
                    onClick={() => handleRegionClick(stat.name)}
                    className={`w-full text-left rounded-2xl border-2 p-3.5 transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
                      isSelected ? `${c.bg} ${c.border} shadow-md` : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-sm ${
                          idx === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                          idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          idx === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-600' :
                          'bg-gray-200 !text-gray-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="font-black text-gray-800 text-sm">{stat.name}</span>
                      </div>
                      <span className={`text-base font-black ${c.text}`}>{stat.rank1Count}회</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <div className={`h-full rounded-full ${c.badge}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>판매점 {stat.storeCount}곳</span>
                      <span className={`font-semibold ${c.text} truncate max-w-[90px]`}>{stat.topStore}</span>
                    </div>
                  </button>
                );
              })}
          </div>
          {summary.regionStats.length > 6 && (
            <button
              onClick={() => setRegionExpanded((v) => !v)}
              className="hidden sm:flex mt-3 w-full py-2.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-bold text-gray-600 items-center justify-center gap-1.5"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${regionExpanded ? 'rotate-180' : ''}`} />
              {regionExpanded ? '접기' : `${summary.regionStats.length - 6}개 지역 더 보기`}
            </button>
          )}
        </div>
      )}

      {/* ⑤ 회차별 당첨 판매점 목록 */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-4 sm:p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800 text-base sm:text-lg flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-500" />
            회차별 당첨 판매점
            {searchedRound && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-xs font-bold text-purple-700 border border-purple-200 shadow-sm">
                {searchedRound}회
              </span>
            )}
            {selectedRegion && !searchedRound && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-xs font-bold text-gray-700 border border-gray-200 shadow-sm">
                <MapPin className="w-3 h-3" />
                {selectedRegion} 필터
              </span>
            )}
          </h3>
          {(selectedRegion || searchedRound) && (
            <button
              onClick={() => { setSelectedRegion(null); setSearchedRound(null); setRoundSearchInput(''); setPage(1); }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-100 transition-colors px-3 py-1.5 rounded-xl border border-gray-200"
            >
              <X className="w-3.5 h-3.5" />
              초기화
            </button>
          )}
        </div>

        {/* 회차 검색 필터 */}
        <div className="mb-4">
          <button
            onClick={() => setIsRoundFilterExpanded(!isRoundFilterExpanded)}
            className="lg:hidden w-full flex items-center justify-between p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors touch-manipulation mb-2"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                회차 검색
                {searchedRound && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {searchedRound}회
                  </span>
                )}
              </span>
            </div>
            {isRoundFilterExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">회차 검색</label>
          </div>

          <div className={`space-y-2 ${isRoundFilterExpanded ? 'block' : 'hidden'} lg:block`}>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                value={roundSearchInput}
                onChange={(e) => setRoundSearchInput(e.target.value)}
                onKeyDown={handleRoundSearchKeyDown}
                placeholder={`조회할 회차를 입력하세요 (예: ${getLastDrawnLottoRound()})`}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
              />
              <button
                onClick={handleRoundSearch}
                className="px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-sm font-bold hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                검색
              </button>
              {searchedRound !== null && (
                <button
                  onClick={handleClearRoundSearch}
                  className="px-3 py-2 sm:py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  전체
                </button>
              )}
            </div>
          </div>
        </div>

        {summary && (
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
            {summary.regionStats.map((stat) => {
              const c = regionColor(stat.name);
              const active = selectedRegion === stat.name;
              return (
                <button
                  key={stat.name}
                  onClick={() => handleRegionClick(stat.name)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active ? `${c.badge} text-white shadow-sm` : `${c.bg} ${c.text} border ${c.border}`
                  }`}
                >
                  {stat.name}
                </button>
              );
            })}
          </div>
        )}

        {roundsLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
            <p className="text-gray-500 font-medium">로딩 중...</p>
          </div>
        ) : displayedRounds.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              {searchedRound ? `${searchedRound}회차의 당첨 판매점이 없습니다.` : '해당 조건의 당첨 이력이 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedRounds.map((round, idx) => (
              <RoundRow key={`${round.drwNo}-${round.storeId}-${idx}`} round={round} onStoreClick={handleStoreClick} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {!roundsLoading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 mt-5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
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
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
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
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ⑥ 안내 */}
      <div className="bg-teal-50 rounded-2xl p-4 text-center">
        <p className="text-xs text-teal-600 font-medium">
          판매점 클릭 시 상세 정보(지도, 당첨 통계)를 확인할 수 있습니다.
        </p>
        <p className="text-xs text-teal-400 mt-1">
          본 데이터는 동행복권 제공 정보를 기준으로 합니다.
        </p>
      </div>

      {/* 상세 모달 */}
      {selectedStoreId && (
        <StoreDetailModal
          storeId={selectedStoreId}
          onClose={() => setSelectedStoreId(null)}
        />
      )}
    </div>
  );
}
