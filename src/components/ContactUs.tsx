import { useState } from 'react';
import { Mail, Copy, Check, ExternalLink } from 'lucide-react';

export function ContactUs() {
    const [copied, setCopied] = useState(false);
    const email = "pyjhoop1@gmail.com";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
        }
    };

    return (
        <div className="min-h-[50vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl border border-white">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 mt-4 font-pretendard">
                        문의하기
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed font-pretendard">
                        서비스 이용 중 불편하신 점이나 개선사항,<br />
                        기타 문의사항이 있으시다면 이메일로 보내주세요.<br />
                        빠르게 확인 후 답변해 드리겠습니다. 😊
                    </p>
                </div>

                <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
                        공식 문의 이메일
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                        <span className="text-gray-900 font-medium sm:text-lg select-all text-sm truncate mr-2">
                            {email}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="이메일 주소 복사하기"
                        >
                            {copied ? (
                                <Check className="h-5 w-5 text-green-500" />
                            ) : (
                                <Copy className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <a
                        href={`mailto:${email}`}
                        className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative flex items-center gap-2">
                            이메일 앱으로 열기
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
