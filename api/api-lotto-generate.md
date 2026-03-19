# 로또 번호 생성 API

## POST `/api/lotto/generate`

로또 번호를 생성합니다. 회차는 서버에서 자동으로 계산됩니다 (매주 토요일 추첨 기준).

---

## Request

### Headers

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

### Body

```json
{
  "userId": 1,
  "count": 5,
  "generationMode": "RANDOM",
  "includeNumbers": [3, 7],
  "excludeNumbers": [13, 22]
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `userId` | `Long` | N | `null` | 사용자 ID (비로그인 시 생략 가능) |
| `count` | `Integer` | N | `1` | 생성할 세트 수 (1 ~ 10) |
| `generationMode` | `String` | N | `"RANDOM"` | 번호 생성 모드 (하단 참고) |
| `includeNumbers` | `Integer[]` | N | `[]` | 반드시 포함할 번호 목록 (최대 5개, 1~45) |
| `excludeNumbers` | `Integer[]` | N | `[]` | 반드시 제외할 번호 목록 (1~45) |

### generationMode 종류

| 값 | 설명 |
|----|------|
| `RANDOM` | 완전 랜덤 생성 |
| `HOT` | 역대 고빈도 번호 중심 생성 |
| `COLD` | 역대 저빈도 번호 중심 생성 |
| `ODD_AND_EVEN` | 홀수 3개 + 짝수 3개 균형 생성 |
| `AI` | 합계 범위(100~175), 연속번호 최대 2개, 고저 균형 조건 적용 생성 |

### Request 예시 (최소)

```json
{}
```

### Request 예시 (전체)

```json
{
  "userId": 42,
  "count": 3,
  "generationMode": "HOT",
  "includeNumbers": [7, 27],
  "excludeNumbers": [1, 13]
}
```

---

## Response

### 성공 (HTTP 200)

```json
{
  "success": true,
  "code": "200",
  "message": "로또 번호가 생성되었습니다.",
  "data": {
    "round": 1216,
    "drawDate": "2026-03-21",
    "count": 3,
    "mode": "HOT",
    "lottoNumbers": [
      {
        "id": 101,
        "numbers": [4, 17, 27, 34, 38, 43],
        "bonusNumber": 9
      },
      {
        "id": 102,
        "numbers": [2, 7, 23, 35, 40, 45],
        "bonusNumber": 16
      },
      {
        "id": 103,
        "numbers": [7, 16, 27, 34, 37, 42],
        "bonusNumber": 3
      }
    ]
  }
}
```

### data 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `round` | `int` | 이번 추첨 회차 번호 (서버 자동 계산) |
| `drawDate` | `String` (ISO 8601) | 이번 추첨일 (매주 토요일), 예: `"2026-03-21"` |
| `count` | `int` | 생성된 세트 수 |
| `mode` | `String` | 사용된 생성 모드 |
| `lottoNumbers` | `Array` | 생성된 번호 세트 목록 |
| `lottoNumbers[].id` | `Long` | 저장된 번호 세트 ID |
| `lottoNumbers[].numbers` | `Integer[6]` | 로또 번호 6개 (오름차순 정렬) |
| `lottoNumbers[].bonusNumber` | `int` | 보너스 번호 (1~45, 메인 번호와 중복 없음) |

---

## Error Response

모든 에러 응답은 아래 포맷을 따릅니다.

```json
{
  "success": false,
  "code": "400",
  "message": "잘못된 입력값입니다.",
  "data": null
}
```

### Validation 에러 (HTTP 400)

`includeNumbers` 초과, `count` 범위 위반 등 유효성 검사 실패 시 `data` 에 필드별 에러 목록이 포함됩니다.

```json
{
  "success": false,
  "code": "400",
  "message": "잘못된 입력값입니다.",
  "data": [
    {
      "field": "count",
      "message": "최대 10세트까지 생성할 수 있습니다."
    },
    {
      "field": "includeNumbers",
      "message": "포함 번호는 최대 5개까지 지정할 수 있습니다."
    }
  ]
}
```

### 에러 코드 목록

| HTTP Status | message | 발생 상황 |
|-------------|---------|-----------|
| `400` | 잘못된 입력값입니다. | 유효성 검사 실패 (범위 초과, 포함/제외 번호 중복 등) |
| `405` | 지원하지 않는 HTTP 메서드입니다. | GET 등 잘못된 메서드 사용 |
| `500` | 서버 내부 오류가 발생했습니다. | 서버 오류 |

---

## 주의사항

- `includeNumbers` 와 `excludeNumbers` 에 동일한 번호가 있으면 `400` 에러를 반환합니다.
- `includeNumbers` 에 중복 번호가 있으면 `400` 에러를 반환합니다.
- `excludeNumbers` 로 너무 많은 번호를 제외해 선택 가능한 번호가 6개 미만이 되면 `400` 에러를 반환합니다.
- `round` 와 `drawDate` 는 요청 당시 서버 시각 기준으로 **다음 토요일 추첨** 회차가 자동 반영됩니다.
