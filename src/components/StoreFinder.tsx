import { MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function StoreFinder() {
    const navigate = useNavigate();

    const handleFindStore = () => {
        navigate('/store/nearby');
    };

    return (
        <div
            className="w-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] touch-manipulation block"
            onClick={handleFindStore}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleFindStore(); }}
        >
            {/* 장식용 패턴 */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm mb-2 shadow-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        근처 판매점
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black leading-tight drop-shadow-sm">
                        방금 뽑은 행운의 번호,<br />
                        내 주변에서 바로 구매하기
                    </h3>
                    <p className="text-green-50 text-xs sm:text-sm font-medium">
                        동행복권 공식 오프라인 판매점을 찾아보세요
                    </p>
                </div>

                <div className="w-full sm:w-auto flex-shrink-0">
                    <div className="w-full sm:w-auto px-6 py-3.5 bg-white text-green-600 hover:bg-green-50 active:bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm group-hover:shadow-md">
                        <Navigation className="w-5 h-5" />
                        내 주변 판매점 찾기
                    </div>
                </div>
            </div>
        </div>
    );
}
