import { useState, useCallback, useRef } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export interface NumberFrequency {
  number: number;
  count: number;
}

export interface RangeDist {
  range: string;
  count: number;
  percentage: number;
}

export interface OddEvenCombo {
  pattern: string;
  count: number;
}

export interface SumDist {
  range: string;
  count: number;
}

export interface ConsecPatterns {
  noneCount: number;
  nonePercentage: number;
  oneCount: number;
  onePercentage: number;
  twoCount: number;
  twoPercentage: number;
  threeOrMoreCount: number;
  threeOrMorePercentage: number;
}

export interface LottoStatisticsData {
  analysisCount: number;
  baseRound: number;
  startRound: number;
  totalNumbers: number;
  maxFrequencyNumber: number;
  maxFrequency: number;
  minFrequencyNumber: number;
  minFrequency: number;
  numberFrequencies: Record<string, number>;
  hotNumbers: NumberFrequency[];
  coldNumbers: NumberFrequency[];
  rangeDistribution: RangeDist[];
  oddCount: number;
  evenCount: number;
  oddPercentage: number;
  evenPercentage: number;
  avgOddPerRound: number;
  avgEvenPerRound: number;
  oddEvenCombinations: OddEvenCombo[];
  avgSum: number;
  minSum: number;
  maxSum: number;
  sumDistribution: SumDist[];
  consecutiveRate: number;
  avgConsecutiveCount: number;
  consecutivePatterns: ConsecPatterns;
  bonusNumberFrequencies: NumberFrequency[];
}

export function useLottoFullStatistics() {
  const [data, setData] = useState<LottoStatisticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAbortController = useRef<AbortController | null>(null);

  const loadStatistics = useCallback(async (count: number = 20) => {
    if (fetchAbortController.current) {
      fetchAbortController.current.abort();
    }
    const controller = new AbortController();
    fetchAbortController.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/lotto/statistics?count=${count}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setData(result.data);
      } else {
        setError(result.message || '통계 데이터를 불러올 수 없습니다.');
        setData(null);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError('서버와 통신할 수 없습니다.');
    } finally {
      if (fetchAbortController.current?.signal.aborted === false) {
        setLoading(false);
      }
    }
  }, []);

  return {
    data,
    loading,
    error,
    loadStatistics
  };
}
