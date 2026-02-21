import { Ticket, Lock, Sparkles } from 'lucide-react';
import { LottoNumber } from '../types';
import { useAuth } from '../context/AuthContext';
import { getLottoNumberColor } from '../utils/lottoGenerator';

function MiniBall({ number, index }: { number: number; index: number }) {
    const isBonus = index === 6;
    return (
        <div className="flex items-center gap-1.5 sm:gap-2">
            {isBonus && (
                <div className="flex items-center justify-center text-gray-300 font-black">
                    +
                </div>
            )}
            <div
                className={`
            w-8 h-8 sm:w-10 sm:h-10 rounded-full
            ${isBonus ? 'bg-gradient-to-br from-gray-500 to-gray-700 ring-2 ring-gray-400' : getLottoNumberColor(number)}
            text-white font-bold text-sm sm:text-base
            flex items-center justify-center
            shadow-sm flex-shrink-0
            animate-pop
          `}
                style={{ animationDelay: `${index * 0.05}s` }}
                title={isBonus ? '보너스 번호' : undefined}
            >
                {number}
            </div>
        </div>
    );
}

interface MiniHistoryProps {
    history: LottoNumber[];
}

export function MiniHistory({ history }: MiniHistoryProps) {
    const { user } = useAuth();

    const handleLoginClick = () => {
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }));
    };

    if (history.length === 0) return null;

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2 px-2 sm:px-4">
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    방금 뽑은 행운의 번호
                </h3>
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    이번 세션
                </span>
            </div>

            <div className="flex flex-col gap-2.5">
                {history.map((entry, idx) => (
                    <div
                        key={entry.id}
                        className="group relative bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 overflow-hidden"
                    >
                        {/* 왼쪽 하이라이트 라인 */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between sm:w-auto">
                            <div className="flex items-center gap-2">
                                <span className="flex sm:hidden w-6 h-6 bg-blue-50 text-blue-600 rounded-full items-center justify-center font-bold text-xs">
                                    {idx + 1}
                                </span>
                                <span className="px-2 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-md text-[10px] sm:text-xs font-bold">
                                    {entry.round}회
                                </span>
                            </div>
                            <span className="sm:hidden text-[10px] text-gray-400 font-medium">
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <div className="flex items-center flex-1 gap-2 sm:gap-3">
                            <div className="hidden sm:flex w-6 h-6 bg-blue-50 text-blue-600 rounded-full items-center justify-center font-bold text-xs flex-shrink-0">
                                {idx + 1}
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {entry.numbers.map((num, i) => (
                                    <MiniBall key={`${entry.id}-${i}`} number={num} index={i} />
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-[10px] sm:text-xs text-gray-400 font-medium whitespace-nowrap bg-gray-50 px-2.5 py-1 rounded-md">
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {!user && (
                <div className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-5 border border-blue-500/30 relative overflow-hidden group shadow-lg">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl transition-transform group-hover:scale-150 duration-700" />
                    <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left space-y-1">
                            <p className="font-bold text-white text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                앗, 이 좋은 번호들을 그냥 날려버리실 건가요?
                            </p>
                            <p className="text-xs sm:text-sm text-blue-100">
                                지금 로그인하고 마이페이지에 영구 저장하세요!
                            </p>
                        </div>
                        <button
                            onClick={handleLoginClick}
                            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-600 text-sm font-bold rounded-xl transition-all shadow-sm whitespace-nowrap flex items-center justify-center gap-2 hover:scale-105"
                        >
                            <Lock className="w-4 h-4" />
                            1초만에 로그인하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
