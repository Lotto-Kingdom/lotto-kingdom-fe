export interface LottoNumber {
  id: number | string;
  numbers: number[];
  round: number;
  isBought: boolean;
  createdAt: string; // ISO 8601 string
  winningInfo?: {
    rank: number;
    matchCount: number;
    prize: number | null;
    matchedNumbers: number[];
  } | null;
}

export interface LottoHistory {
  entries: LottoNumber[];
}
