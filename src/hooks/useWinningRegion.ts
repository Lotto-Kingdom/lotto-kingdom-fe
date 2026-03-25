import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export interface StoreSummary {
  totalRank1Wins: number;
  totalWinningRegions: number;
  totalRegisteredStores: number;
  bestStore: {
    storeId: string;
    storeName: string;
    rank1Count: number;
  };
  regionStats: {
    name: string;
    rank1Count: number;
    storeCount: number;
    topStore: string;
  }[];
}

export interface WinningStoreRanking {
  storeId: string;
  storeName: string;
  region: string;
  district: string;
  rank1Count: number;
}

export interface StoreRankingPage {
  content: WinningStoreRanking[];
  totalElements: number;
}

export interface RoundStore {
  drwNo: number;
  drwNoDate: string;
  storeId: string;
  storeName: string;
  region: string;
  address: string;
  method: 'auto' | 'manual';
}

export interface StoreRoundPage {
  content: RoundStore[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface WinRound {
  drwNo: number;
  drwNoDate: string;
  method: 'auto' | 'manual';
}

export interface StoreDetail {
  storeId: string;
  storeName: string;
  address: string;
  region: string;
  district: string;
  latitude: number;
  longitude: number;
  rank1Count: number;
  rank2Count: number;
  rank3Count: number;
  winRounds: WinRound[];
}

export function useWinningStoreSummary() {
  const [data, setData] = useState<StoreSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (count: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/lotto/stores/summary?count=${count}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || '요약 정보를 불러오는데 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      setError('서버 통신 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchSummary };
}

export function useWinningStoreRanking() {
  const [data, setData] = useState<StoreRankingPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async (limit: number = 10, count: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/lotto/stores/ranking?limit=${limit}&count=${count}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || '랭킹 정보를 불러오는데 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      setError('서버 통신 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchRanking };
}

export function useWinningStoreRounds() {
  const [data, setData] = useState<StoreRoundPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchAbortController = useRef<AbortController | null>(null);

  const fetchRounds = useCallback(async (page: number = 0, size: number = 10, region?: string | null, drwNo?: number | null, count: number = 20) => {
    if (fetchAbortController.current) {
      fetchAbortController.current.abort();
    }
    const controller = new AbortController();
    fetchAbortController.current = controller;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      params.append('count', count.toString());
      if (region) params.append('region', region);
      if (drwNo) params.append('drwNo', drwNo.toString());

      const res = await fetch(`${API_BASE_URL}/api/lotto/stores/rounds?${params.toString()}`, {
        signal: controller.signal
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setData(result.data);
      } else {
        setError(result.message || '당첨 판매점 목록을 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError('서버 통신 오류가 발생했습니다.');
    } finally {
      if (fetchAbortController.current?.signal.aborted === false) {
        setLoading(false);
      }
    }
  }, []);

  return { data, loading, error, fetchRounds };
}

export function useWinningStoreDetail() {
  const [data, setData] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (storeId: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/lotto/stores/${storeId}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || '판매점 정보를 불러오는데 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      setError('서버 통신 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchDetail, resetDetail: () => setData(null) };
}
