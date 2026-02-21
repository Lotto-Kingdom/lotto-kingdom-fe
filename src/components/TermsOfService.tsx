import { FileText, Shield, AlertTriangle, AlertCircle } from 'lucide-react';

export function TermsOfService() {
    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white p-6 sm:p-10">
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <FileText className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 font-pretendard">
                        이용약관
                    </h1>
                    <p className="text-gray-500 font-medium">
                        마지막 수정일: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="space-y-8 text-gray-700 font-pretendard leading-relaxed">
                    <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-6 h-6 text-indigo-500" />
                            <h2 className="text-xl font-bold text-gray-900">제 1 조 (목적)</h2>
                        </div>
                        <p className="text-sm sm:text-base">
                            본 약관은 "로또나라"(이하 "서비스")가 제공하는 로또 번호 생성 및 통계 분석 서비스의 이용과 관련하여, 회사와 이용자의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            제 2 조 (서비스의 성격 및 한계)
                        </h2>
                        <div className="space-y-4 pl-4 border-l-2 border-indigo-100">
                            <p className="text-sm sm:text-base">
                                1. 본 서비스는 수학적 알고리즘과 과거 당첨 내역(통계)을 기반으로 로또 번호를 무작위로 생성하거나 분석 결과를 제공하는 <strong>엔터테인먼트 및 참고용 서비스</strong>입니다.
                            </p>
                            <p className="text-sm sm:text-base text-red-600 font-medium bg-red-50 p-3 rounded-lg flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>
                                    2. 서비스에서 제공하는 어떠한 번호나 추천 결과도 당첨을 보장하지 않습니다. 로또 당첨은 전적으로 독립적인 확률에 의해 결정됩니다.
                                </span>
                            </p>
                            <p className="text-sm sm:text-base">
                                3. 이용자는 본 서비스의 결과를 전적으로 신뢰하여 발생할 수 있는 금전적, 정신적 피해에 대해 서비스 제공자에게 책임을 물을 수 없습니다.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            제 3 조 (면책조항)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-indigo-100 text-sm sm:text-base">
                            <p>
                                1. 서비스 제공자는 무료로 제공되는 본 서비스의 이용과 관련하여 이용자에게 발생한 어떠한 손해에 대해서도 책임을 지지 않습니다.
                            </p>
                            <p>
                                2. 서비스 제공자는 천재지변, 서버 장애, 제3자의 해킹 기타 서비스 제공자의 과실 없이 발생한 서비스 중단에 대해 책임을 지지 않습니다.
                            </p>
                            <p>
                                3. 로또 구매 지연이나 마감 시간 초과 등으로 인해 이용자가 복권을 구매하지 못하여 당첨될 기회를 상실한 경우, 이에 대한 어떠한 책임도 지지 않습니다.
                            </p>
                            <p>
                                4. 서비스 제공자는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경하거나 종료할 수 있으며, 이로 인해 이용자에게 발생한 손해에 대해서는 무료 서비스인 경우 별도의 보상을 하지 않습니다.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            제 4 조 (계정 관리 및 이용자의 의무)
                        </h2>
                        <div className="pl-4 border-l-2 border-indigo-100">
                            <ul className="list-disc pl-4 space-y-2 text-sm sm:text-base marker:text-indigo-400">
                                <li>이용자는 과도한 복권 구매를 지양하고, 본인의 경제적 여건에 맞는 건전한 여가 생활로서 복권을 즐겨야 합니다.</li>
                                <li>복권은 만 19세 미만의 청소년은 구매할 수 없습니다.</li>
                                <li>본 서비스의 데이터를 무단으로 크롤링, 상업적 이용 또는 재배포하는 행위를 금지합니다.</li>
                                <li>이용자는 본인의 계정(아이디 및 비밀번호)을 안전하게 관리할 책임이 있으며, 이용자의 관리 소홀이나 제3자 도용으로 인해 발생하는 모든 불이익에 대한 책임은 이용자 본인에게 있습니다.</li>
                                <li>서비스 제공자는 이용자의 개인정보를 보호하기 위해 노력하며, 자세한 사항은 별도의 '개인정보처리방침'에 따릅니다.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            제 5 조 (준거법 및 재판관할)
                        </h2>
                        <div className="space-y-3 pl-4 border-l-2 border-indigo-100 text-sm sm:text-base">
                            <p>
                                본 약관의 해석 및 서비스 이용과 관련하여 발생한 분쟁에 대해서는 대한민국 법률을 적용하며, 양 당사자 간의 소송은 민사소송법상의 관할 법원에 제기합니다.
                            </p>
                        </div>
                    </section>

                    <div className="mt-8 bg-blue-50 rounded-xl p-5 flex gap-3 text-blue-800 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                        <p>
                            도박 중독으로 어려움을 겪고 계신다면 <strong>한국도박문제예방치유원(1336)</strong>에서 연중무휴 24시간 무료 상담을 받으실 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
