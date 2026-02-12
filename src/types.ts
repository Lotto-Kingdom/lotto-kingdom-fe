export interface LottoNumber {
  id: string;
  numbers: number[];
  timestamp: number;
  date: string;
  round: number; // 로또 회차
}

export interface LottoHistory {
  entries: LottoNumber[];
}
