export interface LottoNumber {
  id: string;
  numbers: number[];
  timestamp: number;
  date: string;
}

export interface LottoHistory {
  entries: LottoNumber[];
}
