import { useState, useCallback } from 'react';

export interface WinningDraw {
  drwNo: number;
  drwNoDate: string;
  numbers: number[];
  bonusNo: number;
  firstWinamnt: number;   // 1등 1인당 당첨금
  firstPrzwnerCo: number; // 1등 당첨자 수
  firstAccumamnt: number; // 1등 총 당첨금
  totSellamnt: number;    // 총 판매금액
}

// ─────────────────────────────────────────────
// TODO: 실제 API 연동 시 아래 MOCK_DRAWS를 제거하고
//       fetchDraw / loadRecent 함수의 주석을 해제하세요.
// ─────────────────────────────────────────────
const MOCK_DRAWS: WinningDraw[] = [
  { drwNo: 1160, drwNoDate: '2026-02-08', numbers: [3, 14, 22, 31, 38, 42], bonusNo: 7,  firstWinamnt: 2_345_678_901, firstPrzwnerCo: 3, firstAccumamnt: 7_037_036_703, totSellamnt: 105_432_000_000 },
  { drwNo: 1159, drwNoDate: '2026-02-01', numbers: [5, 11, 19, 27, 33, 44], bonusNo: 2,  firstWinamnt: 1_876_543_210, firstPrzwnerCo: 5, firstAccumamnt: 9_382_716_050, totSellamnt: 98_765_000_000 },
  { drwNo: 1158, drwNoDate: '2026-01-25', numbers: [1,  9, 18, 26, 35, 43], bonusNo: 12, firstWinamnt: 3_012_345_678, firstPrzwnerCo: 2, firstAccumamnt: 6_024_691_356, totSellamnt: 112_300_000_000 },
  { drwNo: 1157, drwNoDate: '2026-01-18', numbers: [7, 15, 23, 30, 37, 45], bonusNo: 4,  firstWinamnt: 4_500_000_000, firstPrzwnerCo: 1, firstAccumamnt: 4_500_000_000, totSellamnt: 120_000_000_000 },
  { drwNo: 1156, drwNoDate: '2026-01-11', numbers: [2, 10, 20, 28, 36, 41], bonusNo: 17, firstWinamnt: 1_234_567_890, firstPrzwnerCo: 7, firstAccumamnt: 8_641_975_230, totSellamnt: 95_500_000_000 },
  { drwNo: 1155, drwNoDate: '2026-01-04', numbers: [4, 13, 21, 29, 34, 40], bonusNo: 8,  firstWinamnt: 2_789_012_345, firstPrzwnerCo: 4, firstAccumamnt: 11_156_049_380, totSellamnt: 108_900_000_000 },
  { drwNo: 1154, drwNoDate: '2025-12-28', numbers: [6, 12, 24, 32, 39, 44], bonusNo: 19, firstWinamnt: 5_100_000_000, firstPrzwnerCo: 1, firstAccumamnt: 5_100_000_000, totSellamnt: 130_200_000_000 },
  { drwNo: 1153, drwNoDate: '2025-12-21', numbers: [8, 16, 25, 33, 38, 43], bonusNo: 3,  firstWinamnt: 1_567_890_123, firstPrzwnerCo: 6, firstAccumamnt: 9_407_340_738, totSellamnt: 97_100_000_000 },
  { drwNo: 1152, drwNoDate: '2025-12-14', numbers: [9, 17, 26, 31, 37, 42], bonusNo: 11, firstWinamnt: 3_456_789_012, firstPrzwnerCo: 2, firstAccumamnt: 6_913_578_024, totSellamnt: 115_400_000_000 },
  { drwNo: 1151, drwNoDate: '2025-12-07', numbers: [1,  8, 19, 27, 36, 45], bonusNo: 22, firstWinamnt: 2_100_000_000, firstPrzwnerCo: 3, firstAccumamnt: 6_300_000_000, totSellamnt: 102_600_000_000 },
  { drwNo: 1150, drwNoDate: '2025-11-30', numbers: [3, 11, 20, 29, 38, 44], bonusNo: 5,  firstWinamnt: 1_890_000_000, firstPrzwnerCo: 5, firstAccumamnt: 9_450_000_000, totSellamnt: 99_300_000_000 },
  { drwNo: 1149, drwNoDate: '2025-11-23', numbers: [2, 14, 23, 32, 40, 43], bonusNo: 9,  firstWinamnt: 6_200_000_000, firstPrzwnerCo: 1, firstAccumamnt: 6_200_000_000, totSellamnt: 135_800_000_000 },
  { drwNo: 1148, drwNoDate: '2025-11-16', numbers: [7, 13, 22, 30, 35, 41], bonusNo: 16, firstWinamnt: 2_450_000_000, firstPrzwnerCo: 4, firstAccumamnt: 9_800_000_000, totSellamnt: 107_200_000_000 },
  { drwNo: 1147, drwNoDate: '2025-11-09', numbers: [4, 10, 18, 28, 37, 42], bonusNo: 24, firstWinamnt: 1_730_000_000, firstPrzwnerCo: 6, firstAccumamnt: 10_380_000_000, totSellamnt: 94_500_000_000 },
  { drwNo: 1146, drwNoDate: '2025-11-02', numbers: [5, 15, 24, 33, 39, 44], bonusNo: 1,  firstWinamnt: 3_800_000_000, firstPrzwnerCo: 2, firstAccumamnt: 7_600_000_000, totSellamnt: 118_700_000_000 },
  { drwNo: 1145, drwNoDate: '2025-10-26', numbers: [6, 12, 21, 31, 36, 45], bonusNo: 13, firstWinamnt: 2_670_000_000, firstPrzwnerCo: 3, firstAccumamnt: 8_010_000_000, totSellamnt: 103_400_000_000 },
  { drwNo: 1144, drwNoDate: '2025-10-19', numbers: [8, 16, 25, 34, 38, 41], bonusNo: 6,  firstWinamnt: 1_990_000_000, firstPrzwnerCo: 5, firstAccumamnt: 9_950_000_000, totSellamnt: 100_100_000_000 },
  { drwNo: 1143, drwNoDate: '2025-10-12', numbers: [9, 17, 26, 35, 40, 43], bonusNo: 20, firstWinamnt: 4_150_000_000, firstPrzwnerCo: 2, firstAccumamnt: 8_300_000_000, totSellamnt: 122_500_000_000 },
  { drwNo: 1142, drwNoDate: '2025-10-05', numbers: [1, 11, 22, 32, 37, 44], bonusNo: 15, firstWinamnt: 2_880_000_000, firstPrzwnerCo: 3, firstAccumamnt: 8_640_000_000, totSellamnt: 109_600_000_000 },
  { drwNo: 1141, drwNoDate: '2025-09-28', numbers: [3, 13, 23, 30, 39, 45], bonusNo: 10, firstWinamnt: 1_650_000_000, firstPrzwnerCo: 7, firstAccumamnt: 11_550_000_000, totSellamnt: 96_800_000_000 },
];

// ─────────────────────────────────────────────
// 실제 API 연동 코드 (추후 사용)
// ─────────────────────────────────────────────
// const CACHE_KEY = 'lotto_winning_cache';
// const CACHE_TTL = 1000 * 60 * 60; // 1시간
//
// function getCache(): Record<number, { data: WinningDraw; ts: number }> {
//   try {
//     return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
//   } catch {
//     return {};
//   }
// }
//
// function setCache(drwNo: number, data: WinningDraw) {
//   const cache = getCache();
//   cache[drwNo] = { data, ts: Date.now() };
//   const keys = Object.keys(cache).map(Number).sort((a, b) => a - b);
//   if (keys.length > 100) delete cache[keys[0]];
//   localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
// }
//
// async function fetchDraw(drwNo: number): Promise<WinningDraw | null> {
//   const cache = getCache();
//   const cached = cache[drwNo];
//   if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
//   try {
//     const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
//     const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
//     const res = await fetch(proxyUrl);
//     const json = await res.json();
//     const parsed = JSON.parse(json.contents);
//     if (parsed.returnValue !== 'success') return null;
//     const draw: WinningDraw = {
//       drwNo: parsed.drwNo,
//       drwNoDate: parsed.drwNoDate,
//       numbers: [parsed.drwtNo1, parsed.drwtNo2, parsed.drwtNo3, parsed.drwtNo4, parsed.drwtNo5, parsed.drwtNo6],
//       bonusNo: parsed.bnusNo,
//       firstWinamnt: parsed.firstWinamnt,
//       firstPrzwnerCo: parsed.firstPrzwnerCo,
//       firstAccumamnt: parsed.firstAccumamnt,
//       totSellamnt: parsed.totSellamnt,
//     };
//     setCache(drwNo, draw);
//     return draw;
//   } catch {
//     return null;
//   }
// }

export function useLottoWinning() {
  const [draws, setDraws] = useState<WinningDraw[]>([]);
  const [latestDraw, setLatestDraw] = useState<WinningDraw | null>(null);
  const [searchDraw, setSearchDraw] = useState<WinningDraw | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestRound, setLatestRound] = useState<number | null>(null);

  // 임시 데이터 로드 (API 연동 전)
  // TODO: 실제 API 연동 시 아래 함수 본문을 fetchDraw 기반으로 교체하세요.
  const loadRecent = useCallback(async (_currentRound: number, _count = 20) => {
    setLoading(true);
    setError(null);
    // 임시 딜레이 (로딩 UX 확인용)
    await new Promise((r) => setTimeout(r, 300));
    setLatestDraw(MOCK_DRAWS[0]);
    setLatestRound(MOCK_DRAWS[0].drwNo);
    setDraws(MOCK_DRAWS);
    setLoading(false);

    // ── 실제 API 연동 코드 ──
    // try {
    //   const latest = await fetchDraw(currentRound);
    //   if (!latest) {
    //     const prev = await fetchDraw(currentRound - 1);
    //     if (prev) {
    //       setLatestDraw(prev);
    //       setLatestRound(prev.drwNo);
    //       const results = await Promise.all(
    //         Array.from({ length: count }, (_, i) => fetchDraw(prev.drwNo - i))
    //       );
    //       setDraws(results.filter(Boolean) as WinningDraw[]);
    //     } else {
    //       setError('당첨 정보를 불러올 수 없습니다.');
    //     }
    //     return;
    //   }
    //   setLatestDraw(latest);
    //   setLatestRound(latest.drwNo);
    //   const results = await Promise.all(
    //     Array.from({ length: count }, (_, i) => fetchDraw(latest.drwNo - i))
    //   );
    //   setDraws(results.filter(Boolean) as WinningDraw[]);
    // } catch {
    //   setError('네트워크 오류가 발생했습니다.');
    // } finally {
    //   setLoading(false);
    // }
  }, []);

  // 회차 검색 (임시: MOCK_DRAWS에서 탐색)
  // TODO: 실제 API 연동 시 fetchDraw(drwNo) 호출로 교체하세요.
  const searchRound = useCallback(async (drwNo: number) => {
    setSearchLoading(true);
    setSearchDraw(null);
    await new Promise((r) => setTimeout(r, 300));
    const result = MOCK_DRAWS.find((d) => d.drwNo === drwNo) ?? null;
    if (result) {
      setSearchDraw(result);
      setError(null);
    } else {
      setError(`${drwNo}회차 정보를 찾을 수 없습니다. (임시 데이터: ${MOCK_DRAWS[MOCK_DRAWS.length - 1].drwNo}~${MOCK_DRAWS[0].drwNo}회차만 지원)`);
    }
    setSearchLoading(false);

    // ── 실제 API 연동 코드 ──
    // try {
    //   const result = await fetchDraw(drwNo);
    //   if (result) {
    //     setSearchDraw(result);
    //   } else {
    //     setError(`${drwNo}회차 정보를 찾을 수 없습니다.`);
    //   }
    // } finally {
    //   setSearchLoading(false);
    // }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchDraw(null);
    setError(null);
  }, []);

  return {
    draws,
    latestDraw,
    searchDraw,
    loading,
    searchLoading,
    error,
    latestRound,
    loadRecent,
    searchRound,
    clearSearch,
  };
}
