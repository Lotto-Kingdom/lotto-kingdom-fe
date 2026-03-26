import { Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { LottoGenerator } from './components/LottoGenerator';
import { MiniHistory } from './components/MiniHistory';
import { StoreFinder } from './components/StoreFinder';
import { NearbyStore } from './components/NearbyStore';
import { StatisticsPanel } from './components/StatisticsPanel';
import { MobileStatistics } from './components/MobileStatistics';
import { WinningPage } from './components/WinningPage';
import { WinningAmount } from './components/WinningAmount';
import { WinningStats } from './components/WinningStats';
import { MyAnalysis } from './components/MyAnalysis';
import { ContactUs } from './components/ContactUs';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { useLottoHistory } from './hooks/useLottoHistory';
import { useState, useEffect } from 'react';
import { useLottoWinning } from './hooks/useLottoWinning';
import { useLottoStatistics } from './hooks/useLottoStatistics';

function HomePage() {
  const { history, addEntry } = useLottoHistory();
  const [sessionCount, setSessionCount] = useState(0);

  const { latestDraw, loadRecent } = useLottoWinning();
  const { hotNumbers, coldNumbers, loadStatistics } = useLottoStatistics();

  useEffect(() => {
    loadRecent(0);
    loadStatistics();
  }, [loadRecent, loadStatistics]);

  const handleGenerate = (nums: number[]) => {
    addEntry(nums);
    setSessionCount(prev => prev + 1);
  };

  const recentHistory = history.slice(0, Math.min(sessionCount, 5));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <LottoGenerator onGenerate={handleGenerate} />
        {recentHistory.length > 0 && <MiniHistory history={recentHistory} />}
        <StoreFinder />
        <MobileStatistics history={history} latestDraw={latestDraw} hotNumbers={hotNumbers} coldNumbers={coldNumbers} />
      </div>
      <aside className="hidden lg:block lg:col-span-4">
        <div className="sticky top-24">
          <StatisticsPanel history={history} latestDraw={latestDraw} hotNumbers={hotNumbers} coldNumbers={coldNumbers} />
        </div>
      </aside>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-4 sm:py-8 pb-24 sm:pb-12 max-w-7xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store/nearby" element={<NearbyStore />} />
          <Route path="/winning" element={<WinningPage />} />
          <Route path="/region" element={<WinningPage />} />
          <Route path="/amount" element={<WinningAmount />} />
          <Route path="/stats" element={<WinningStats />} />
          <Route path="/my-stats" element={<MyAnalysis />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white/50 backdrop-blur-sm pb-24 md:pb-0">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          <div className="text-center space-y-3">
            <div className="space-y-1">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">
                본 서비스는 무작위 번호 생성기이며, 당첨을 보장하지 않습니다.
              </p>
              <p className="text-gray-400 text-xs">
                로또 구매는 만 19세 이상만 가능합니다. 과도한 구매는 삼가주세요.
              </p>
            </div>
            <div className="w-16 h-px bg-gray-300 mx-auto"></div>
            <div className="space-y-2">
              <p className="text-gray-600 text-xs sm:text-sm">행운을 빕니다! 🍀</p>
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} 로또나라. All rights reserved.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <Link to="/terms" className="hover:text-gray-600 transition-colors">
                이용약관
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-gray-600 transition-colors">
                개인정보처리방침
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-gray-600 transition-colors">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
