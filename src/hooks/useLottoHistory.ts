import { useState, useEffect } from 'react';
import { LottoNumber } from '../types';

const STORAGE_KEY = 'lotto_history';

export function useLottoHistory() {
  const [history, setHistory] = useState<LottoNumber[]>([]);

  // 로컬 스토리지에서 히스토리 로드
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (error) {
        console.error('Failed to parse lotto history:', error);
      }
    }
  }, []);

  // 새 번호 추가
  const addEntry = (numbers: number[]) => {
    const newEntry: LottoNumber = {
      id: crypto.randomUUID(),
      numbers,
      timestamp: Date.now(),
      date: new Date().toISOString(),
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // 특정 항목 삭제
  const deleteEntry = (id: string) => {
    const newHistory = history.filter((entry) => entry.id !== id);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // 전체 히스토리 삭제
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addEntry,
    deleteEntry,
    clearHistory,
  };
}
