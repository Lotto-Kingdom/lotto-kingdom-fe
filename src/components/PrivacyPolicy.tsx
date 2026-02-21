import { ShieldCheck, Lock, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export function PrivacyPolicy() {
    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white p-6 sm:p-10">
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <ShieldCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 font-pretendard">
                        개인정보처리방침
                    </h1>
                    <p className="text-gray-500 font-medium">
                        마지막 수정일: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="space-y-8 text-gray-700 font-pretendard leading-relaxed">
                    <p className="text-sm sm:text-base mb-6">
                        로또나라(이하 "서비스"라 합니다)는 이용자의 개인정보를 중요시하며, 「개인정보보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다. 본 개인정보처리방침을 통하여 이용자께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
                    </p>

                    <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-green-600" />
                            제 1 조 (수집하는 개인정보 항목 및 수집 방법)
                        </h2>
                        <div className="space-y-4 text-sm sm:text-base">
                            <p>서비스는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>

                            <div className="pl-4 border-l-2 border-green-200 space-y-3">
                                <div>
                                    <strong className="text-gray-900 block mb-1">회원가입 시 수집하는 항목</strong>
                                    <ul className="list-disc pl-5 marker:text-green-400 space-y-1">
                                        <li><span className="font-medium text-gray-800">필수항목:</span> 이메일(아이디), 비밀번호, 닉네임</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-gray-900 block mb-1">서비스 이용 과정에서 자동으로 수집되는 항목 (로그 데이터)</strong>
                                    <ul className="list-disc pl-5 marker:text-green-400 space-y-1">
                                        <li>IP 주소, 쿠키(Cookie), 방문 일시, 서비스 이용 기록, 불량 이용 기록, 기기 정보(운영체제, 브라우저 환경 등)</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-gray-900 block mb-1">수집 방법</strong>
                                    <ul className="list-disc pl-5 marker:text-green-400 space-y-1">
                                        <li>홈페이지 회원가입 및 서비스 이용 과정에서 수집</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            제 2 조 (개인정보의 수집 및 이용 목적)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-green-100 text-sm sm:text-base">
                            <p>서비스는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-green-400">
                                <li>
                                    <strong className="text-gray-900">회원 관리:</strong> 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량 회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 분쟁 조정을 위한 기록 보존, 불만 처리 등 민원 처리, 고지사항 전달
                                </li>
                                <li>
                                    <strong className="text-gray-900">서비스 제공:</strong> 로또 번호 생성 히스토리 저장, 마이페이지 기능 제공, 개인화된 서비스(추천 등) 제공
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            제 3 조 (개인정보의 보유 및 이용 기간)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-green-100 text-sm sm:text-base">
                            <p>원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후(회원 탈퇴 시)에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-green-400">
                                <li>
                                    <strong className="text-gray-900 block mb-1">회사 내부 방침에 의한 정보 보유 사유</strong>
                                    <span className="text-gray-600 block pl-2 border-l-2 border-gray-200">
                                        부정이용 기록(비정상적인 가입/탈퇴 반복 등): 부정 가입 방지를 위해 탈퇴일로부터 6개월 보관
                                    </span>
                                </li>
                                <li>
                                    <strong className="text-gray-900 block mb-1 flex items-center gap-1.5">
                                        관련 법령에 의한 정보 보유 사유 <AlertCircle className="w-4 h-4 text-blue-500 inline" />
                                    </strong>
                                    <span className="text-gray-600 bg-blue-50/50 p-2 rounded-lg block border border-blue-100">
                                        <strong>웹사이트 방문 기록 (통신비밀보호법): 3개월</strong>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            제 4 조 (개인정보의 파기 절차 및 방법)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-green-100 text-sm sm:text-base">
                            <p>이용자의 개인정보는 원칙적으로 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때 지체 없이 파기합니다.</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-green-400">
                                <li><strong className="text-gray-900">파기 절차:</strong> 이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.</li>
                                <li><strong className="text-gray-900">파기 방법:</strong> 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            제 5 조 (개인정보 제3자 제공 및 위탁)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-green-100 text-sm sm:text-base">
                            <p>서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하거나 위탁하지 않습니다. 단, 아래의 경우에는 예외로 합니다.</p>
                            <ul className="list-disc pl-5 space-y-1 marker:text-green-400">
                                <li>이용자들이 사전에 동의한 경우</li>
                                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            제 6 조 (이용자의 권리와 그 행사 방법)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-green-100 text-sm sm:text-base">
                            <ul className="list-disc pl-5 space-y-2 marker:text-green-400">
                                <li>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴(가입 해지)를 요청할 수 있습니다.</li>
                                <li>개인정보 조회/수정 및 가입 해지는 서비스 내 '마이페이지' 또는 '설정' 메뉴를 통해 직접 처리할 수 있습니다.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            제 7 조 (개인정보 자동 수집 장치의 설치, 운영 및 거부에 관한 사항)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-green-100 text-sm sm:text-base">
                            <p>서비스는 이용자의 정보를 수시로 저장하고 찾아내는 '쿠키(cookie)' 등을 운용합니다.</p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-green-400">
                                <li><strong className="text-gray-900">쿠키 등 사용 목적:</strong> 이용자의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악하여 타겟 마케팅 및 개인 맞춤 서비스 제공</li>
                                <li>
                                    <strong className="text-gray-900 block mb-1">쿠키 설정 거부 방법:</strong>
                                    <span className="text-gray-600">이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴의 옵션 설정을 통해 모든 쿠키를 허용하거나, 거부할 수 있습니다. 단, 쿠키 설치를 거부하였을 경우 로그인이 필요한 일부 서비스 제공에 어려움이 있을 수 있습니다.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-700" />
                            제 8 조 (개인정보 보호책임자 및 연락처)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-gray-300 text-sm sm:text-base">
                            <p>서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-2 space-y-2">
                                <p><strong className="text-gray-900">이름 / 직책:</strong> 로또나라 운영자</p>
                                <p><strong className="text-gray-900">이메일:</strong> pyjhoop1@gmail.com</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            제 9 조 (부칙)
                        </h2>
                        <div className="pl-4 border-l-2 border-green-100 text-sm sm:text-base text-gray-600">
                            <p>본 개인정보처리방침은 2026년 2월 21일부터 적용됩니다.</p>
                        </div>
                    </section>

                    <div className="mt-8 bg-blue-50 rounded-xl p-5 flex gap-3 text-blue-800 text-sm items-start">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                        <p className="leading-relaxed">
                            본 서비스는 이용자의 개인정보 보호를 최우선으로 생각하며, 철저한 관리를 통해 안전하게 보호하고 있습니다. 문의사항이 있으실 경우 고객센터 또는 보호책임자 이메일로 연락 주시면 신속하게 답변 드리겠습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
