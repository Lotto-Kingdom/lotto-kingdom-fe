import { useState } from 'react';
import { Search, MapPin, Trophy, X, Store as StoreIcon, Check, Copy, Star, Award, TrendingUp, Hash } from 'lucide-react';
import { NEARBY_STORES, Store, MOCK_ROUNDS } from '../utils/lottoData';

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

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${store.lng - 0.005
        }%2C${store.lat - 0.003}%2C${store.lng + 0.005}%2C${store.lat + 0.003}&layer=mapnik&marker=${store.lat}%2C${store.lng}`;

    const relatedRounds = MOCK_ROUNDS.filter((r) => r.storeId === store.id)
        .sort((a, b) => b.drwNo - a.drwNo);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up sm:animate-pop">
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

                <div className="overflow-y-auto flex-1 custom-scrollbar">
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
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-gray-500 font-medium pointer-events-none">
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
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.method === 'auto'
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

export function NearbyStore() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOnlyHot, setFilterOnlyHot] = useState(false);
    const [sortBy, setSortBy] = useState<'distance' | 'wins'>('distance');
    const [isSheetOpen, setIsSheetOpen] = useState(true); // 모바일 바텀시트 열림 상태
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    // 필터 연산
    const filteredStores = NEARBY_STORES.filter(store => {
        if (filterOnlyHot && !store.isHot) return false;
        if (searchQuery && !store.name.includes(searchQuery) && !store.address.includes(searchQuery)) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        return b.wins.first - a.wins.first;
    });

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
                <div className={`flex-1 flex flex-col min-h-0 pointer-events-auto bg-white 
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/50 lg:bg-transparent">
                        {filteredStores.map(store => (
                            <div key={store.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 sm:gap-4 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-800 text-[15px] sm:text-[17px] truncate leading-tight">{store.name}</h4>
                                        <span className="flex-shrink-0 text-[11px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                            {store.distance < 1000 ? `${store.distance}m` : `${(store.distance / 1000).toFixed(1)}km`}
                                        </span>
                                    </div>
                                    <p className="text-[12px] sm:text-[13px] text-gray-500 truncate">{store.address}</p>

                                    {/* 명당 뱃지 강조 */}
                                    {store.isHot && (
                                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                                            <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-white bg-gradient-to-r from-red-600 to-orange-500 px-2 py-1 rounded-md shadow-sm">
                                                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                                                1등 {store.wins.first}회
                                            </div>
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

                        {filteredStores.length === 0 && (
                            <div className="text-center py-12 text-gray-400 text-sm font-medium flex flex-col items-center gap-2">
                                <Search className="w-8 h-8 text-gray-300 opacity-50" />
                                <span>조건에 일치하는 판매점이 없습니다.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 오른쪽 지도 영역 (PC: 나머지 가득 채움, 모바일: 전체 화면 백그라운드 역할) */}
            <div className="absolute inset-0 z-10 lg:static lg:flex-1 bg-[#e5e3df] overflow-hidden">
                {/* 지도 배경 패턴 (가짜 지도 대체용) */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                {/* 모바일에서는 바텀시트에 안 가려지게 패딩 처리, 데스크톱은 중앙에 넓게 */}
                <div className="absolute inset-0 p-4 pb-[55vh] lg:p-12 lg:pb-12 flex flex-wrap justify-center items-center gap-8 lg:gap-24">
                    {filteredStores.map(store => (
                        <div key={store.id} className="relative group cursor-pointer animate-pop" style={{
                            marginLeft: `${store.lng % 0.05 * 1000}px`,
                            marginTop: `${store.lat % 0.05 * 1000}px`
                        }}>
                            {store.isHot ? (
                                <div className="relative flex flex-col items-center">
                                    <div className="absolute -top-8 whitespace-nowrap bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-lg border border-red-400 z-10 flex items-center gap-1 group-hover:-translate-y-1 transition-transform">
                                        <Trophy className="w-3 h-3 text-yellow-200" />
                                        1등 {store.wins.first}번
                                    </div>
                                    <MapPin className="w-10 h-10 lg:w-14 lg:h-14 text-red-600 fill-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                                </div>
                            ) : (
                                <div className="relative flex flex-col items-center">
                                    <MapPin className="w-8 h-8 lg:w-10 lg:h-10 text-gray-500 fill-white drop-shadow-md group-hover:scale-110 transition-transform" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 내 위치 마커 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:-translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center animate-pulse z-20">
                    <div className="w-10 h-10 lg:w-14 lg:h-14 bg-blue-500/20 rounded-full absolute" />
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
