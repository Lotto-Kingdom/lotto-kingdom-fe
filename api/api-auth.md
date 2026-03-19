# 인증 API (회원가입 / 로그인 / 로그아웃 / 내 정보)

Base URL: `/api/auth`

---

## 1. POST `/api/auth/signup` — 회원가입

### Request

#### Headers

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

#### Body

```json
{
  "nickname": "홍길동",
  "email": "user@example.com",
  "password": "Pass123!@#"
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `nickname` | `String` | Y | 닉네임 (2~20자) |
| `email` | `String` | Y | 이메일 형식 |
| `password` | `String` | Y | 8~20자, 영문·숫자·특수문자(`@$!%*#?&`) 각 1개 이상 포함 |

### Response

#### 성공 (HTTP 201)

```json
{
  "success": true,
  "code": "201",
  "message": "성공",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "홍길동",
    "role": "USER"
  }
}
```

#### 에러 코드

| HTTP Status | message | 발생 상황 |
|-------------|---------|-----------|
| `400` | 잘못된 입력값입니다. | 유효성 검사 실패 (닉네임 길이, 이메일 형식, 비밀번호 규칙 등) |
| `400` | 이메일 인증이 필요합니다. | 이메일 인증을 완료하지 않은 경우 |
| `400` | 이메일 인증이 만료되었습니다. 다시 인증해 주세요. | 인증 완료 후 유효 시간이 지난 경우 |
| `409` | 이미 가입된 이메일입니다. | 중복 이메일 |
| `500` | 서버 내부 오류가 발생했습니다. | 서버 오류 |

---

## 2. POST `/api/auth/login` — 로그인

세션 기반 인증을 사용합니다. 로그인 성공 시 서버에서 세션 쿠키(`JSESSIONID`)를 발급합니다.

### Request

#### Headers

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

#### Body

```json
{
  "email": "user@example.com",
  "password": "Pass123!@#",
  "rememberMe": false
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `email` | `String` | Y | — | 가입 시 사용한 이메일 |
| `password` | `String` | Y | — | 비밀번호 |
| `rememberMe` | `boolean` | N | `false` | `true` 설정 시 자동 로그인 쿠키 발급 (2주 유지) |

### Response

#### 성공 (HTTP 200)

```json
{
  "success": true,
  "code": "200",
  "message": "성공",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "홍길동",
    "role": "USER"
  }
}
```

#### 에러 코드

| HTTP Status | message | 발생 상황 |
|-------------|---------|-----------|
| `400` | 잘못된 입력값입니다. | email/password 누락 또는 이메일 형식 오류 |
| `401` | 이메일 또는 비밀번호가 올바르지 않습니다. | 잘못된 자격증명 |
| `500` | 서버 내부 오류가 발생했습니다. | 서버 오류 |

---

## 3. POST `/api/auth/logout` — 로그아웃

현재 세션과 자동 로그인 쿠키를 무효화합니다.

### Request

#### Headers

| Key | Value |
|-----|-------|
| `Cookie` | `JSESSIONID=...` (로그인 후 발급된 세션 쿠키) |

Body 없음.

### Response

#### 성공 (HTTP 200)

```json
{
  "success": true,
  "code": "200",
  "message": "로그아웃 되었습니다.",
  "data": null
}
```

---

## 4. GET `/api/auth/me` — 내 정보 조회 (자동 로그인 확인)

현재 로그인된 사용자의 정보를 반환합니다. 자동 로그인(rememberMe) 상태에서도 동작합니다.

### Request

#### Headers

| Key | Value |
|-----|-------|
| `Cookie` | `JSESSIONID=...` 또는 자동 로그인 쿠키 |

Body 없음.

### Response

#### 성공 (HTTP 200)

```json
{
  "success": true,
  "code": "200",
  "message": "성공",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "홍길동",
    "role": "USER"
  }
}
```

#### 에러 코드

| HTTP Status | message | 발생 상황 |
|-------------|---------|-----------|
| `401` | 인증이 필요합니다. | 로그인하지 않은 상태 |
| `404` | 사용자를 찾을 수 없습니다. | 세션은 유효하지만 사용자가 삭제된 경우 |

---

## data 필드 설명 (UserResponse 공통)

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `Long` | 사용자 ID |
| `email` | `String` | 이메일 |
| `nickname` | `String` | 닉네임 |
| `role` | `String` | 권한 (`USER`, `ADMIN`) |

---

## 주의사항

- 모든 로그인 이후 API 호출 시 세션 쿠키(`JSESSIONID`)를 함께 전송해야 합니다.
- `rememberMe: true` 로 로그인하면 별도의 자동 로그인 쿠키가 추가 발급됩니다 (유효기간 2주).
- 회원가입 전에 반드시 이메일 인증(`/api/email/verification/send` → `/api/email/verification/verify`)을 완료해야 합니다.
