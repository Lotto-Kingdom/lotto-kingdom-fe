import { useState, useCallback, useRef } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export interface HotNumber {
  number: number;
  count: number;
}

export interface ColdNumber {
  number: number;
  absentRounds: number;
  lastSeenRound: number;
}

export function useLottoStatistics() {
  const [hotNumbers, setHotNumbers] = useState<HotNumber[]>([]);
  const [coldNumbers, setColdNumbers] = useState<ColdNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAbortController = useRef<AbortController | null>(null);

  const loadStatistics = useCallback(async () => {
    if (fetchAbortController.current) {
      fetchAbortController.current.abort();
    }
    const controller = new AbortController();
    fetchAbortController.current = controller;

    setLoading(true);
    setError(null);

    try {
      const [hotRes, coldRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/lotto/statistics?count=0`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        }),
        fetch(`${API_BASE_URL}/api/lotto/long-absent?threshold=10`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        })
      ]);

      const hotData = await hotRes.json();
      const coldData = await coldRes.json();

      if (hotRes.ok && hotData.success) {
        setHotNumbers(hotData.data.hotNumbers || []);
      } else {
        console.error('Failed to fetch hot numbers:', hotData.message);
      }

      if (coldRes.ok && coldData.success) {
        setColdNumbers(coldData.data.absentNumbers || []);
      } else {
        console.error('Failed to fetch cold numbers:', coldData.message);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError('통계 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      if (fetchAbortController.current?.signal.aborted === false) {
        setLoading(false);
      }
    }
  }, []);

  return {
    hotNumbers,
    coldNumbers,
    loading,
    error,
    loadStatistics
  };
}
