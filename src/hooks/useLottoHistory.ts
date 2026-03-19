import { useState } from 'react';
import { LottoNumber } from '../types';
import { getCurrentLottoRound } from '../utils/lottoGenerator';

export function useLottoHistory() {
  const [history, setHistory] = useState<LottoNumber[]>([]);

  // 새 번호 추가
  const addEntry = (numbers: number[]) => {
    const newEntry: LottoNumber = {
      id: crypto.randomUUID(),
      numbers,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      round: getCurrentLottoRound(), // 현재 회차 자동 계산
    };

    setHistory((prev) => [newEntry, ...prev]);
  };

  // 특정 항목 삭제
  const deleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  // 전체 히스토리 삭제
  const clearHistory = () => {
    setHistory([]);
  };

  // 항목 업데이트 (당첨 정보 추가 등)
  const updateEntry = (id: string, updates: Partial<LottoNumber>) => {
    setHistory((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  return {
    history,
    addEntry,
    deleteEntry,
    clearHistory,
    updateEntry,
  };
}
