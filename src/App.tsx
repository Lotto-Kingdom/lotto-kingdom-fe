import { Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { LottoGenerator } from './components/LottoGenerator';
import { MiniHistory } from './components/MiniHistory';
import { StoreFinder } from './components/StoreFinder';
import { NearbyStore } from './components/NearbyStore';
import { StatisticsPanel } from './components/StatisticsPanel';
import { MobileStatistics } from './components/MobileStatistics';
import { WinningHistory } from './components/WinningHistory';
import { WinningRegion } from './components/WinningRegion';
import { WinningAmount } from './components/WinningAmount';
import { WinningStats } from './components/WinningStats';
import { MyAnalysis } from './components/MyAnalysis';
import { ContactUs } from './components/ContactUs';
import { TermsOfService } from './components/TermsOfService';
import { useLottoHistory } from './hooks/useLottoHistory';
import { useState } from 'react';

function HomePage() {
  const { history, addEntry } = useLottoHistory();
  const [sessionCount, setSessionCount] = useState(0);

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
        <MobileStatistics history={history} />
      </div>
      <aside className="hidden lg:block lg:col-span-4">
        <div className="sticky top-24">
          <StatisticsPanel history={history} />
        </div>
      </aside>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-4 sm:py-8 pb-8 sm:pb-12 max-w-7xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store/nearby" element={<NearbyStore />} />
          <Route path="/winning" element={<WinningHistory />} />
          <Route path="/region" element={<WinningRegion />} />
          <Route path="/amount" element={<WinningAmount />} />
          <Route path="/stats" element={<WinningStats />} />
          <Route path="/my-stats" element={<MyAnalysis />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white/50 backdrop-blur-sm">
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
              <button onClick={() => alert('준비중인 페이지입니다')} className="hover:text-gray-600 transition-colors">
                개인정보처리방침
              </button>
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
