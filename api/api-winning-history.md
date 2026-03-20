# 당첨 번호 히스토리 API

Base URL: `/api/lotto/winning`

---

## 1. GET `/api/lotto/winning` — 당첨 번호 목록 조회 (페이징)

### Request

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `page` | `int` | N | `0` | 페이지 번호 (0-indexed) |

페이지 당 10건 고정, 최신 회차 순(내림차순) 반환.

### Response

#### 성공 (HTTP 200)

```json
{
  "success": true,
  "code": "200",
  "message": "당첨 번호 목록 조회 성공",
  "data": {
    "content": [
      {
        "round": 1160,
        "drawDate": "2026-02-08",
        "numbers": [3, 14, 22, 31, 38, 42],
        "bonusNumber": 7,
        "totalSalesAmt": 105432000000,
        "firstPrizeWinnerCount": 3,
        "firstPrizeAmount": 2345678901,
        "firstPrizeTotalAmt": 7037036703
      },
      {
        "round": 1159,
        "drawDate": "2026-02-01",
        "numbers": [5, 9, 17, 24, 33, 45],
        "bonusNumber": 11,
        "totalSalesAmt": 103200000000,
        "firstPrizeWinnerCount": 5,
        "firstPrizeAmount": 1854000000,
        "firstPrizeTotalAmt": 9270000000
      }
    ],
    "totalElements": 1160,
    "totalPages": 116,
    "number": 0,
    "size": 10,
    "first": true,
    "last": false
  }
}
```

#### 페이지 정보 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalElements` | `Long` | 전체 회차 수 |
| `totalPages` | `int` | 전체 페이지 수 |
| `number` | `int` | 현재 페이지 번호 (0-indexed) |
| `size` | `int` | 페이지 당 항목 수 (고정 10) |
| `first` | `boolean` | 첫 번째 페이지 여부 |
| `last` | `boolean` | 마지막 페이지 여부 |

---

## 2. GET `/api/lotto/winning/{round}` — 특정 회차 단건 조회

### Request

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `round` | `int` | Y | 조회할 회차 번호 |

### Response

#### 성공 (HTTP 200)

```json
{
  "success": true,
  "code": "200",
  "message": "당첨 번호 조회 성공",
  "data": {
    "round": 1160,
    "drawDate": "2026-02-08",
    "numbers": [3, 14, 22, 31, 38, 42],
    "bonusNumber": 7,
    "totalSalesAmt": 105432000000,
    "firstPrizeWinnerCount": 3,
    "firstPrizeAmount": 2345678901,
    "firstPrizeTotalAmt": 7037036703
  }
}
```

#### 에러 코드

| HTTP Status | message | 발생 상황 |
|-------------|---------|-----------|
| `404` | 해당 회차의 추첨 결과를 찾을 수 없습니다. | 존재하지 않는 회차 요청 |
| `500` | 서버 내부 오류가 발생했습니다. | 서버 오류 |

---

## data 필드 설명 (WinningHistoryResponse 공통)

| 필드 | 타입 | 설명 |
|------|------|------|
| `round` | `int` | 회차 번호 |
| `drawDate` | `String` | 추첨일 (`YYYY-MM-DD`) |
| `numbers` | `List<Integer>` | 당첨 번호 6개 |
| `bonusNumber` | `int` | 보너스 번호 |
| `totalSalesAmt` | `Long` | 총 판매금액 (원) |
| `firstPrizeWinnerCount` | `Long` | 1등 당첨자 수 |
| `firstPrizeAmount` | `Long` | 1등 1인당 당첨금 (원) |
| `firstPrizeTotalAmt` | `Long` | 1등 총 당첨금 (원) |

---

## 주의사항

- 인증 불필요 (공개 API).
- 목록 조회는 최신 회차 기준 내림차순 정렬, 페이지 크기는 10건으로 고정.
- `numbers` 배열은 `number1`~`number6` 순서대로 담겨 있으며 오름차순 정렬은 보장하지 않음.
