# 내 주변 당첨 판매점 API 명세서

사용자 위치 기반으로 반경 내 로또 당첨 판매점을 검색하는 API입니다.
`NearbyStore` 화면 및 `NearbyStoreDetailModal`에서 사용합니다.
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

| 상황 | HTTP | message |
|------|------|---------|
| `lat` 또는 `lng` 누락 | `400` | `"Required parameter 'lat' is not present."` |
| 판매점 정보 없음 (`/{storeId}`) | `404` | `"해당 회차의 당첨 판매점 정보를 찾을 수 없습니다."` |

---

## 1. 내 주변 판매점 목록 조회

### `GET /api/lotto/stores/nearby`

사용자의 현재 위치(위도·경도)를 기준으로 반경 내 로또 당첨 판매점 목록을 반환합니다.
상호명·주소 키워드 검색, 1등 배출점 필터링, 거리순/당첨순 정렬, 페이지네이션을 지원합니다.

> **거리 계산**: Haversine 공식으로 직선 거리(미터)를 계산합니다.
> DB에 위도/경도가 없는 판매점(`NULL`)은 결과에서 제외됩니다.

#### 인증

불필요 (공개)

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `lat` | Double | **예** | - | 기준 위치 위도 (예: `37.498`) |
| `lng` | Double | **예** | - | 기준 위치 경도 (예: `127.027`) |
| `radius` | int | 아니오 | `5000` | 검색 반경 (미터). 최대 제한 없음 |
| `keyword` | String | 아니오 | - | 상호명 또는 주소 검색어 (대소문자 무시) |
| `onlyHot` | boolean | 아니오 | `false` | `true`이면 1등 당첨 이력이 있는 판매점만 반환 |
| `sort` | String | 아니오 | `"distance"` | 정렬 조건. `"distance"`: 거리 가까운 순, `"wins"`: 1등 당첨 횟수 많은 순 |
| `page` | int | 아니오 | `0` | 페이지 번호 (0부터 시작) |
| `size` | int | 아니오 | `20` | 페이지당 항목 수 |

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
        "storeName": "행운복권방",
        "address": "서울 강남구 테헤란로 123",
        "latitude": 37.498,
        "longitude": 127.027,
        "distance": 250,
        "isHot": true,
        "rank1Count": 5,
        "rank2Count": 12,
        "rank3Count": 0
      },
      {
        "storeId": "22252022",
        "storeName": "황금손 편의점",
        "address": "서울 강남구 역삼로 234",
        "latitude": 37.496,
        "longitude": 127.032,
        "distance": 600,
        "isHot": false,
        "rank1Count": 0,
        "rank2Count": 2,
        "rank3Count": 10
      }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 45,
    "totalPages": 3
  }
}
```

---

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `content[].storeId` | String | 판매점 ID (동행복권 `ltShpId`) |
| `content[].storeName` | String | 판매점 상호명 |
| `content[].address` | String | 전체 주소 |
| `content[].latitude` | Double | 위도 |
| `content[].longitude` | Double | 경도 |
| `content[].distance` | long | 요청 위치와의 직선 거리 (미터, 정수) |
| `content[].isHot` | boolean | 1등 당첨 배출 이력 존재 여부 (`rank1Count > 0`이면 `true`) |
| `content[].rank1Count` | long | 1등 당첨 횟수 (전체 기간 누적) |
| `content[].rank2Count` | long | 2등 당첨 횟수 (전체 기간 누적) |
| `content[].rank3Count` | long | 3등 당첨 횟수 (전체 기간 누적) |
| `pageNumber` | int | 현재 페이지 번호 (0부터 시작) |
| `pageSize` | int | 요청된 페이지당 항목 수 설정값 |
| `totalElements` | long | 조건에 맞는 전체 판매점 수 |
| `totalPages` | int | 전체 페이지 수 |

> `sort=wins` 정렬 시 `rank1Count` 내림차순 → 동점이면 `distance` 오름차순으로 2차 정렬됩니다.

---

#### 요청 예시

```
# 기본 (5km 반경, 거리순)
GET /api/lotto/stores/nearby?lat=37.498&lng=127.027

# 1등 배출점만, 당첨 횟수 많은 순
GET /api/lotto/stores/nearby?lat=37.498&lng=127.027&onlyHot=true&sort=wins

# 키워드 검색 + 반경 2km
GET /api/lotto/stores/nearby?lat=37.498&lng=127.027&radius=2000&keyword=행운

# 페이지네이션 (2번째 페이지)
GET /api/lotto/stores/nearby?lat=37.498&lng=127.027&page=1&size=20
```

---

## 2. 개별 판매점 상세 정보

### `GET /api/lotto/stores/{storeId}`

`NearbyStoreDetailModal`에서 판매점 카드 클릭 시 호출합니다.
위치 정보, 등수별 누적 당첨 횟수, 1등 배출 회차 전체 목록을 반환합니다.

> 이 API는 기존 당첨 판매점 API와 공유합니다. `storeId`는 목록 조회(`/nearby`) 응답의 `content[].storeId`를 그대로 사용합니다.

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
    "storeName": "행운복권방",
    "address": "서울 강남구 테헤란로 123",
    "region": "서울",
    "district": "강남구",
    "latitude": 37.498,
    "longitude": 127.027,
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
| `latitude` | Double | 위도 (지도 렌더링용) |
| `longitude` | Double | 경도 (지도 렌더링용) |
| `rank1Count` | long | 1등 배출 횟수 (전체 기간 누적) |
| `rank2Count` | long | 2등 배출 횟수 (전체 기간 누적) |
| `rank3Count` | long | 3등 배출 횟수 (전체 기간 누적) |
| `winRounds[].drwNo` | int | 1등 배출 회차 번호 |
| `winRounds[].drwNoDate` | String | 해당 회차 추첨일 (`yyyy-MM-dd`) |
| `winRounds[].method` | String | 당첨 형태. `"auto"`: 자동, `"manual"`: 수동/반자동 |

> `winRounds`는 회차 번호 내림차순(최신순)으로 정렬됩니다.
> `latitude` / `longitude`가 `null`인 경우 해당 판매점의 좌표 데이터가 없는 것이므로 지도 핀 표시를 생략합니다.

---

## 3. 화면별 API 사용 흐름

### NearbyStore (목록 화면)

```
사용자 위치 획득
    ↓
GET /api/lotto/stores/nearby?lat=...&lng=...
    ↓
판매점 카드 목록 렌더링
    ↓ (카드 클릭)
GET /api/lotto/stores/{storeId}
    ↓
NearbyStoreDetailModal 렌더링
```

### 필터/정렬 변경 시

파라미터만 교체하여 동일 엔드포인트 재호출합니다. 별도 API 없음.

| 사용자 액션 | 변경 파라미터 |
|-------------|--------------|
| 반경 슬라이더 조절 | `radius` |
| 명당만 보기 토글 ON | `onlyHot=true` |
| 정렬 "당첨 많은 순" 선택 | `sort=wins` |
| 검색어 입력 | `keyword=...` |
| 다음 페이지 | `page=page+1` |

---

## 4. storeId 안내

`storeId`는 동행복권이 부여한 판매점 고유 ID(`ltShpId`)입니다.

- 형식: 숫자 문자열 (예: `"11141011"`)
- `/nearby` 응답의 `content[].storeId`를 그대로 사용해 `/{storeId}` 상세 조회를 호출합니다.
