export type GenerationMode = 'hot' | 'cold' | 'balanced' | 'random' | 'ai';

const API_BASE_URL = 'http://localhost:8080';

/**
 * 1-45 사이의 중복되지 않는 6개의 로또 번호와 1개의 보너스 번호를 생성합니다.
 * @param mode 생성 방식
 * @param fixedNumbers 반드시 포함할 번호 (최대 5개)
 * @param excludedNumbers 절대 포함하지 않을 번호
 */
export async function generateLottoNumbers(
  mode: GenerationMode = 'random',
  fixedNumbers: number[] = [],
  excludedNumbers: number[] = [],
): Promise<number[]> {
  const modeMap: Record<GenerationMode, string> = {
    hot: 'HOT',
    cold: 'COLD',
    balanced: 'ODD_AND_EVEN',
    random: 'RANDOM',
    ai: 'AI'
  };

  const payload = {
    count: 1,
    generationMode: modeMap[mode],
    includeNumbers: fixedNumbers,
    excludeNumbers: excludedNumbers
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/lotto/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      if (result.data && Array.isArray(result.data)) {
        const errorMessages = result.data.map((err: any) => err.message).join('\n');
        throw new Error(errorMessages || '로또 번호 생성에 실패했습니다.');
      }
      throw new Error(result.message || '로또 번호 생성에 실패했습니다.');
    }

    if (result.data && result.data.lottoNumbers && result.data.lottoNumbers.length > 0) {
      const draw = result.data.lottoNumbers[0];
      return [...draw.numbers, draw.bonusNumber];
    }

    throw new Error('번호 생성 결과가 없습니다.');
  } catch (error) {
    console.error('Lotto generation error:', error);
    throw error;
  }
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
 * 마지막으로 추첨이 완료된 로또 회차를 반환합니다.
 * 로또 1회차: 2002년 12월 7일 (토요일)
 * 매주 토요일 오후 8시 45분 추첨
 */
export function getLastDrawnLottoRound(): number {
  const firstDrawDate = new Date(2002, 11, 7); // 월은 0부터 시작 (11 = 12월)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0: 일요일, 6: 토요일

  let lastSaturday = new Date(today);
  if (dayOfWeek === 6) {
    // 오늘이 토요일이면, 추첨 시간(오후 8시 45분) 전인지 확인
    if (today.getHours() < 20 || (today.getHours() === 20 && today.getMinutes() < 45)) {
      // 아직 추첨 전이면 지난주 토요일 기준
      lastSaturday.setDate(today.getDate() - 7);
    } else {
      // 추첨 후면 오늘 기준
      lastSaturday = today;
    }
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
 * 현재 판매 중인 (다가오는 추첨) 로또 회차를 계산합니다.
 */
export function getCurrentLottoRound(): number {
  return getLastDrawnLottoRound() + 1;
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
