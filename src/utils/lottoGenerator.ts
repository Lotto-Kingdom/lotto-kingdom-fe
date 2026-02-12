/**
 * 1-45 사이의 중복되지 않는 6개의 로또 번호를 생성합니다.
 */
export function generateLottoNumbers(): number[] {
  const numbers = new Set<number>();

  while (numbers.size < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
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
