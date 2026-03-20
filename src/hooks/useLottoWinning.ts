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

const API_BASE_URL = 'http://localhost:8080';

export function useLottoWinning() {
  const [draws, setDraws] = useState<WinningDraw[]>([]);
  const [latestDraw, setLatestDraw] = useState<WinningDraw | null>(null);
  const [searchDraw, setSearchDraw] = useState<WinningDraw | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestRound, setLatestRound] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const loadRecent = useCallback(async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/lotto/winning?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (response.ok && result.data && result.data.content && Array.isArray(result.data.content)) {
        setTotalPages(result.data.totalPages || 1);
        const mappedData = result.data.content.map((item: any) => ({
          drwNo: item.round,
          drwNoDate: item.drawDate,
          numbers: typeof item.numbers === 'string' ? item.numbers.split(' ').map(Number) : item.numbers,
          bonusNo: item.bonusNumber,
          firstWinamnt: item.firstPrizeAmount,
          firstPrzwnerCo: item.firstPrizeWinnerCount,
          firstAccumamnt: item.firstPrizeTotalAmt,
          totSellamnt: item.totalSalesAmt,
        }));

        if (mappedData.length > 0) {
          if (page === 0) {
            setLatestDraw(mappedData[0]);
            setLatestRound(mappedData[0].drwNo);
          }
          setDraws(mappedData);
        } else {
          setDraws([]);
        }
      } else {
        setError(result.message || '당첨 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('서버와 통신할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchRound = useCallback(async (drwNo: number) => {
    setSearchLoading(true);
    setSearchDraw(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/lotto/winning/${drwNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (response.ok && result.data) {
        const item = result.data;
        const mappedItem = {
          drwNo: item.round,
          drwNoDate: item.drawDate,
          numbers: Array.isArray(item.numbers) ? item.numbers : (typeof item.numbers === 'string' ? item.numbers.split(' ').map(Number) : []),
          bonusNo: item.bonusNumber,
          firstWinamnt: item.firstPrizeAmount,
          firstPrzwnerCo: item.firstPrizeWinnerCount,
          firstAccumamnt: item.firstPrizeTotalAmt,
          totSellamnt: item.totalSalesAmt,
        };
        setSearchDraw(mappedItem);
      } else {
        setError(result.message || `${drwNo}회차 정보를 찾을 수 없습니다.`);
      }
    } catch (err) {
      console.error(err);
      setError('서버와 통신할 수 없습니다.');
    } finally {
      setSearchLoading(false);
    }
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
    totalPages,
    loadRecent,
    searchRound,
    clearSearch,
  };
}
