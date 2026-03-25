# 내 번호 (My Numbers) API 명세서

내 생성 번호 목록 페이징 조회, 전체 분석 요약, 구매 상태 토글, 삭제 기능을 제공합니다.

---

## 1. 내 번호 분석 요약 (GET)
저장된 내 번호 전체를 기반으로 생성된 총 세트 수, 자주 나온 번호, 역대 당첨 요약 정보를 조회합니다. (프론트엔드 상단 분석 위젯용)

**Endpoint:** `GET /api/lotto/my-numbers/summary`

### Request (Header)
*   **Cookie**: (String) JSESSIONID (세션 기반 인증) `[필수]`

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "totalSets": 15,                     // 총 생성 세트 수
    "totalNumbers": 90,                  // 총 번호 개수 (totalSets * 6)
    "mostFrequentNumber": {              // 가장 많이 생성한 번호
      "number": 15,                      // 번호
      "count": 4                         // 출현 횟수
    },
    "winningSummary": {                  
      "totalWinningSets": 2,             // 총 당첨 횟수
      "totalPrize": 55000,               // 누적 당첨금
      "rankCounts": {                    // 등수별 당첨 건수
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

---

---

## 2. 내 번호 목록 조회 (페이징) (GET)
저장한 내 번호 전체 내역(LottoHistory)을 최신순으로 페이징하여 조회합니다. 백엔드에서는 각 번호가 과거 회차에서 당첨되었는지 데이터베이스를 확인해 `winningInfo`를 함께 반환해야 합니다.

**Endpoint:** `GET /api/lotto/my-numbers`

### Request (Header & Query)
*   **Cookie**: (String) JSESSIONID (세션 기반 인증) `[필수]`
*   `page`: (Number) 페이지 번호 (0부터 시작) `[선택, 디폴트: 0]`
*   `size`: (Number) 페이지 크기 `[선택, 디폴트: 20]`

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "e44c2de0-7fb4-4a4b-97ad-9a1bf7a8bdf1",
        "numbers": [3, 14, 22, 28, 33, 41],
        "round": 1102,
        "isBought": false,
        "createdAt": "2026-03-25T11:00:23.000Z",
        "winningInfo": null                      // 당첨되지 않았거나 아직 추첨되지 않은 경우 null
      },
      {
        "id": "b32d2c12-32b4-4e1b-43ac-910ac71822a9",
        "numbers": [2, 15, 22, 38, 41, 44],
        "round": 1099,
        "isBought": true,
        "createdAt": "2026-03-15T09:20:10.000Z",
        "winningInfo": {                         // 당첨된 이력이 있는 번호 조합의 경우
          "rank": 1,                             // 1~5등
          "matchCount": 6,                       // 일치한 번호 개수
          "prize": 2130000000,                   // 획득한 당첨금
          "matchedNumbers": [2, 15, 22, 38, 41, 44] // 실제로 일치했던 번호 색칠용
        }
      }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalPages": 5,
    "totalElements": 86,
    "isLast": false
  }
}
```

---

## 3. 내 번호 구매 상태 변경 (PATCH)
내 번호 리스트 화면에서 각 번호 세트에 있는 체크모양 버튼(구매완료 토글 버튼)을 누를 때마다 호출됩니다. 오프라인으로 샀는지 여부(isBought) 상태값을 변경합니다.

**Endpoint:** `PATCH /api/lotto/my-numbers/{id}/purchase`

### Request (Header & Path & Body)
*   **Cookie**: (String) JSESSIONID (세션 기반 인증) `[필수]`
*   `id`: (String) 상태를 변경할 번호 세트 식별자 `[필수]`
*   **Content-Type**: application/json

```json
{
  "isBought": true                // 변경하려는 구매 확정(true) 또는 취소(false) 값
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "isBought": true,
    "message": "구매 상태가 정상적으로 변경되었습니다."
  }
}
```

---

## 4. 내 번호 단건 삭제 (DELETE)
목록 중 특정 번호 한 세트 내역을 삭제합니다.

**Endpoint:** `DELETE /api/lotto/my-numbers/{id}`

### Request (Header & Path Variable)
*   **Cookie**: (String) JSESSIONID (세션 기반 인증) `[필수]`
*   `id`: (String) 삭제할 번호 세트의 UUID `[필수]`

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "해당 내역이 성공적으로 삭제되었습니다."
  }
}
```

---

## 5. 내 번호 전체 삭제 (초기화) (DELETE)
유저가 가진 내 번호 기록 전체를 한 번에 초기화합니다.

**Endpoint:** `DELETE /api/lotto/my-numbers`

### Request (Header)
*   **Cookie**: (String) JSESSIONID (세션 기반 인증) `[필수]`

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "모든 내역이 성공적으로 삭제되었습니다."
  }
}
```
