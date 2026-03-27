import { Crown, Sparkles, Trophy, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HallOfFameBanner() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl border-t border-white/10 group cursor-pointer" onClick={() => navigate('/winning')}>
      {/* 장식 요소들 (Glow effects) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-500/30 transition-colors duration-500" />

      {/* 반짝이 애니메이션 */}
      <Sparkles className="absolute top-4 right-8 w-5 h-5 text-amber-300/60 animate-pulse" />
      <Sparkles className="absolute bottom-6 right-1/4 w-4 h-4 text-purple-300/60 animate-pulse delay-75" />
      <Sparkles className="absolute top-1/3 left-6 w-3 h-3 text-blue-300/60 animate-pulse delay-150" />

      <div className="relative z-10 p-5 sm:p-7 flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-6">
        
        {/* 심볼 아이콘 */}
        <div className="flex-shrink-0 relative mt-2 sm:mt-0">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-[0_4px_30px_rgba(245,158,11,0.4)] border border-amber-200 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-900" strokeWidth={2.5} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:animate-shine rounded-2xl" />
          </div>
          <div className="absolute -bottom-2.5 -right-2.5 bg-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-lg shadow-md border border-gray-100 flex items-center gap-1 text-gray-800 z-10">
            <Trophy className="w-3 h-3 text-amber-500" />
            1등 당첨!
          </div>
        </div>

        {/* 텍스트 컨텐츠 */}
        <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
          <div className="inline-flex items-center self-center sm:self-start gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/5 backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Hall of Fame</span>
          </div>
          <h2 className="text-[17px] sm:text-xl md:text-2xl font-black text-white leading-tight mb-1.5 group-hover:text-amber-100 transition-colors">
            축하합니다! 로또나라에서<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              실제 1등 당첨자
            </span>가 탄생했습니다!
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 font-medium">
            제 1100회 • 당첨금 28억원 • 로또나라 조합기 사용
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex-shrink-0 flex items-center justify-center mt-2 sm:mt-0 w-full sm:w-auto">
          <div className="w-full sm:w-auto px-5 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 backdrop-blur-sm">
            <span className="font-bold text-white text-sm sm:text-sm whitespace-nowrap">
              당첨 내역 확인하기
            </span>
            <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
