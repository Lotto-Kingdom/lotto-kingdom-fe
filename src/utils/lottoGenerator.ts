export type GenerationMode = 'hot' | 'cold' | 'balanced' | 'random' | 'ai';

const RECENT_NUMBERS = [
  [3, 14, 22, 31, 38, 42], [5, 11, 19, 27, 33, 44], [1, 9, 18, 26, 35, 43],
  [7, 15, 23, 30, 37, 45], [2, 10, 20, 28, 36, 41], [4, 13, 21, 29, 34, 40],
  [6, 12, 24, 32, 39, 44], [8, 16, 25, 33, 38, 43], [9, 17, 26, 31, 37, 42],
  [1, 8, 19, 27, 36, 45],
];

const ALL_TIME_HOT_NUMS = [43, 34, 12, 27, 1];

function weightedSample(weights: Record<number, number>, n: number): number[] {
  const selected: number[] = [];
  const available = { ...weights };
  while (selected.length < n) {
    const keys = Object.keys(available).map(Number);
    if (keys.length === 0) break;
    const total = keys.reduce((sum, k) => sum + available[k], 0);
    let rand = Math.random() * total;
    for (const num of keys) {
      rand -= available[num];
      if (rand <= 0) {
        selected.push(num);
        delete available[num];
        break;
      }
    }
  }
  return selected;
}

function sampleN(arr: number[], n: number): number[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function addBonusNumber(main: number[]): number[] {
  let bonus: number;
  do { bonus = Math.floor(Math.random() * 45) + 1; } while (main.includes(bonus));
  return [...main, bonus];
}

/** pool에서 count개를 핫 번호 가중치로 선택 */
function pickHot(pool: number[], count: number): number[] {
  const weights: Record<number, number> = {};
  pool.forEach((n) => { weights[n] = 1; });
  RECENT_NUMBERS.forEach((draw) => {
    draw.forEach((n) => { if (weights[n] !== undefined) weights[n] += 3; });
  });
  return weightedSample(weights, count);
}

/** pool에서 count개를 콜드 번호 가중치로 선택 */
function pickCold(pool: number[], count: number): number[] {
  const weights: Record<number, number> = {};
  pool.forEach((n) => { weights[n] = 6; });
  RECENT_NUMBERS.forEach((draw) => {
    draw.forEach((n) => { if (weights[n] !== undefined) weights[n] = Math.max(1, weights[n] - 2); });
  });
  return weightedSample(weights, count);
}

/** pool에서 count개를 홀짝 밸런스(fixed 기준 보정)로 선택 */
function pickBalanced(pool: number[], count: number, fixed: number[]): number[] {
  const fixedOdds = fixed.filter((n) => n % 2 !== 0).length;
  const fixedEvens = fixed.filter((n) => n % 2 === 0).length;
  const needOdds = Math.max(0, 3 - fixedOdds);
  const needEvens = Math.max(0, 3 - fixedEvens);

  const poolOdds = pool.filter((n) => n % 2 !== 0);
  const poolEvens = pool.filter((n) => n % 2 === 0);

  const selected = [
    ...sampleN(poolOdds, Math.min(needOdds, poolOdds.length)),
    ...sampleN(poolEvens, Math.min(needEvens, poolEvens.length)),
  ];

  // 홀짝 제약으로 부족한 경우 나머지 pool에서 보충
  if (selected.length < count) {
    const rest = pool.filter((n) => !selected.includes(n));
    selected.push(...sampleN(rest, count - selected.length));
  }
  return selected.slice(0, count);
}

/** pool에서 count개를 순수 랜덤으로 선택 */
function pickRandom(pool: number[], count: number): number[] {
  return sampleN(pool, count);
}

/** pool에서 count개를 AI 알고리즘으로 선택 */
function pickAI(pool: number[], count: number): number[] {
  const ranges = [[1, 9], [10, 19], [20, 29], [30, 39], [40, 45]];
  const picks: number[] = [];

  // 가능한 구간에서 골고루 선택
  const availableRanges = ranges.filter(([min, max]) => pool.some((n) => n >= min && n <= max));
  const chosenRangeIdxs = sampleN(availableRanges.map((_, i) => i), Math.min(count - 1, availableRanges.length));

  chosenRangeIdxs.forEach((ri) => {
    const [min, max] = availableRanges[ri];
    const rangePool = pool.filter((n) => n >= min && n <= max && !picks.includes(n));
    if (rangePool.length > 0) picks.push(rangePool[Math.floor(Math.random() * rangePool.length)]);
  });

  // 나머지는 역대 핫넘버 가중치로 보충
  const remaining = pool.filter((n) => !picks.includes(n));
  const weights: Record<number, number> = {};
  remaining.forEach((n) => { weights[n] = 2; });
  ALL_TIME_HOT_NUMS.forEach((n) => { if (weights[n] !== undefined) weights[n] = 8; });
  picks.push(...weightedSample(weights, count - picks.length));

  return picks.slice(0, count);
}

/**
 * 1-45 사이의 중복되지 않는 6개의 로또 번호와 1개의 보너스 번호를 생성합니다.
 * @param mode 생성 방식
 * @param fixedNumbers 반드시 포함할 번호 (최대 5개)
 * @param excludedNumbers 절대 포함하지 않을 번호
 */
export function generateLottoNumbers(
  mode: GenerationMode = 'random',
  fixedNumbers: number[] = [],
  excludedNumbers: number[] = [],
): number[] {
  const fixed = fixedNumbers.slice(0, 5);
  const pool = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter((n) => !fixed.includes(n) && !excludedNumbers.includes(n));

  const need = 6 - fixed.length;

  // pool이 부족한 경우 랜덤 폴백
  if (pool.length < need) {
    const fallback = Array.from({ length: 45 }, (_, i) => i + 1).filter((n) => !fixed.includes(n));
    const extra = sampleN(fallback, need);
    const main = [...fixed, ...extra].sort((a, b) => a - b);
    return addBonusNumber(main);
  }

  let picked: number[];
  switch (mode) {
    case 'hot':      picked = pickHot(pool, need); break;
    case 'cold':     picked = pickCold(pool, need); break;
    case 'balanced': picked = pickBalanced(pool, need, fixed); break;
    case 'ai':       picked = pickAI(pool, need); break;
    default:         picked = pickRandom(pool, need);
  }

  const main = [...fixed, ...picked].sort((a, b) => a - b);
  return addBonusNumber(main);
}

/**
 * 로또 번호의 색상을 결정합니다.
 * 1-10: 노란색
 * 11-20: 파란색
 * 21-30: 빨간색
 * 31-40: 회색
 * 41-45: 초록색
 */
export function getLottoNumberColor(num: number): string {
  if (num <= 10) return 'bg-yellow-500';
  if (num <= 20) return 'bg-blue-500';
  if (num <= 30) return 'bg-red-500';
  if (num <= 40) return 'bg-gray-500';
  return 'bg-green-500';
}

/**
 * 날짜를 포맷팅합니다.
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

/**
 * 현재 로또 회차를 계산합니다.
 * 로또 1회차: 2002년 12월 7일 (토요일)
 * 매주 토요일 추첨
 */
export function getCurrentLottoRound(): number {
  // 로또 1회차 추첨일: 2002년 12월 7일
  const firstDrawDate = new Date(2002, 11, 7); // 월은 0부터 시작 (11 = 12월)
  const today = new Date();

  // 이번 주 토요일 찾기
  const dayOfWeek = today.getDay(); // 0: 일요일, 6: 토요일

  // 가장 최근 지난 토요일 또는 오늘(토요일인 경우) 찾기
  let lastSaturday = new Date(today);
  if (dayOfWeek === 6) {
    // 오늘이 토요일이면 오늘 기준
    lastSaturday = today;
  } else if (dayOfWeek === 0) {
    // 일요일이면 어제(토요일) 기준
    lastSaturday.setDate(today.getDate() - 1);
  } else {
    // 월~금요일이면 지난 토요일 기준
    lastSaturday.setDate(today.getDate() - dayOfWeek - 1);
  }

  // 시간을 00:00:00으로 설정하여 날짜만 비교
  lastSaturday.setHours(0, 0, 0, 0);

  // 첫 추첨일부터 현재까지의 주 수 계산
  const diffTime = lastSaturday.getTime() - firstDrawDate.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

  // 1회차부터 시작하므로 +1
  return diffWeeks + 1;
}

/**
 * 다음 로또 추첨일(토요일)을 반환합니다.
 */
export function getNextDrawDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // 다음 토요일까지 남은 일수
  const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek + 7) % 7;

  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);
  nextSaturday.setHours(20, 45, 0, 0); // 추첨 시간: 오후 8시 45분

  return nextSaturday;
}
