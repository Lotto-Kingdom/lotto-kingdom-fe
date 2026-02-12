/**
 * 1~45 사이의 중복되지 않는 랜덤 번호 6개 생성
 */
export const generateLottoNumbers = (): number[] => {
  const numbers = new Set<number>();

  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }

  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * 여러 게임의 로또 번호 생성
 */
export const generateMultipleLottoNumbers = (count: number): number[][] => {
  return Array.from({ length: count }, () => generateLottoNumbers());
};

/**
 * 번호 색상 결정 (1-10: 노랑, 11-20: 파랑, 21-30: 빨강, 31-40: 회색, 41-45: 초록)
 */
export const getNumberColor = (num: number): string => {
  if (num >= 1 && num <= 10) return 'bg-yellow-400 text-yellow-900';
  if (num >= 11 && num <= 20) return 'bg-blue-500 text-white';
  if (num >= 21 && num <= 30) return 'bg-red-500 text-white';
  if (num >= 31 && num <= 40) return 'bg-gray-500 text-white';
  return 'bg-green-500 text-white';
};
