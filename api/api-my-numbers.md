# 내 번호 (My Numbers) API

저장된 내 번호 목록 조회, 전체 분석 요약, 구매 상태 토글, 단건/전체 삭제 기능을 제공합니다.

> **인증 필수**: 모든 엔드포인트는 로그인 세션(JSESSIONID)이 없으면 `401`을 반환합니다.

---

## 공통 에러 응답 포맷

```json
{
  "success": false,
  "code": "401",
  "message": "인증이 필요합니다.",
  "data": null
}
```

| HTTP Status | message | 발생 상황 |
|-------------|---------|-----------|
| `401` | 인증이 필요합니다. | 비로그인 상태로 요청 |
| `403` | 접근 권한이 없습니다. | 다른 사용자의 번호에 접근 시도 |
| `404` | 해당 로또 번호를 찾을 수 없습니다. | 존재하지 않는 id 요청 |
| `500` | 서버 내부 오류가 발생했습니다. | 서버 오류 |

---

## 1. 내 번호 분석 요약

### `GET /api/lotto/my-numbers/summary`

저장된 내 번호 전체를 기반으로 통계 요약 정보를 반환합니다. 상단 분석 위젯용입니다.

#### Request

| 구분 | Key | 설명 |
|------|-----|------|
| Cookie | `JSESSIONID` | 세션 인증 (필수) |

#### Response (200 OK)

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "totalSets": 15,
    "totalNumbers": 90,
    "mostFrequentNumber": {
      "number": 15,
      "count": 4
    },
    "winningSummary": {
      "totalWinningSets": 2,
      "totalPrize": 55000,
      "rankCounts": {
        "rank1": 0,
        "rank2": 0,
        "rank3": 0,
        "rank4": 1,
        "rank5": 1
      }
    }
  }
}
```

#### data 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalSets` | `Long` | 총 저장된 번호 세트 수 |
| `totalNumbers` | `Long` | 총 번호 개수 (`totalSets × 6`) |
| `mostFrequentNumber` | `Object \| null` | 가장 많이 생성된 번호 (번호가 없으면 `null`) |
| `mostFrequentNumber.number` | `int` | 번호 (1~45) |
| `mostFrequentNumber.count` | `int` | 해당 번호의 출현 횟수 |
| `winningSummary.totalWinningSets` | `Long` | 실제 당첨된 번호 세트 수 |
| `winningSummary.totalPrize` | `Long` | 누적 당첨금 합계 (원) |
| `winningSummary.rankCounts.rank1~5` | `Long` | 각 등수별 당첨 건수 |

> `winningSummary`는 `winningStatus` 필드가 아닌, **실제 추첨 결과 DB와 비교**해 계산됩니다.
> 아직 추첨되지 않은 회차의 번호는 집계에서 제외됩니다.

---

## 2. 내 번호 목록 조회 (회차별 페이징)

### `GET /api/lotto/my-numbers`

특정 회차의 내 번호 목록을 페이징하여 반환합니다. 각 세트에는 실제 당첨 여부(`winningInfo`)가 포함됩니다.
`round`를 지정하지 않으면 현재(최신) 회차를 기준으로 조회합니다.

#### Request

| 구분 | Key | 타입 | 필수 | 기본값 | 설명 |
|------|-----|------|------|--------|------|
| Cookie | `JSESSIONID` | String | Y | - | 세션 인증 |
| Query | `round` | int | N | 현재 회차 | 조회할 회차 번호 (1 이상) |
| Query | `page` | int | N | `0` | 페이지 번호 (0부터 시작) |
| Query | `size` | int | N | `20` | 페이지 크기 (1~100) |

#### Request 예시

```
GET /api/lotto/my-numbers              → 현재 회차 조회
GET /api/lotto/my-numbers?round=1102   → 1102회차 조회
GET /api/lotto/my-numbers?round=1102&page=0&size=20
```

#### Response (200 OK)

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "round": 1102,
    "content": [
      {
        "id": 301,
        "numbers": [3, 14, 22, 28, 33, 41],
        "round": 1102,
        "isBought": false,
        "createdAt": "2026-03-25T11:00:23",
        "winningInfo": null
      },
      {
        "id": 302,
        "numbers": [2, 15, 22, 38, 41, 44],
        "round": 1102,
        "isBought": true,
        "createdAt": "2026-03-25T11:05:10",
        "winningInfo": {
          "rank": 4,
          "matchCount": 4,
          "prize": 50000,
          "matchedNumbers": [2, 15, 38, 44]
        }
      }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalPages": 1,
    "totalElements": 2,
    "isLast": true
  }
}
```

#### data 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `round` | `int` | 조회된 회차 번호 |
| `content[].id` | `Long` | 번호 세트 ID |
| `content[].numbers` | `Integer[6]` | 로또 번호 6개 (오름차순) |
| `content[].round` | `int` | 회차 번호 (`round`와 동일) |
| `content[].isBought` | `boolean` | 오프라인 구매 완료 여부 |
| `content[].createdAt` | `String` (ISO 8601) | 생성 일시 |
| `content[].winningInfo` | `Object \| null` | 당첨 정보. 미당첨 또는 미추첨 시 `null` |
| `winningInfo.rank` | `int` | 당첨 등수 (1~5) |
| `winningInfo.matchCount` | `int` | 일치한 메인 번호 개수 |
| `winningInfo.prize` | `Long \| null` | 1인당 당첨금 (원). 데이터 없으면 `null` |
| `winningInfo.matchedNumbers` | `Integer[]` | 실제로 일치한 번호 목록 (색칠 표시용) |
| `pageNumber` | `int` | 현재 페이지 번호 (0부터) |
| `pageSize` | `int` | 요청한 페이지 크기 |
| `totalPages` | `int` | 전체 페이지 수 |
| `totalElements` | `Long` | 전체 데이터 수 |
| `isLast` | `boolean` | 마지막 페이지 여부 |

> **등수 판정 기준**
> | 등수 | 조건 |
> |------|------|
> | 1등 | 메인 번호 6개 일치 |
> | 2등 | 메인 번호 5개 일치 + 보너스 번호 일치 |
> | 3등 | 메인 번호 5개 일치 |
> | 4등 | 메인 번호 4개 일치 |
> | 5등 | 메인 번호 3개 일치 |

---

## 3. 구매 상태 변경

### `PATCH /api/lotto/my-numbers/{id}/purchase`

번호 세트의 오프라인 구매 완료 여부를 토글합니다.

#### Request

| 구분 | Key | 타입 | 필수 | 설명 |
|------|-----|------|------|------|
| Cookie | `JSESSIONID` | String | Y | 세션 인증 |
| Path | `id` | Long | Y | 변경할 번호 세트 ID |
| Header | `Content-Type` | String | Y | `application/json` |

#### Body

```json
{
  "isBought": true
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `isBought` | `boolean` | Y | `true`: 구매 완료, `false`: 구매 취소 |

#### Response (200 OK)

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "isBought": true,
    "message": "구매 상태가 정상적으로 변경되었습니다."
  }
}
```

---

## 4. 내 번호 단건 삭제

### `DELETE /api/lotto/my-numbers/{id}`

특정 번호 세트 한 개를 삭제합니다. 다른 사용자의 번호는 삭제할 수 없습니다.

#### Request

| 구분 | Key | 타입 | 필수 | 설명 |
|------|-----|------|------|------|
| Cookie | `JSESSIONID` | String | Y | 세션 인증 |
| Path | `id` | Long | Y | 삭제할 번호 세트 ID |

#### Response (200 OK)

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "message": "해당 내역이 성공적으로 삭제되었습니다."
  }
}
```

---

## 5. 내 번호 회차별 전체 삭제

### `DELETE /api/lotto/my-numbers`

특정 회차의 내 번호 기록 전체를 삭제합니다.
`round`를 지정하지 않으면 현재(최신) 회차의 내역을 삭제합니다.

#### Request

| 구분 | Key | 타입 | 필수 | 기본값 | 설명 |
|------|-----|------|------|--------|------|
| Cookie | `JSESSIONID` | String | Y | - | 세션 인증 |
| Query | `round` | int | N | 현재 회차 | 삭제할 회차 번호 (1 이상) |

#### Request 예시

```
DELETE /api/lotto/my-numbers             → 현재 회차 전체 삭제
DELETE /api/lotto/my-numbers?round=1102  → 1102회차 전체 삭제
```

#### Response (200 OK)

```json
{
  "success": true,
  "code": "200",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "message": "1102회차 내역이 모두 삭제되었습니다."
  }
}

---

## 주의사항

- `id`는 UUID가 아닌 **Long** 타입입니다.
- `createdAt`은 ISO 8601 로컬 타임(`LocalDateTime`) 형식으로 반환됩니다. 예: `"2026-03-25T11:00:23"`
- `winningInfo`는 해당 회차의 추첨 결과가 DB에 적재되어 있어야 계산됩니다. 미적재 시 항상 `null`입니다.
- 2등(`rank: 2`)의 `matchCount`는 메인 번호 5개 일치 기준이며, 보너스 번호는 `matchedNumbers`에 포함되지 않습니다.
- 단건 삭제 시 본인 소유가 아닌 `id`를 요청하면 `404`를 반환합니다 (존재 여부 노출 방지).
