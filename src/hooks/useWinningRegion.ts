export interface WinningStore {
  id: string;
  name: string;
  address: string;
  region: string;
  district: string;
  lat: number;
  lng: number;
  rank1Count: number;
  rank2Count: number;
  rank3Count: number;
  winRounds: number[];
}

export interface RoundStore {
  drwNo: number;
  drwNoDate: string;
  storeId: string;
  storeName: string;
  region: string;
  address: string;
  method: 'auto' | 'manual';
}

export interface RegionStat {
  name: string;
  rank1Count: number;
  storeCount: number;
  topStore: string;
}

// ─────────────────────────────────────────────
// Mock 데이터
// ─────────────────────────────────────────────
export const MOCK_STORES: WinningStore[] = [
  {
    id: 's01', name: '행운복권방', address: '서울 강남구 테헤란로 123',
    region: '서울', district: '강남구', lat: 37.5012, lng: 127.0396,
    rank1Count: 5, rank2Count: 12, rank3Count: 38, winRounds: [1160, 1155, 1148, 1140, 1132],
  },
  {
    id: 's02', name: '황금복권센터', address: '서울 송파구 올림픽로 456',
    region: '서울', district: '송파구', lat: 37.5145, lng: 127.1058,
    rank1Count: 3, rank2Count: 8, rank3Count: 22, winRounds: [1158, 1149, 1135],
  },
  {
    id: 's03', name: '대박로또', address: '서울 마포구 홍익로 78',
    region: '서울', district: '마포구', lat: 37.5497, lng: 126.9218,
    rank1Count: 2, rank2Count: 6, rank3Count: 15, winRounds: [1156, 1141],
  },
  {
    id: 's04', name: '복권명당', address: '경기 수원시 팔달구 정조로 200',
    region: '경기', district: '수원시', lat: 37.2636, lng: 127.0286,
    rank1Count: 4, rank2Count: 10, rank3Count: 29, winRounds: [1159, 1153, 1146, 1138],
  },
  {
    id: 's05', name: '로또천국', address: '경기 성남시 분당구 황새울로 100',
    region: '경기', district: '성남시', lat: 37.3595, lng: 127.1052,
    rank1Count: 3, rank2Count: 7, rank3Count: 20, winRounds: [1157, 1150, 1142],
  },
  {
    id: 's06', name: '행복로또', address: '부산 해운대구 해운대해변로 300',
    region: '부산', district: '해운대구', lat: 35.1631, lng: 129.1631,
    rank1Count: 3, rank2Count: 9, rank3Count: 25, winRounds: [1154, 1147, 1139],
  },
  {
    id: 's07', name: '남포복권방', address: '부산 중구 광복로 50',
    region: '부산', district: '중구', lat: 35.0978, lng: 129.0300,
    rank1Count: 2, rank2Count: 5, rank3Count: 17, winRounds: [1151, 1143],
  },
  {
    id: 's08', name: '대구로또명당', address: '대구 중구 동성로 220',
    region: '대구', district: '중구', lat: 35.8714, lng: 128.5998,
    rank1Count: 2, rank2Count: 6, rank3Count: 18, winRounds: [1152, 1144],
  },
  {
    id: 's09', name: '수성복권', address: '대구 수성구 달구벌대로 888',
    region: '대구', district: '수성구', lat: 35.8581, lng: 128.6314,
    rank1Count: 1, rank2Count: 4, rank3Count: 12, winRounds: [1136],
  },
  {
    id: 's10', name: '인천로또광장', address: '인천 남동구 인주대로 500',
    region: '인천', district: '남동구', lat: 37.4566, lng: 126.7052,
    rank1Count: 2, rank2Count: 5, rank3Count: 14, winRounds: [1145, 1133],
  },
  {
    id: 's11', name: '광주행운센터', address: '광주 서구 상무대로 630',
    region: '광주', district: '서구', lat: 35.1517, lng: 126.8514,
    rank1Count: 2, rank2Count: 4, rank3Count: 13, winRounds: [1137, 1130],
  },
  {
    id: 's12', name: '대전복권명당', address: '대전 유성구 대학로 99',
    region: '대전', district: '유성구', lat: 36.3504, lng: 127.3845,
    rank1Count: 1, rank2Count: 3, rank3Count: 10, winRounds: [1134],
  },
  {
    id: 's13', name: '울산로또방', address: '울산 남구 삼산로 100',
    region: '울산', district: '남구', lat: 35.5398, lng: 129.3114,
    rank1Count: 1, rank2Count: 2, rank3Count: 8, winRounds: [1131],
  },
  {
    id: 's14', name: '세종행운가게', address: '세종 한누리대로 2130',
    region: '세종', district: '세종시', lat: 36.4801, lng: 127.2890,
    rank1Count: 1, rank2Count: 2, rank3Count: 6, winRounds: [1129],
  },
  {
    id: 's15', name: '강원복권센터', address: '강원 춘천시 춘천로 55',
    region: '강원', district: '춘천시', lat: 37.8813, lng: 127.7298,
    rank1Count: 1, rank2Count: 3, rank3Count: 9, winRounds: [1128],
  },
  {
    id: 's16', name: '제주행운복권', address: '제주 제주시 연동 노형로 480',
    region: '제주', district: '제주시', lat: 33.4890, lng: 126.4983,
    rank1Count: 1, rank2Count: 2, rank3Count: 7, winRounds: [1127],
  },
  {
    id: 's17', name: '경남로또명당', address: '경남 창원시 성산구 상남로 100',
    region: '경남', district: '창원시', lat: 35.2278, lng: 128.6811,
    rank1Count: 2, rank2Count: 4, rank3Count: 11, winRounds: [1126, 1118],
  },
  {
    id: 's18', name: '전북복권방', address: '전북 전주시 완산구 전라감영로 35',
    region: '전북', district: '전주시', lat: 35.8214, lng: 127.1089,
    rank1Count: 1, rank2Count: 3, rank3Count: 8, winRounds: [1125],
  },
  {
    id: 's19', name: '충남행운센터', address: '충남 천안시 서북구 충절로 700',
    region: '충남', district: '천안시', lat: 36.8151, lng: 127.1139,
    rank1Count: 1, rank2Count: 2, rank3Count: 7, winRounds: [1124],
  },
  {
    id: 's20', name: '서초로또', address: '서울 서초구 서초대로 700',
    region: '서울', district: '서초구', lat: 37.4837, lng: 127.0324,
    rank1Count: 2, rank2Count: 5, rank3Count: 16, winRounds: [1123, 1115],
  },
];

export const MOCK_ROUNDS: RoundStore[] = [
  { drwNo: 1160, drwNoDate: '2026-02-08', storeId: 's01', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'auto' },
  { drwNo: 1159, drwNoDate: '2026-02-01', storeId: 's04', storeName: '복권명당', region: '경기', address: '경기 수원시 팔달구 정조로 200', method: 'manual' },
  { drwNo: 1158, drwNoDate: '2026-01-25', storeId: 's02', storeName: '황금복권센터', region: '서울', address: '서울 송파구 올림픽로 456', method: 'auto' },
  { drwNo: 1157, drwNoDate: '2026-01-18', storeId: 's05', storeName: '로또천국', region: '경기', address: '경기 성남시 분당구 황새울로 100', method: 'auto' },
  { drwNo: 1156, drwNoDate: '2026-01-11', storeId: 's03', storeName: '대박로또', region: '서울', address: '서울 마포구 홍익로 78', method: 'manual' },
  { drwNo: 1155, drwNoDate: '2026-01-04', storeId: 's01', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'auto' },
  { drwNo: 1154, drwNoDate: '2025-12-28', storeId: 's06', storeName: '행복로또', region: '부산', address: '부산 해운대구 해운대해변로 300', method: 'auto' },
  { drwNo: 1153, drwNoDate: '2025-12-21', storeId: 's04', storeName: '복권명당', region: '경기', address: '경기 수원시 팔달구 정조로 200', method: 'manual' },
  { drwNo: 1152, drwNoDate: '2025-12-14', storeId: 's08', storeName: '대구로또명당', region: '대구', address: '대구 중구 동성로 220', method: 'auto' },
  { drwNo: 1151, drwNoDate: '2025-12-07', storeId: 's07', storeName: '남포복권방', region: '부산', address: '부산 중구 광복로 50', method: 'manual' },
  { drwNo: 1150, drwNoDate: '2025-11-30', storeId: 's05', storeName: '로또천국', region: '경기', address: '경기 성남시 분당구 황새울로 100', method: 'auto' },
  { drwNo: 1149, drwNoDate: '2025-11-23', storeId: 's02', storeName: '황금복권센터', region: '서울', address: '서울 송파구 올림픽로 456', method: 'auto' },
  { drwNo: 1148, drwNoDate: '2025-11-16', storeId: 's01', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'manual' },
  { drwNo: 1147, drwNoDate: '2025-11-09', storeId: 's06', storeName: '행복로또', region: '부산', address: '부산 해운대구 해운대해변로 300', method: 'auto' },
  { drwNo: 1146, drwNoDate: '2025-11-02', storeId: 's04', storeName: '복권명당', region: '경기', address: '경기 수원시 팔달구 정조로 200', method: 'auto' },
  { drwNo: 1145, drwNoDate: '2025-10-26', storeId: 's10', storeName: '인천로또광장', region: '인천', address: '인천 남동구 인주대로 500', method: 'manual' },
  { drwNo: 1144, drwNoDate: '2025-10-19', storeId: 's08', storeName: '대구로또명당', region: '대구', address: '대구 중구 동성로 220', method: 'auto' },
  { drwNo: 1143, drwNoDate: '2025-10-12', storeId: 's07', storeName: '남포복권방', region: '부산', address: '부산 중구 광복로 50', method: 'auto' },
  { drwNo: 1142, drwNoDate: '2025-10-05', storeId: 's05', storeName: '로또천국', region: '경기', address: '경기 성남시 분당구 황새울로 100', method: 'manual' },
  { drwNo: 1141, drwNoDate: '2025-09-28', storeId: 's03', storeName: '대박로또', region: '서울', address: '서울 마포구 홍익로 78', method: 'auto' },
  { drwNo: 1140, drwNoDate: '2025-09-21', storeId: 's01', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'auto' },
  { drwNo: 1139, drwNoDate: '2025-09-14', storeId: 's06', storeName: '행복로또', region: '부산', address: '부산 해운대구 해운대해변로 300', method: 'manual' },
  { drwNo: 1138, drwNoDate: '2025-09-07', storeId: 's04', storeName: '복권명당', region: '경기', address: '경기 수원시 팔달구 정조로 200', method: 'auto' },
  { drwNo: 1137, drwNoDate: '2025-08-31', storeId: 's11', storeName: '광주행운센터', region: '광주', address: '광주 서구 상무대로 630', method: 'auto' },
  { drwNo: 1136, drwNoDate: '2025-08-24', storeId: 's09', storeName: '수성복권', region: '대구', address: '대구 수성구 달구벌대로 888', method: 'manual' },
  { drwNo: 1135, drwNoDate: '2025-08-17', storeId: 's02', storeName: '황금복권센터', region: '서울', address: '서울 송파구 올림픽로 456', method: 'auto' },
  { drwNo: 1134, drwNoDate: '2025-08-10', storeId: 's12', storeName: '대전복권명당', region: '대전', address: '대전 유성구 대학로 99', method: 'auto' },
  { drwNo: 1133, drwNoDate: '2025-08-03', storeId: 's10', storeName: '인천로또광장', region: '인천', address: '인천 남동구 인주대로 500', method: 'manual' },
  { drwNo: 1132, drwNoDate: '2025-07-27', storeId: 's01', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'auto' },
  { drwNo: 1131, drwNoDate: '2025-07-20', storeId: 's13', storeName: '울산로또방', region: '울산', address: '울산 남구 삼산로 100', method: 'auto' },
];

export function getRegionStats(): RegionStat[] {
  const map: Record<string, { rank1Count: number; storeIds: Set<string>; topStore: string; topCount: number }> = {};
  MOCK_STORES.forEach((s) => {
    if (!map[s.region]) {
      map[s.region] = { rank1Count: 0, storeIds: new Set(), topStore: '', topCount: 0 };
    }
    map[s.region].rank1Count += s.rank1Count;
    map[s.region].storeIds.add(s.id);
    if (s.rank1Count > map[s.region].topCount) {
      map[s.region].topCount = s.rank1Count;
      map[s.region].topStore = s.name;
    }
  });
  return Object.entries(map)
    .map(([name, v]) => ({
      name,
      rank1Count: v.rank1Count,
      storeCount: v.storeIds.size,
      topStore: v.topStore,
    }))
    .sort((a, b) => b.rank1Count - a.rank1Count);
}
