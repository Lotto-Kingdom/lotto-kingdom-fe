export interface Draw {
    drwNo: number;
    drwNoDate: string;
    numbers: number[];
    bonusNo: number;
}

export const RECENT_DRAWS: Draw[] = [
    { drwNo: 1160, drwNoDate: '2026-02-08', numbers: [3, 14, 22, 31, 38, 42], bonusNo: 7 },
    { drwNo: 1159, drwNoDate: '2026-02-01', numbers: [5, 11, 19, 27, 33, 44], bonusNo: 2 },
    { drwNo: 1158, drwNoDate: '2026-01-25', numbers: [1, 9, 18, 26, 35, 43], bonusNo: 12 },
    { drwNo: 1157, drwNoDate: '2026-01-18', numbers: [7, 15, 23, 30, 37, 45], bonusNo: 4 },
    { drwNo: 1156, drwNoDate: '2026-01-11', numbers: [2, 10, 20, 28, 36, 41], bonusNo: 17 },
    { drwNo: 1155, drwNoDate: '2026-01-04', numbers: [4, 13, 21, 29, 34, 40], bonusNo: 8 },
    { drwNo: 1154, drwNoDate: '2025-12-28', numbers: [6, 12, 24, 32, 39, 44], bonusNo: 19 },
    { drwNo: 1153, drwNoDate: '2025-12-21', numbers: [8, 16, 25, 33, 38, 43], bonusNo: 3 },
    { drwNo: 1152, drwNoDate: '2025-12-14', numbers: [9, 17, 26, 31, 37, 42], bonusNo: 11 },
    { drwNo: 1151, drwNoDate: '2025-12-07', numbers: [1, 8, 19, 27, 36, 45], bonusNo: 22 },
    { drwNo: 1150, drwNoDate: '2025-11-30', numbers: [3, 11, 20, 29, 38, 44], bonusNo: 5 },
    { drwNo: 1149, drwNoDate: '2025-11-23', numbers: [2, 14, 23, 32, 40, 43], bonusNo: 9 },
    { drwNo: 1148, drwNoDate: '2025-11-16', numbers: [7, 13, 22, 30, 35, 41], bonusNo: 16 },
    { drwNo: 1147, drwNoDate: '2025-11-09', numbers: [4, 10, 18, 28, 37, 42], bonusNo: 24 },
    { drwNo: 1146, drwNoDate: '2025-11-02', numbers: [5, 15, 24, 33, 39, 44], bonusNo: 1 },
    { drwNo: 1145, drwNoDate: '2025-10-26', numbers: [6, 12, 21, 31, 36, 45], bonusNo: 13 },
    { drwNo: 1144, drwNoDate: '2025-10-19', numbers: [8, 16, 25, 34, 38, 41], bonusNo: 6 },
    { drwNo: 1143, drwNoDate: '2025-10-12', numbers: [9, 17, 26, 35, 40, 43], bonusNo: 20 },
    { drwNo: 1142, drwNoDate: '2025-10-05', numbers: [1, 11, 22, 32, 37, 44], bonusNo: 15 },
    { drwNo: 1141, drwNoDate: '2025-09-28', numbers: [3, 13, 23, 30, 39, 45], bonusNo: 10 },
];

// 역대 가장 많이 나온 번호 TOP 5 (동행복권 1회차부터 현재까지)
export const ALL_TIME_HOT = [
    { num: 43, count: 198 },
    { num: 34, count: 192 },
    { num: 12, count: 189 },
    { num: 27, count: 185 },
    { num: 1, count: 182 },
];

// 최근 10주~15주간 단 한 번도 나오지 않은 장기 미출현 번호
export const LONG_TERM_COLD = [
    { num: 16, weeks: 14 },
    { num: 28, weeks: 12 },
    { num: 33, weeks: 11 },
    { num: 8, weeks: 10 },
    { num: 41, weeks: 10 },
];

export interface Store {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    distance: number; // 미터 단위
    isHot: boolean; // 1등 배출 명당 여부
    wins: {
        first: number;
        second: number;
        third?: number;
    };
}

export const NEARBY_STORES: Store[] = [
    {
        id: "1",
        name: "행운복권방",
        address: "서울 강남구 테헤란로 123",
        lat: 37.498,
        lng: 127.027,
        distance: 250,
        isHot: true,
        wins: { first: 5, second: 12 }
    },
    {
        id: "2",
        name: "대박의 길",
        address: "서울 서초구 서초대로 456",
        lat: 37.495,
        lng: 127.020,
        distance: 450,
        isHot: true,
        wins: { first: 3, second: 8 }
    },
    {
        id: "3",
        name: "강남로또",
        address: "서울 강남구 강남대로 789",
        lat: 37.501,
        lng: 127.025,
        distance: 120,
        isHot: false,
        wins: { first: 0, second: 2 }
    },
    {
        id: "4",
        name: "황금손 편의점",
        address: "서울 강남구 역삼로 234",
        lat: 37.496,
        lng: 127.032,
        distance: 600,
        isHot: false,
        wins: { first: 0, second: 0 }
    },
    {
        id: "5",
        name: "명당 로또 1번지",
        address: "서울 송파구 올림픽로 567",
        lat: 37.513,
        lng: 127.102,
        distance: 2100,
        isHot: true,
        wins: { first: 11, second: 34 }
    }
];

export interface RoundStore {
    drwNo: number;
    drwNoDate: string;
    storeId: string;
    storeName: string;
    region: string;
    address: string;
    method: 'auto' | 'manual';
}

export const MOCK_ROUNDS: RoundStore[] = [
    { drwNo: 1160, drwNoDate: '2026-02-08', storeId: '1', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'auto' },
    { drwNo: 1159, drwNoDate: '2026-02-01', storeId: '2', storeName: '대박의 길', region: '서울', address: '서울 서초구 서초대로 456', method: 'manual' },
    { drwNo: 1158, drwNoDate: '2026-01-25', storeId: '1', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'auto' },
    { drwNo: 1157, drwNoDate: '2026-01-18', storeId: '1', storeName: '행운복권방', region: '서울', address: '서울 강남구 테헤란로 123', method: 'auto' },
    { drwNo: 1156, drwNoDate: '2026-01-11', storeId: '5', storeName: '동행복권방', region: '서울', address: '서울 강남구 학동로 345', method: 'manual' },
];
