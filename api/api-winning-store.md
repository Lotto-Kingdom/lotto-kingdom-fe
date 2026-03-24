# 당첨 지역 및 판매점 API 명세서

당첨 판매점 정보 조회 및 통계 API입니다.
모든 응답은 공통 래퍼(`ApiResponse`)로 감싸져 반환됩니다.

---

## 공통 응답 구조

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": { ... }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `success` | Boolean | 성공 여부 |
| `code` | String | HTTP 상태 코드 문자열 |
| `message` | String | 결과 메시지 |
| `data` | Object | 실제 응답 데이터 |

---

## 공통 오류 응답

```json
{
  "success": false,
  "code": "404",
  "message": "해당 회차의 당첨 판매점 정보를 찾을 수 없습니다.",
  "data": null
}
```

| 상황 | HTTP | message |
|------|------|---------|
| 판매점 정보 없음 | `404` | `"해당 회차의 당첨 판매점 정보를 찾을 수 없습니다."` |
| 추첨 결과 없음 | `404` | `"해당 회차의 추첨 결과를 찾을 수 없습니다."` |
| 판매점 API 오류 | `500` | `"당첨 판매점 API 호출에 실패했습니다."` |

---

## 1. 전국 및 지역별 당첨 요약 통계

### `GET /api/lotto/stores/summary`

페이지 상단 히어로 배너 및 지역별 현황 카드 렌더링에 필요한 요약 데이터를 반환합니다.
1등 당첨 기록을 기준으로 집계합니다.

#### 인증

불필요 (공개)

---

#### 응답 예시

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "totalRank1Wins": 345,
    "totalWinningRegions": 17,
    "totalRegisteredStores": 120,
    "bestStore": {
      "storeId": "11141011",
      "storeName": "언제나일등복권",
      "rank1Count": 5
    },
    "regionStats": [
      {
        "name": "서울",
        "rank1Count": 120,
        "storeCount": 45,
        "topStore": "언제나일등복권"
      },
      {
        "name": "경기",
        "rank1Count": 98,
        "storeCount": 38,
        "topStore": "행운복권방"
      }
    ]
  }
}
```

---

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalRank1Wins` | long | 전국 누적 1등 당첨 배출 횟수 |
| `totalWinningRegions` | long | 1등이 배출된 광역시도 수 |
| `totalRegisteredStores` | long | 1등을 배출한 고유 판매점 수 |
| `bestStore.storeId` | String | 판매점 ID (동행복권 `ltShpId`) |
| `bestStore.storeName` | String | 판매점 상호명 |
| `bestStore.rank1Count` | long | 1등 배출 횟수 |
| `regionStats[].name` | String | 광역시도명 (예: `"서울"`, `"경기"`) |
| `regionStats[].rank1Count` | long | 해당 지역 누적 1등 배출 횟수 |
| `regionStats[].storeCount` | long | 해당 지역 내 1등 배출 판매점 수 |
| `regionStats[].topStore` | String | 해당 지역 최다 1등 배출 판매점 상호명 |

> `regionStats`는 `rank1Count` 내림차순으로 정렬됩니다.

---

## 2. 최다 배출 판매점 TOP N

### `GET /api/lotto/stores/ranking`

1등 배출 횟수 기준 내림차순으로 정렬된 판매점 목록을 반환합니다.

#### 인증

불필요 (공개)

#### Query Parameters

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `limit` | int | `10` | 조회할 판매점 수 |

---

#### 응답 예시

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "content": [
      {
        "storeId": "11141011",
        "storeName": "언제나일등복권",
        "region": "서울",
        "district": "중랑구",
        "rank1Count": 5
      },
      {
        "storeId": "41135012",
        "storeName": "행운복권방",
        "region": "경기",
        "district": "수원시",
        "rank1Count": 4
      }
    ],
    "totalElements": 120
  }
}
```

---

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `content[].storeId` | String | 판매점 ID (동행복권 `ltShpId`) |
| `content[].storeName` | String | 판매점 상호명 |
| `content[].region` | String | 광역시도 (뱃지 표기용) |
| `content[].district` | String | 시군구 (서브 타이틀용) |
| `content[].rank1Count` | long | 1등 배출 횟수 |
| `totalElements` | long | 전체 1등 배출 판매점 수 |

---

## 3. 회차별 당첨 판매점 목록

### `GET /api/lotto/stores/rounds`

필터(지역 / 회차)가 적용된 1등 당첨 판매점 목록을 페이지네이션으로 반환합니다.

#### 인증

불필요 (공개)

#### Query Parameters

| 파라미터 | 타입 | 기본값 | 필수 | 설명 |
|----------|------|--------|------|------|
| `page` | int | `0` | 아니오 | 페이지 번호 (0부터 시작) |
| `size` | int | `10` | 아니오 | 페이지당 항목 수 |
| `region` | String | - | 아니오 | 지역 필터 (예: `"서울"`, `"경기"`) |
| `drwNo` | int | - | 아니오 | 특정 회차 번호 검색 (예: `1215`) |

> **원본 명세 변경**: `page`는 원본 명세에서 required였으나, 구현에서는 기본값 `0`으로 optional 처리되었습니다.

---

#### 응답 예시

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "content": [
      {
        "drwNo": 1215,
        "drwNoDate": "2026-03-15",
        "storeId": "11141011",
        "storeName": "언제나일등복권",
        "region": "서울",
        "address": "서울 중랑구 망우로 385 1층 2호",
        "method": "auto"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 245,
    "totalPages": 25
  }
}
```

---

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `content[].drwNo` | int | 회차 번호 |
| `content[].drwNoDate` | LocalDate | 추첨일 (`yyyy-MM-dd`) |
| `content[].storeId` | String | 판매점 ID (동행복권 `ltShpId`) |
| `content[].storeName` | String | 판매점 상호명 |
| `content[].region` | String | 광역시도 |
| `content[].address` | String | 전체 주소 |
| `content[].method` | String | 당첨 형태. `"auto"`: 자동, `"manual"`: 수동/반자동 |
| `pageNumber` | int | 현재 페이지 번호 (0부터 시작) |
| `pageSize` | int | 페이지당 항목 수 |
| `totalElements` | long | 전체 항목 수 |
| `totalPages` | int | 전체 페이지 수 |

> `method` 변환 규칙: 동행복권 API의 `atmtPsvYnTxt` 값이 `"자동"`이면 `"auto"`, 그 외(`"수동"`, `"반자동"` 등)는 `"manual"`.

---

## 4. 개별 판매점 상세 정보

### `GET /api/lotto/stores/{storeId}`

특정 판매점의 위치 정보, 등수별 배출 횟수, 1등 배출 회차 전체 목록을 반환합니다.
모달(팝업) 창에서 지도 렌더링 및 당첨 이력 표시에 사용합니다.

#### 인증

불필요 (공개)

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `storeId` | String | 판매점 ID (동행복권 `ltShpId`, 예: `"11141011"`) |

---

#### 응답 예시

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "storeId": "11141011",
    "storeName": "언제나일등복권",
    "address": "서울 중랑구 망우로 385 1층 2호",
    "region": "서울",
    "district": "중랑구",
    "latitude": 37.598879,
    "longitude": 127.094992,
    "rank1Count": 5,
    "rank2Count": 12,
    "rank3Count": 38,
    "winRounds": [
      {
        "drwNo": 1215,
        "drwNoDate": "2026-03-15",
        "method": "auto"
      },
      {
        "drwNo": 1198,
        "drwNoDate": "2025-11-22",
        "method": "auto"
      }
    ]
  }
}
```

---

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `storeId` | String | 판매점 ID (동행복권 `ltShpId`) |
| `storeName` | String | 판매점 상호명 |
| `address` | String | 전체 주소 |
| `region` | String | 광역시도 |
| `district` | String | 시군구 |
| `latitude` | Double | 위도 (OpenStreetMap 렌더링용) |
| `longitude` | Double | 경도 (OpenStreetMap 렌더링용) |
| `rank1Count` | long | 1등 배출 횟수 |
| `rank2Count` | long | 2등 배출 횟수 |
| `rank3Count` | long | 3등 배출 횟수 |
| `winRounds[].drwNo` | int | 1등 배출 회차 번호 |
| `winRounds[].drwNoDate` | LocalDate | 해당 회차 추첨일 (`yyyy-MM-dd`) |
| `winRounds[].method` | String | 당첨 형태. `"auto"` 또는 `"manual"` |

> `winRounds`는 회차 번호 내림차순(최신순)으로 정렬됩니다.

---

## 5. 회차별 당첨 판매점 원본 조회 (내부용)

### `GET /api/lotto/winning-stores/{round}`

특정 회차의 1~2등 당첨 판매점 원본 데이터를 모두 반환합니다.
동행복권 API에서 수집한 raw 데이터 그대로 응답합니다.

#### 인증

불필요 (공개)

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `round` | int | 로또 회차 번호 |

---

#### 응답 예시

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": [
    {
      "rnum": 1,
      "shpNm": "언제나일등복권",
      "shpAddr": "서울 중랑구 망우로 385 1층 2호",
      "region": "서울",
      "sigungu": "중랑구",
      "dongDetail": "망우로 385 1층 2호",
      "atmtPsvYnTxt": "자동",
      "ltShpId": "11141011",
      "wnShpRnk": 1,
      "shpLat": 37.598879,
      "shpLot": 127.094992
    }
  ]
}
```

---

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `rnum` | int | 순번 |
| `shpNm` | String | 상호명 |
| `shpAddr` | String | 전체 주소 |
| `region` | String | 광역시도 |
| `sigungu` | String | 시군구 |
| `dongDetail` | String | 상세 주소 |
| `atmtPsvYnTxt` | String | 판매 방식 (`"자동"`, `"수동"` 등) |
| `ltShpId` | String | 판매점 ID |
| `wnShpRnk` | int | 당첨 등수 (1등, 2등 등) |
| `shpLat` | Double | 위도 |
| `shpLot` | Double | 경도 |

---

## 6. 데이터 수집 API (관리자 전용)

당첨 판매점 데이터를 동행복권 API에서 수집하여 DB에 저장합니다.
스케줄러가 매주 토요일 21:00에 자동 실행하므로, 수동 실행은 초기 데이터 적재 시에만 사용합니다.

> **⚠ 현재 인증 주석 처리**: SecurityConfig에서 ADMIN 권한 설정이 주석 처리되어 있어 인증 없이 접근 가능한 상태입니다. 운영 환경 배포 전 활성화가 필요합니다.

### `POST /api/lotto/winning-stores/fetch`

1회차부터 현재 최신 회차까지 당첨 판매점 데이터를 일괄 수집합니다.
이미 저장된 회차는 skip합니다.

#### 응답 예시

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": null
}
```

---

### `POST /api/lotto/winning-stores/fetch/{round}`

특정 회차의 당첨 판매점 데이터를 수집합니다.
이미 저장된 회차는 skip합니다.

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `round` | int | 수집할 로또 회차 번호 |

---

## 7. 스케줄러 자동 수집

매주 토요일 21:00 (KST) 추첨 결과 저장 후 자동으로 실행됩니다.

```
추첨 결과 수집 → 통계 생성 → 장기 미출현 갱신 → 당첨 판매점 수집
```

| 단계 | 내용 |
|------|------|
| 1 | 당첨 번호 수집 (`/api/draw-results`) |
| 2 | 통계 생성 (역대, 최근 20 / 50 / 100회) |
| 3 | 장기 미출현 번호 갱신 (10회, 20회 기준) |
| 4 | **당첨 판매점 수집** (최신 회차 1건) |

---

## 8. storeId 안내

`storeId`는 동행복권이 부여한 판매점 고유 ID(`ltShpId`)입니다.

- 형식: 숫자 문자열 (예: `"11141011"`)
- `/api/lotto/stores/ranking`, `/api/lotto/stores/rounds` 응답의 `storeId`를 그대로 사용해 `/api/lotto/stores/{storeId}` 상세 조회를 호출하면 됩니다.
