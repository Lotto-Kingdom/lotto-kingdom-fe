# 당첨 지역 및 판매점 API 명세 (제안)

당첨 지역 페이지(`WinningRegion.tsx`) 연동을 위해 필요한 백엔드 API 명세 정리 문서입니다. 프론트엔드가 요구하는 데이터 구조(현재 사용 중인 Mock Data)를 기반으로 작성되었습니다.

---

## 1. 전국 및 지역별 당첨 요약 통계
**Endpoint:** `GET /api/lotto/stores/summary`
**Description:** 페이지 상단의 "히어로 배너" 및 "지역별 현황 (탭/카드)"을 그리기 위한 요약 요약 데이터를 제공합니다.

### Response (JSON)
```json
{
  "totalRank1Wins": 345,           // 전국 총 1등 당첨 배출 횟수
  "totalWinningRegions": 17,       // 1등이 배출된 지역 수
  "totalRegisteredStores": 120,    // 등록된 총 1등 배출 판매점 수
  "bestStore": {
    "storeId": "s01",
    "storeName": "행운복권방",
    "rank1Count": 5
  },
  "regionStats": [
     {
        "name": "서울",           // 지역 대분류 (서울, 경기 등)
        "rank1Count": 120,        // 해당 지역의 누적 1등 배출 횟수
        "storeCount": 45,         // 해당 지역 내 1등 배출을 경험한 판매점 개수
        "topStore": "행운복권방"    // 해당 지역에서 1등을 가장 많이 배출한 매장 이름
     },
     // ... 타 지역 반복 (rank1Count 기준 내림차순 정렬 권장)
  ]
}
```

---

## 2. 최다 배출 판매점 목록 (TOP N)
**Endpoint:** `GET /api/lotto/stores/ranking`
**Query Parameters:**
- `limit` (optional): 조회할 개수 (기본값: 10)

**Description:** "최다 1등 당첨 판매점 TOP N" 섹션을 그립니다. `rank1Count`를 기준으로 내림차순 정렬된 판매점 요약 정보를 응답합니다.

### Response (JSON)
```json
{
  "content": [
    {
      "storeId": "s01",
      "storeName": "행운복권방",
      "region": "서울",          // 소형 뱃지 표기용
      "district": "강남구",       // 주소 서브 타이틀용
      "rank1Count": 5          // 우측 숫자 강조 표기용
    }
  ],
  "totalElements": 120
}
```

---

## 3. 회차별 당첨 판매점 목록 (페이지네이션)
**Endpoint:** `GET /api/lotto/stores/rounds`
**Query Parameters:**
- `page` (required): 페이지 번호 (0부터 혹은 1부터 시작)
- `size` (optional): 페이지 당 개수 (기본값: 10)
- `region` (optional): 지역별 필터링 (예: "서울", "경기")
- `drwNo` (optional): 특정 당첨 회차 번호 검색 (예: 1160)

**Description:** 필터(지역/회차 검색)가 적용된 회차별 당첨 가게 정보를 리스트 형태로 반환합니다.

### Response (JSON)
```json
{
  "content": [
    {
      "drwNo": 1160,
      "drwNoDate": "2026-02-08",
      "storeId": "s01",
      "storeName": "행운복권방",
      "region": "서울",
      "address": "서울 강남구 테헤란로 123",
      "method": "auto"         // 당첨 형태 ("auto": 자동, "manual": 수동/반자동)
    }
  ],
  "pageNumber": 1,
  "pageSize": 10,
  "totalElements": 245,
  "totalPages": 25
}
```

---

## 4. 개별 판매점 상세 정보 (모달창 표시 데이터)
**Endpoint:** `GET /api/lotto/stores/{storeId}`
**Description:** 특정 판매점을 클릭했을 때 뜨는 모달(팝업) 창에서 지도 위치와 전체 당첨 상세 내역, 배출 회차 목록을 그릴 때 사용됩니다.

### Response (JSON)
```json
{
  "storeId": "s01",
  "storeName": "행운복권방",
  "address": "서울 강남구 테헤란로 123",
  "region": "서울",
  "district": "강남구",
  "latitude": 37.5012,       // OpenStreetMap 지도 렌더링용 위도
  "longitude": 127.0396,     // OpenStreetMap 지도 렌더링용 경도
  "rank1Count": 5,           // 1등 배출 횟수
  "rank2Count": 12,          // 2등 배출 횟수
  "rank3Count": 38,          // 3등 배출 횟수
  "winRounds": [             // 1등 당첨 배출 회차 (날짜, 방법 포함 권장)
     {
        "drwNo": 1160,
        "drwNoDate": "2026-02-08",
        "method": "auto"
     },
     {
        "drwNo": 1155,
        "drwNoDate": "2026-01-04",
        "method": "auto"
     }
  ]
}
```
