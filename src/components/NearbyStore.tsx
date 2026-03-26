import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin, Trophy, X, Store as StoreIcon, Check, Copy, Star, Award, TrendingUp, Hash, Loader2, Navigation, RefreshCw } from 'lucide-react';
import { Store } from '../utils/lottoData';
import { useNearbyStores } from '../hooks/useNearbyStore';
import { useWinningStoreDetail } from '../hooks/useWinningRegion';

declare global {
  interface Window {
    kakao: any;
  }
}

// ─────────────────────────────────────────────
// 지역 색상 팔레트
// ─────────────────────────────────────────────
const REGION_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    서울: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-500' },
    경기: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-500' },
    부산: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-500' },
    대구: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-500' },
    인천: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', badge: 'bg-cyan-500' },
    광주: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-500' },
    대전: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badge: 'bg-teal-500' },
    울산: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500' },
    세종: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', badge: 'bg-lime-500' },
    강원: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-500' },
    충북: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-500' },
    충남: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-500' },
    전북: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', badge: 'bg-pink-500' },
    전남: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-500' },
    경북: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-500' },
    경남: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', badge: 'bg-sky-500' },
    제주: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200', badge: 'bg-fuchsia-500' },
};

function regionColor(region: string) {
    return REGION_COLORS[region] ?? {
        bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-500',
    };
}

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
// 상점 상세 모달
// ─────────────────────────────────────────────
function NearbyStoreDetailModal({
    store,
    onClose,
}: {
    store: Store;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);
    const region = store.address.split(' ')[0] || '서울';
    const c = regionColor(region);

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(store.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const el = document.createElement('textarea');
            el.value = store.address;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const mapRef = useRef<HTMLDivElement>(null);
    const { data: storeDetail, fetchDetail, loading } = useWinningStoreDetail();

    useEffect(() => {
        if (store.id) {
            fetchDetail(store.id);
        }
    }, [store.id, fetchDetail]);

    const relatedRounds = storeDetail?.winRounds || [];

    useEffect(() => {
        if (mapRef.current && window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                if (mapRef.current) {
                    mapRef.current.innerHTML = '';
                }
                const position = new window.kakao.maps.LatLng(store.lat, store.lng);
                const options = { center: position, level: 3 };
                const map = new window.kakao.maps.Map(mapRef.current, options);
                const marker = new window.kakao.maps.Marker({ position });
                marker.setMap(map);
            });
        }
    }, [store.lat, store.lng]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col animate-slide-up sm:animate-pop">
                {/* 모달 헤더 */}
                <div className={`${c.bg} border-b ${c.border} p-5 flex-shrink-0`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${c.badge}`}>
                                <StoreIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 text-lg leading-tight">{store.name}</h3>
                                <button
                                    onClick={handleCopyAddress}
                                    className="flex items-center gap-1.5 mt-0.5 group text-left"
                                >
                                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                                        {store.address}
                                    </p>
                                    <span className={`flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-all ${copied
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                                        }`}>
                                        {copied
                                            ? <><Check className="w-3 h-3" />복사됨</>
                                            : <><Copy className="w-3 h-3" />복사</>
                                        }
                                    </span>
                                </button>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <RegionBadge region={region} />
                                    <span className="text-[11px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-lg border border-gray-200 shadow-sm">
                                        {store.distance < 1000 ? `${store.distance}m` : `${(store.distance / 1000).toFixed(1)}km`} 떨어진 위치
                                    </span>
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

                <div className="overflow-y-auto flex-1 custom-scrollbar pb-24 sm:pb-5">
                    {/* 지도 */}
                    <div ref={mapRef} className="relative h-48 bg-gray-100 overflow-hidden w-full">
                        {!window.kakao && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-sm">
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
                            <div className="grid grid-cols-3 gap-2.5">
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-3.5 text-center border border-amber-100">
                                    <div className="flex items-center justify-center mb-1.5">
                                        <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                                            <Star className="w-3.5 h-3.5 text-white" fill="white" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-amber-700">{store.wins.first}</p>
                                    <p className="text-[10px] text-amber-600 font-semibold mt-0.5">1등 당첨</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3.5 text-center border border-blue-100">
                                    <div className="flex items-center justify-center mb-1.5">
                                        <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                                            <Award className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-blue-700">{store.wins.second}</p>
                                    <p className="text-[10px] text-blue-600 font-semibold mt-0.5">2등 당첨</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-3.5 text-center border border-emerald-100">
                                    <div className="flex items-center justify-center mb-1.5">
                                        <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                                            <TrendingUp className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-700">{store.wins.third || 0}</p>
                                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">3등 당첨</p>
                                </div>
                            </div>
                        </div>

                        {/* 1등 당첨 회차 */}
                        {(relatedRounds.length > 0 || loading) && (
                            <div>
                                <h4 className="font-black text-gray-800 text-sm mb-2.5 flex items-center gap-1.5">
                                    <Hash className="w-4 h-4 text-purple-500" />
                                    1등 당첨 회차
                                </h4>
                                {loading ? (
                                    <div className="flex items-center gap-2 py-4">
                                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                                        <span className="text-xs text-gray-500">당첨 회차를 불러오는 중입니다...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {relatedRounds.map((r, i) => (
                                            <div key={`${r.drwNo}-${i}`} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm hover:border-purple-200 transition-colors">
                                                <span className="text-xs font-black text-gray-700">{r.drwNo}회</span>
                                                <span className="text-[10px] text-gray-400">{r.drwNoDate || ''}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.method === 'auto'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-purple-50 text-purple-600'
                                                    }`}>
                                                    {r.method === 'auto' ? '자동' : '수동'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function NearbyStore() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [filterOnlyHot, setFilterOnlyHot] = useState(false);
    const [sortBy, setSortBy] = useState<'distance' | 'wins'>('distance');
    const [isSheetOpen, setIsSheetOpen] = useState(true);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [page, setPage] = useState(0);
    const mapRef = useRef<HTMLDivElement>(null);
    
    const DEFAULT_POS = { lat: 37.5665, lng: 126.9780 };
    const [userPos, setUserPos] = useState<{lat: number, lng: number}>(DEFAULT_POS);
    const [realUserPos, setRealUserPos] = useState<{lat: number, lng: number} | null>(null);
    const [searchPos, setSearchPos] = useState<{lat: number, lng: number} | null>(null);
    const [kakaoReady, setKakaoReady] = useState(false);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const userOverlayRef = useRef<any>(null);

    const { data, loading, fetchNearbyStores } = useNearbyStores();

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setPage(0);
    }, [debouncedQuery, filterOnlyHot, sortBy]);

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
        if (!searchPos) return;
        fetchNearbyStores({
            lat: searchPos.lat,
            lng: searchPos.lng,
            keyword: debouncedQuery,
            onlyHot: filterOnlyHot,
            sort: sortBy,
            page: page,
            size: 20
        }, page > 0);
    }, [searchPos, debouncedQuery, filterOnlyHot, sortBy, page, fetchNearbyStores]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setUserPos(pos);
                    setSearchPos(pos);
                    setRealUserPos(pos);
                },
                (error) => {
                    console.warn("Geolocation error:", error);
                    // 위치 권한 없거나 오류 발생 시 기본 위치(서울시청)로 데이터 조회
                    setSearchPos(DEFAULT_POS);
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity }
            );
        } else {
            // 위치 서비스 지원하지 않을 때 기본 위치로 조회
            setSearchPos(DEFAULT_POS);
        }
    }, []);

    // 맵 초기화 (내 위치 오버레이 제거됨 - 아래 효과에서 관리)
    useEffect(() => {
        if (!mapInstanceRef.current && kakaoReady && mapRef.current) {
            window.kakao.maps.load(() => {
                if (mapRef.current) {
                    mapRef.current.innerHTML = '';
                }
                const position = new window.kakao.maps.LatLng(userPos.lat, userPos.lng);
                const options = { center: position, level: 3 };
                mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
            });
        }
    }, [kakaoReady]);

    // 위치가 결정되면 지도 중심 이동
    useEffect(() => {
        if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
            const moveLatLon = new window.kakao.maps.LatLng(userPos.lat, userPos.lng);
            mapInstanceRef.current.panTo(moveLatLon);
        }
    }, [userPos.lat, userPos.lng]);

    // 내 위치 마커(오버레이) 관리 - 실제 위치가 있을 때만 표시
    useEffect(() => {
        if (!mapInstanceRef.current || !realUserPos || !kakaoReady) return;

        if (userOverlayRef.current) {
            userOverlayRef.current.setMap(null);
        }

        const position = new window.kakao.maps.LatLng(realUserPos.lat, realUserPos.lng);
        const userOverlayContent = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(0, -100%);">
                <div style="background-color: #3b82f6; color: white; padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 2px solid white; white-space: nowrap;">
                    내 위치
                </div>
                <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #3b82f6; margin-top: -1px;"></div>
            </div>
        `;
        const userWrapper = document.createElement('div');
        userWrapper.innerHTML = userOverlayContent;
        
        userOverlayRef.current = new window.kakao.maps.CustomOverlay({
            position: position,
            content: userWrapper,
            yAnchor: 0.1
        });
        userOverlayRef.current.setMap(mapInstanceRef.current);
    }, [realUserPos, kakaoReady]);

    const filteredStores: Store[] = useMemo(() => {
        return data?.content.map(item => ({
            id: item.storeId,
            name: item.storeName,
            address: item.address,
            lat: item.latitude,
            lng: item.longitude,
            distance: item.distance,
            isHot: item.isHot,
            wins: {
                first: item.rank1Count,
                second: item.rank2Count,
                third: item.rank3Count
            }
        })) || [];
    }, [data?.content]);

    // 마커 업데이트
    useEffect(() => {
        if (!mapInstanceRef.current || !kakaoReady) return;

        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        filteredStores.forEach(store => {
            if (store.lat && store.lng) {
                const position = new window.kakao.maps.LatLng(store.lat, store.lng);
                
                let overlayContent = '';
                if (store.isHot) {
                    overlayContent = `
                        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(0, -100%); padding-bottom: 8px; z-index: 20;">
                            <div style="white-space: nowrap; background: linear-gradient(to right, #ea580c, #ef4444); color: white; font-size: 12px; font-weight: 900; padding: 4px 10px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); border: 1.5px solid white; z-index: 20; display: flex; align-items: center; gap: 4px; pointer-events: none;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                                1등 ${store.wins.first}번
                            </div>
                            <svg width="42" height="42" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); margin-top: -6px; pointer-events: none;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3" fill="white" stroke="none"></circle></svg>
                            <div style="background: white; color: #111827; font-size: 13px; font-weight: 900; padding: 4px 8px; border-radius: 8px; margin-top: 2px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: nowrap; border: 1.5px solid #fca5a5; pointer-events: none;">
                                ${store.name}
                            </div>
                        </div>
                    `;
                } else {
                    overlayContent = `
                        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(0, -100%); z-index: 10;">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25)); pointer-events: none;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3" fill="white" stroke="none"></circle></svg>
                            <div style="background: white; color: #1f2937; font-size: 12px; font-weight: 800; padding: 4px 8px; border-radius: 8px; margin-top: 2px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); white-space: nowrap; border: 1px solid #d1d5db; pointer-events: none;">
                                ${store.name}
                            </div>
                        </div>
                    `;
                }

                const wrapper = document.createElement('div');
                wrapper.innerHTML = overlayContent;
                wrapper.style.cursor = 'pointer';
                wrapper.onclick = () => {
                    setSelectedStore(store);
                };

                const overlay = new window.kakao.maps.CustomOverlay({
                    position: position,
                    content: wrapper,
                    yAnchor: 0.1
                });
                overlay.setMap(mapInstanceRef.current);
                markersRef.current.push(overlay);
            }
        });
    }, [filteredStores, kakaoReady]);

    return (
        <div className="fixed inset-0 top-[64px] sm:top-[80px] z-40 flex bg-gray-50 overflow-hidden">

            {/* 좌측 패널 (PC) / 오버레이 UI (Mobile) */}
            <div className="absolute inset-0 flex flex-col pointer-events-none z-20 lg:static lg:w-[380px] xl:w-[420px] lg:flex-shrink-0 lg:pointer-events-auto lg:bg-white lg:shadow-[4px_0_24px_rgba(0,0,0,0.05)] lg:z-30 transition-all">

                {/* 상단 검색 & 필터 */}
                <div className="p-4 pointer-events-auto lg:p-6 lg:border-b lg:border-gray-100 lg:bg-white bg-transparent">
                    <div className="relative mb-3 shadow-lg lg:shadow-none rounded-2xl">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="명당 복권방, 주소 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white lg:bg-gray-100 border lg:border-none border-gray-200 rounded-2xl text-[15px] font-medium focus:ring-2 focus:ring-blue-500 transition-shadow outline-none shadow-sm lg:shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar pointer-events-auto">
                        <button
                            onClick={() => setFilterOnlyHot(false)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm ${!filterOnlyHot ? 'bg-gray-800 text-white' : 'bg-white lg:bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 lg:border-transparent'}`}
                        >
                            전체 보기
                        </button>
                        <button
                            onClick={() => setFilterOnlyHot(true)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm border ${filterOnlyHot ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-transparent' : 'bg-white lg:bg-yellow-50 text-red-600 hover:bg-yellow-100 border-red-200 lg:border-transparent'}`}
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            1등 배출점만
                        </button>
                    </div>
                </div>

                {/* 하단 바텀시트 (Mobile) / 리스트 패널 (PC) */}
                <div className={`flex-none lg:flex-1 flex flex-col min-h-0 pointer-events-auto bg-white 
                    mt-auto rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] 
                    lg:mt-0 lg:rounded-none lg:shadow-none lg:relative
                    h-[55vh] lg:h-auto transition-transform duration-300 ease-in-out
                    ${isSheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'} 
                    lg:translate-y-0`}>

                    {/* 모바일 바텀시트 핸들 */}
                    <div
                        className="w-full flex justify-center py-3 lg:hidden cursor-pointer active:bg-gray-50 rounded-t-3xl transition-colors"
                        onClick={() => setIsSheetOpen(!isSheetOpen)}
                    >
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
                    </div>

                    {/* 리스트 헤더 & 정렬 */}
                    <div className="px-5 pb-3 pt-1 lg:pt-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
                        <h3 className="font-bold text-gray-800 text-[15px]">목록 <span className="text-blue-600">{filteredStores.length}</span>개</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSortBy('distance')}
                                className={`text-[13px] font-bold transition-colors ${sortBy === 'distance' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                거리순
                            </button>
                            <span className="text-gray-200 text-xs">|</span>
                            <button
                                onClick={() => setSortBy('wins')}
                                className={`text-[13px] font-bold transition-colors ${sortBy === 'wins' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                당첨순
                            </button>
                        </div>
                    </div>

                    {/* 스크롤 가능한 리스트 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/50 lg:bg-transparent pb-32 sm:pb-4">
                        {filteredStores.map(store => (
                            <div 
                                key={store.id} 
                                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 sm:gap-4 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
                                onClick={() => {
                                    if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
                                        const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
                                        mapInstanceRef.current.panTo(moveLatLon);
                                        if (window.innerWidth < 1024) {
                                            setIsSheetOpen(false);
                                        }
                                    }
                                }}
                            >
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-800 text-[15px] sm:text-[17px] truncate leading-tight">{store.name}</h4>
                                        <span className="flex-shrink-0 text-[11px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                            {store.distance < 1000 ? `${store.distance}m` : `${(store.distance / 1000).toFixed(1)}km`}
                                        </span>
                                    </div>
                                    <p className="text-[12px] sm:text-[13px] text-gray-500 truncate">{store.address}</p>

                                    {/* 당첨 내역 뱃지 */}
                                    {(store.wins.first > 0 || store.wins.second > 0) && (
                                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                                            {store.wins.first > 0 && (
                                                <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-white bg-gradient-to-r from-red-600 to-orange-500 px-2 py-1 rounded-md shadow-sm">
                                                    <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                                                    1등 {store.wins.first}회
                                                </div>
                                            )}
                                            {store.wins.second > 0 && (
                                                <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-orange-800 bg-orange-100 border border-orange-200 px-2 py-1 rounded-md">
                                                    2등 {store.wins.second}회
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>


                                {store.isHot ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedStore(store);
                                        }}
                                        className="h-9 px-3 sm:px-4 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold textxs sm:text-sm group-hover:bg-orange-500 group-hover:text-white transition-colors flex-shrink-0 whitespace-nowrap"
                                        title="상세보기"
                                    >
                                        상세보기
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedStore(store);
                                        }}
                                        className="h-9 px-3 sm:px-4 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm group-hover:bg-gray-200 transition-colors flex-shrink-0 whitespace-nowrap"
                                        title="정보"
                                    >
                                        정보
                                    </button>
                                )}
                            </div>
                        ))}

                        {filteredStores.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-400 text-sm font-medium flex flex-col items-center gap-2">
                                <Search className="w-8 h-8 text-gray-300 opacity-50" />
                                <span>조건에 일치하는 판매점이 없습니다.</span>
                            </div>
                        )}
                        {loading && (
                            <div className="text-center py-12 flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                                <p className="text-gray-500 font-medium text-sm">정보를 불러오는 중...</p>
                            </div>
                        )}
                        {data && data.pageNumber < data.totalPages - 1 && !loading && (
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="w-full py-3 mt-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600 mb-6"
                            >
                                더 보기
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 오른쪽 지도 영역 (PC: 나머지 가득 채움, 모바일: 전체 화면 백그라운드 역할) */}
            <div className="absolute inset-0 z-10 lg:relative lg:flex-1 bg-gray-100 overflow-hidden">
                <div ref={mapRef} className="absolute inset-0 w-full h-full" />
                {!kakaoReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 font-medium">
                        <Loader2 className="w-6 h-6 animate-spin mb-2" />
                        지도 로딩 중...
                    </div>
                )}
                
                {/* 오버레이 플로팅 버튼 영역 */}
                <div className={`absolute z-20 left-1/2 -translate-x-1/2 lg:left-1/2 transition-all duration-300 pointer-events-none flex flex-row lg:flex-row items-center gap-3 w-max
                    bottom-[calc(55vh+16px)] lg:bottom-auto lg:top-8 
                    ${!isSheetOpen ? 'translate-y-[calc(55vh-96px)] lg:translate-y-0' : 'translate-y-0'}
                `}>
                    <button 
                        onClick={() => {
                            if (mapInstanceRef.current) {
                                const center = mapInstanceRef.current.getCenter();
                                setSearchPos({ lat: center.getLat(), lng: center.getLng() });
                            }
                        }}
                        className="pointer-events-auto flex items-center gap-2 bg-white text-gray-800 hover:text-blue-600 font-extrabold px-4 py-3 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 transition-all hover:shadow-xl active:scale-95 text-[13px] sm:text-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        현 지도에서 검색
                    </button>
                    <button 
                        onClick={() => {
                            if (mapInstanceRef.current && userPos) {
                                const latlng = new window.kakao.maps.LatLng(userPos.lat, userPos.lng);
                                mapInstanceRef.current.panTo(latlng);
                                setSearchPos(userPos);
                            }
                        }}
                        className="pointer-events-auto flex items-center justify-center w-11 h-11 bg-white hover:bg-blue-50 text-blue-600 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 transition-all hover:shadow-xl active:scale-95"
                        title="내 위치로 이동"
                    >
                        <Navigation className="w-5 h-5 fill-blue-600/20" />
                    </button>
                </div>
            </div>

            {/* 4. 스토어 상세 모달 */}
            {selectedStore && (
                <NearbyStoreDetailModal
                    store={selectedStore}
                    onClose={() => setSelectedStore(null)}
                />
            )}
        </div>
    );
}
