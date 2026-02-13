export interface LottoNumber {
  id: string;
  numbers: number[];
  timestamp: number;
  date: string;
  round: number; // 로또 회차
  winningInfo?: {
    rank: number; // 1~5등
    matchCount: number; // 일치 개수
    prize?: number; // 당첨 금액
    matchedNumbers: number[]; // 일치한 번호들
  };
}

export interface LottoHistory {
  entries: LottoNumber[];
}
