import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiClient } from '../utils/apiClient';

export interface MyNumbersSummary {
  // ... (생략)
  totalSets: number;
  totalNumbers: number;
  mostFrequentNumber: {
    number: number;
    count: number;
  } | null;
  winningSummary: {
    totalWinningSets: number;
    totalPrize: number;
    rankCounts: {
      rank1: number;
      rank2: number;
      rank3: number;
      rank4: number;
      rank5: number;
    };
  };
}

export interface MyNumberEntry {
  id: number;
  numbers: number[];
  round: number;
  isBought: boolean;
  createdAt: string;
  winningInfo: {
    rank: number;
    matchCount: number;
    prize: number | null;
    matchedNumbers: number[];
  } | null;
}

export function useMyNumbers() {
  const [summary, setSummary] = useState<MyNumbersSummary | null>(null);
  const [content, setContent] = useState<MyNumberEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentRound, setCurrentRound] = useState<number | null>(null);

  // 요약 정보 조회
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const resp = await apiClient(`${API_BASE_URL}/api/lotto/my-numbers/summary`);
      const json = await resp.json();
      if (json.success) {
        setSummary(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch summary:', e);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // 목록 조회
  const fetchList = useCallback(async (pageNum = 0, roundToFetch?: number | null) => {
    setLoading(true);
    let url = `${API_BASE_URL}/api/lotto/my-numbers?page=${pageNum}&size=20`;
    
    // 만약 파라미터로 명시되지 않았다면 현재 상태의 라운드를 사용
    const targetRound = roundToFetch !== undefined ? roundToFetch : currentRound;
    if (targetRound) {
      url += `&round=${targetRound}`;
    }

    try {
      const resp = await apiClient(url);
      const json = await resp.json();
      if (json.success) {
        if (pageNum === 0) {
          setContent(json.data.content);
        } else {
          setContent(prev => [...prev, ...json.data.content]);
        }
        setPage(json.data.pageNumber);
        setTotalPages(json.data.totalPages);
        setTotalElements(json.data.totalElements);
        setCurrentRound(json.data.round);
      }
    } catch (e) {
      console.error('Failed to fetch list:', e);
    } finally {
      setLoading(false);
    }
  }, [currentRound]);

  // 구매 상태 토글
  const togglePurchase = async (id: number | string, updates: Partial<any>) => {
    if (typeof id === 'string') return;
    const isBought = updates.isBought;
    if (isBought === undefined) return;

    try {
      const resp = await apiClient(`${API_BASE_URL}/api/lotto/my-numbers/${id}/purchase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBought })
      });
      const json = await resp.json();
      if (json.success) {
        setContent(prev => prev.map(item => item.id === id ? { ...item, isBought: json.data.isBought } : item));
      }
    } catch (e) {
      console.error('Failed to toggle purchase:', e);
    }
  };

  // 단건 삭제
  const deleteEntry = async (id: number | string) => {
    if (typeof id === 'string') return;
    try {
      const resp = await apiClient(`${API_BASE_URL}/api/lotto/my-numbers/${id}`, { 
        method: 'DELETE'
      });
      const json = await resp.json();
      if (json.success) {
        setContent(prev => prev.filter(item => item.id !== id));
        fetchSummary(); // 요약 갱신
      }
    } catch (e) {
      console.error('Failed to delete entry:', e);
    }
  };

  // 전체 삭제
  const clearAll = async () => {
    try {
      const url = currentRound 
        ? `${API_BASE_URL}/api/lotto/my-numbers?round=${currentRound}`
        : `${API_BASE_URL}/api/lotto/my-numbers`;
        
      const resp = await apiClient(url, { 
        method: 'DELETE'
      });
      const json = await resp.json();
      if (json.success) {
        setContent([]);
        fetchSummary(); // update summary
        setTotalElements(0);
      }
    } catch (e) {
      console.error('Failed to clear all:', e);
    }
  };

  const loadMore = () => {
    if (page < totalPages - 1) {
      fetchList(page + 1);
    }
  };

  const changeRound = (round: number) => {
    fetchList(0, round);
  };

  useEffect(() => {
    fetchSummary();
    fetchList(0);
  }, [fetchSummary, fetchList]);

  return {
    summary,
    content,
    loading,
    summaryLoading,
    totalElements,
    currentRound,
    hasMore: page < totalPages - 1,
    togglePurchase,
    deleteEntry,
    clearAll,
    loadMore,
    changeRound,
    refreshList: () => fetchList(0),
    refreshSummary: fetchSummary
  };
}
