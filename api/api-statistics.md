# 로또 통계 API 명세서

당첨 번호 통계 및 장기 미출현 번호 조회 API입니다.
모든 응답은 공통 래퍼(`ApiResponse`)로 감싸져 반환됩니다.

---

## 공통 응답 구조

```json
{
  "success": true,
  "code": "200",
  "message": "...",
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

## 1. 통계 조회 API

### `GET /api/lotto/statistics`

최근 N회차 (또는 전체 역대) 당첨 번호를 분석한 통계를 반환합니다.
통계는 매주 토요일 추첨 후 스케줄러가 자동으로 갱신합니다.

#### Query Parameters

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `count` | int | `20` | 분석할 회차 수. `0` 입력 시 전체(역대) 통계 반환 |

#### 지원 count 값

| count | 설명 |
|-------|------|
| `0` | 역대 전체 누적 통계 (역대 가장 많이 나온 번호) |
| `20` | 최근 20회차 통계 |
| `50` | 최근 50회차 통계 |
| `100` | 최근 100회차 통계 |

> **주의**: 스케줄러가 사전에 생성한 `count` 값(0, 20, 50, 100) 외의 값을 요청하면 404 오류가 반환됩니다.

---

#### 응답 데이터 구조

```json
{
  "success": true,
  "code": "200",
  "message": "통계 조회 성공",
  "data": {
    "analysisCount": 20,
    "baseRound": 1160,
    "startRound": 1141,
    "totalNumbers": 120,
    "maxFrequencyNumber": 44,
    "maxFrequency": 5,
    "minFrequencyNumber": 2,
    "minFrequency": 2,
    "numberFrequencies": {
      "1": 2, "2": 2, "3": 3, "4": 1, "5": 2,
      "6": 1, "7": 2, "8": 3, "9": 1, "10": 2,
      "11": 2, "12": 3, "13": 1, "14": 2, "15": 2,
      "16": 1, "17": 2, "18": 3, "19": 2, "20": 1,
      "21": 2, "22": 2, "23": 3, "24": 2, "25": 2,
      "26": 1, "27": 3, "28": 2, "29": 2, "30": 1,
      "31": 2, "32": 2, "33": 1, "34": 2, "35": 3,
      "36": 2, "37": 4, "38": 4, "39": 2, "40": 2,
      "41": 2, "42": 1, "43": 4, "44": 5, "45": 4
    },
    "hotNumbers": [
      { "number": 44, "count": 5 },
      { "number": 37, "count": 4 },
      { "number": 38, "count": 4 },
      { "number": 43, "count": 4 },
      { "number": 45, "count": 4 }
    ],
    "coldNumbers": [
      { "number": 34, "count": 2 },
      { "number": 29, "count": 2 },
      { "number": 28, "count": 2 },
      { "number": 27, "count": 2 },
      { "number": 25, "count": 2 }
    ],
    "rangeDistribution": [
      { "range": "1~10",  "count": 24, "percentage": 20.0 },
      { "range": "11~20", "count": 22, "percentage": 18.0 },
      { "range": "21~30", "count": 24, "percentage": 20.0 },
      { "range": "31~40", "count": 31, "percentage": 26.0 },
      { "range": "41~45", "count": 19, "percentage": 16.0 }
    ],
    "oddCount": 63,
    "evenCount": 57,
    "oddPercentage": 53.0,
    "evenPercentage": 47.0,
    "avgOddPerRound": 3.15,
    "avgEvenPerRound": 2.85,
    "oddEvenCombinations": [
      { "pattern": "홀4짝2", "count": 6 },
      { "pattern": "홀3짝3", "count": 5 },
      { "pattern": "홀2짝4", "count": 3 }
    ],
    "avgSum": 150,
    "minSum": 132,
    "maxSum": 170,
    "sumDistribution": [
      { "range": "~100",    "count": 0 },
      { "range": "101~125", "count": 2 },
      { "range": "126~150", "count": 8 },
      { "range": "151~175", "count": 7 },
      { "range": "176~200", "count": 3 },
      { "range": "201~",    "count": 0 }
    ],
    "consecutiveRate": 0.0,
    "avgConsecutiveCount": 0.0,
    "consecutivePatterns": {
      "noneCount": 20,
      "nonePercentage": 100.0,
      "oneCount": 0,
      "onePercentage": 0.0,
      "twoCount": 0,
      "twoPercentage": 0.0,
      "threeOrMoreCount": 0,
      "threeOrMorePercentage": 0.0
    },
    "bonusNumberFrequencies": [
      { "number": 1, "count": 1 },
      { "number": 2, "count": 1 },
      { "number": 3, "count": 1 },
      { "number": 4, "count": 1 },
      { "number": 5, "count": 1 }
    ]
  }
}
```

---

#### 응답 필드 상세

##### 요약 정보

| 필드 | 타입 | 설명 |
|------|------|------|
| `analysisCount` | int | 분석 회차 수. `0`이면 전체 역대 |
| `baseRound` | int | 분석 기준 최신 회차 번호 |
| `startRound` | int | 분석 시작 회차 번호 (가장 오래된 회차) |
| `totalNumbers` | int | 총 추출 번호 수 (`6 × analysisCount`, 역대의 경우 실제 회차 수 × 6) |
| `maxFrequencyNumber` | int | 최다 출현 번호 |
| `maxFrequency` | int | 최다 출현 횟수 |
| `minFrequencyNumber` | int | 최소 출현 번호 |
| `minFrequency` | int | 최소 출현 횟수 |

##### 번호별 출현 빈도

| 필드 | 타입 | 설명 |
|------|------|------|
| `numberFrequencies` | Object | 번호 `"1"` ~ `"45"` 를 키로 하는 출현 횟수 맵 |

##### HOT / COLD 번호 (각 TOP 5)

| 필드 | 타입 | 설명 |
|------|------|------|
| `hotNumbers` | Array | 출현 횟수 내림차순 TOP 5. 동점 시 번호 오름차순 |
| `coldNumbers` | Array | 출현 횟수 오름차순 TOP 5. 동점 시 번호 오름차순 |
| `hotNumbers[].number` | int | 번호 (1~45) |
| `hotNumbers[].count` | int | 출현 횟수 |

##### 구간별 번호 분포

| 필드 | 타입 | 설명 |
|------|------|------|
| `rangeDistribution` | Array | 5개 구간 고정 순서로 반환 |
| `rangeDistribution[].range` | String | 구간 레이블 (`"1~10"`, `"11~20"`, `"21~30"`, `"31~40"`, `"41~45"`) |
| `rangeDistribution[].count` | int | 해당 구간 번호의 총 출현 횟수 |
| `rangeDistribution[].percentage` | double | 전체 중 비율 (%) |

##### 홀수 / 짝수 분석

| 필드 | 타입 | 설명 |
|------|------|------|
| `oddCount` | int | 홀수 총 출현 횟수 |
| `evenCount` | int | 짝수 총 출현 횟수 |
| `oddPercentage` | double | 홀수 비율 (%) |
| `evenPercentage` | double | 짝수 비율 (%) |
| `avgOddPerRound` | double | 회차당 평균 홀수 개수 |
| `avgEvenPerRound` | double | 회차당 평균 짝수 개수 |
| `oddEvenCombinations` | Array | 자주 나온 홀짝 조합 TOP 3 |
| `oddEvenCombinations[].pattern` | String | 조합 레이블 (예: `"홀4짝2"`, `"홀3짝3"`) |
| `oddEvenCombinations[].count` | int | 해당 조합이 나온 회차 수 |

##### 번호 합계 분포

| 필드 | 타입 | 설명 |
|------|------|------|
| `avgSum` | int | 6개 번호 합계의 평균 |
| `minSum` | int | 6개 번호 합계의 최솟값 |
| `maxSum` | int | 6개 번호 합계의 최댓값 |
| `sumDistribution` | Array | 합계 구간별 회차 수. 6개 구간 고정 순서로 반환 |
| `sumDistribution[].range` | String | 구간 레이블 (`"~100"`, `"101~125"`, `"126~150"`, `"151~175"`, `"176~200"`, `"201~"`) |
| `sumDistribution[].count` | int | 해당 구간에 속하는 회차 수 |

##### 연속 번호 패턴

연속 번호 = 당첨 번호 중 서로 연속된 숫자 쌍 (예: 5, 6 → 1쌍).

| 필드 | 타입 | 설명 |
|------|------|------|
| `consecutiveRate` | double | 연속 번호가 포함된 회차 비율 (%) |
| `avgConsecutiveCount` | double | 회차당 평균 연속 쌍 수 |
| `consecutivePatterns.noneCount` | int | 연속 번호 없는 회차 수 |
| `consecutivePatterns.nonePercentage` | double | 비율 (%) |
| `consecutivePatterns.oneCount` | int | 연속 1쌍인 회차 수 |
| `consecutivePatterns.onePercentage` | double | 비율 (%) |
| `consecutivePatterns.twoCount` | int | 연속 2쌍인 회차 수 |
| `consecutivePatterns.twoPercentage` | double | 비율 (%) |
| `consecutivePatterns.threeOrMoreCount` | int | 연속 3쌍 이상인 회차 수 |
| `consecutivePatterns.threeOrMorePercentage` | double | 비율 (%) |

##### 보너스 번호 분석

| 필드 | 타입 | 설명 |
|------|------|------|
| `bonusNumberFrequencies` | Array | 출현 횟수 내림차순 TOP 5 |
| `bonusNumberFrequencies[].number` | int | 보너스 번호 (1~45) |
| `bonusNumberFrequencies[].count` | int | 출현 횟수 |

---

#### 오류 응답

| 상황 | HTTP | message |
|------|------|---------|
| 해당 count의 통계 없음 | `404` | `"해당 조건의 통계 데이터를 찾을 수 없습니다."` |

```json
{
  "success": false,
  "code": "404",
  "message": "해당 조건의 통계 데이터를 찾을 수 없습니다.",
  "data": null
}
```

---

## 2. 장기 미출현 번호 조회 API

### `GET /api/lotto/long-absent`

최근 N회차 이상 당첨 번호(1~6번, 보너스 제외)에 등장하지 않은 번호 목록을 반환합니다.
데이터는 매주 토요일 추첨 후 스케줄러가 자동으로 갱신합니다.

#### Query Parameters

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `threshold` | int | `10` | 미출현 기준 회차 수. 해당 값 이상 미출현한 번호만 반환 |

#### 지원 threshold 값

| threshold | 설명 |
|-----------|------|
| `10` | 최근 10회차 이상 미출현 번호 |
| `20` | 최근 20회차 이상 미출현 번호 |

> **주의**: 스케줄러가 사전에 생성한 `threshold` 값(10, 20) 외의 값을 요청하면 404 오류가 반환됩니다.

---

#### 응답 데이터 구조

```json
{
  "success": true,
  "code": "200",
  "message": "장기 미출현 번호 조회 성공",
  "data": {
    "baseRound": 1160,
    "threshold": 10,
    "absentNumbers": [
      { "number": 16, "absentRounds": 14, "lastSeenRound": 1146 },
      { "number": 28, "absentRounds": 12, "lastSeenRound": 1148 },
      { "number": 33, "absentRounds": 11, "lastSeenRound": 1149 },
      { "number": 8,  "absentRounds": 10, "lastSeenRound": 1150 },
      { "number": 41, "absentRounds": 10, "lastSeenRound": 1150 }
    ]
  }
}
```

---

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `baseRound` | int | 계산 기준 최신 회차 번호 |
| `threshold` | int | 미출현 기준 회차 수 |
| `absentNumbers` | Array | 미출현 번호 목록. `absentRounds` 내림차순, 동점 시 번호 오름차순 정렬 |
| `absentNumbers[].number` | int | 미출현 번호 (1~45) |
| `absentNumbers[].absentRounds` | int | 미출현 회차 수 (`baseRound - lastSeenRound`) |
| `absentNumbers[].lastSeenRound` | int | 마지막으로 출현한 회차 번호. 한 번도 출현하지 않은 경우 `0` |

---

#### 오류 응답

| 상황 | HTTP | message |
|------|------|---------|
| 해당 threshold의 데이터 없음 | `404` | `"해당 조건의 장기 미출현 데이터를 찾을 수 없습니다."` |

```json
{
  "success": false,
  "code": "404",
  "message": "해당 조건의 장기 미출현 데이터를 찾을 수 없습니다.",
  "data": null
}
```

---

## 3. UI 섹션 ↔ API 필드 매핑 요약

### 통계 화면 (`GET /api/lotto/statistics?count=20`)

| UI 섹션 | 사용 필드 |
|---------|----------|
| 상단 요약 카드 | `analysisCount`, `totalNumbers`, `maxFrequencyNumber` + `maxFrequency`, `minFrequencyNumber` + `minFrequency` |
| HOT 번호 TOP 5 | `hotNumbers[]` |
| COLD 번호 TOP 5 | `coldNumbers[]` |
| 구간별 번호 분포 | `rangeDistribution[]` |
| 홀수/짝수 분석 | `oddCount`, `evenCount`, `oddPercentage`, `evenPercentage`, `avgOddPerRound`, `avgEvenPerRound`, `oddEvenCombinations[]` |
| 번호 합계 분포 | `avgSum`, `minSum`, `maxSum`, `sumDistribution[]` |
| 연속 번호 패턴 | `consecutiveRate`, `avgConsecutiveCount`, `consecutivePatterns` |
| 보너스 번호 분석 TOP 5 | `bonusNumberFrequencies[]` |

### 역대 화면 (`GET /api/lotto/statistics?count=0`)

| UI 섹션 | 사용 필드 |
|---------|----------|
| 역대 가장 많이 나온 번호 TOP 5 | `hotNumbers[]` |
| 역대 번호별 출현 횟수 전체 | `numberFrequencies` |

### 장기 미출현 화면 (`GET /api/lotto/long-absent?threshold=10`)

| UI 섹션 | 사용 필드 |
|---------|----------|
| 장기 미출현 번호 카드 목록 | `absentNumbers[].number`, `absentNumbers[].absentRounds` |
| 기준 정보 | `baseRound`, `threshold` |

---

## 4. 번호 색상 규칙 (로또 공식)

프론트엔드에서 번호 볼 색상 렌더링 시 참고하세요.

| 번호 범위 | 색상 |
|-----------|------|
| 1 ~ 10 | 노란색 (`#FBC400`) |
| 11 ~ 20 | 파란색 (`#69C8F2`) |
| 21 ~ 30 | 빨간색 (`#FF7272`) |
| 31 ~ 40 | 회색 (`#AAAAAA`) |
| 41 ~ 45 | 초록색 (`#B0D840`) |
