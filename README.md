# To-Do List API 사용 가이드

학습용 API 사용 가이드 문서

##### 참고 사항

모든 할 일 관련 API 요청(`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)은 반드시 **로그인 후 발급받은 토큰**이 필요합니다.

응답 에러 메시지는 상황에 따라 다를 수 있습니다.
  
상황 | 응답 결과
--- | ---
회원가입 실패 | `{ "message": "이미 가입된 이메일입니다." }`
로그인 실패 | `{ "message": "가입된 이메일이 아닙니다." }` 또는<br/>`{ "message": "가입된 비밀번호와 일치하지 않습니다." }`

##### 문의

API 사용 중 궁금한 점이나 버그가 있다면 [개발자](mailto:yamoo9@naver.com)에게 문의해 주세요.




## 기본 정보

### API 기본(Base) URL

> https://todo-list-api-for-learning.onrender.com

### 인증(Authentication)

회원가입/로그인 이후, 발급받은 JWT 토큰을 `Authorization` 헤더에 포함해야 합니다.  

```sh
# <token> 위치에 토큰 값 입력
Authorization: Bearer <token>
```




## 회원가입(Register)

API를 사용하려면 먼저 회원가입이 필요합니다.

### 엔드포인트(Endpoint)

> POST `/register`

#### 요청 본문(Request Body)

```json
{
  "email": "user@example.com",
  "password": "1234"
}
```

#### 예시 코드

```js
await register('user@example.com', '1234')
```

#### 응답 예시

```json
{
  "message": "가입에 성공했습니다."
}
```




## 로그인

회원가입 및 로그인 인증 후, API를 사용할 수 있습니다.

### 엔드포인트

> POST `/login`

#### 요청 본문

```json
{
  "email": "user@example.com",
  "password": "1234"
}
```

#### 예시 코드

```js
await login('user@example.com', '1234')
// 로그인 성공 시 token 변수에 JWT가 저장됨
```

#### 응답 예시

```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "message": "성공적으로 로그인 되었습니다."
}
```




## 할 일 목록 조회

인증된 사용자의 할 일 목록(To do List)을 API에서 가져옵니다.

### 엔드포인트 

> GET `/todos`

#### 헤더

인증된 사용자의 토큰이 필요합니다.

```sh
Authorization: Bearer <token>
```

#### 예시 코드

```js
await getTodos()
```

#### 응답 예시

```js
[
  {
    "_id": "6871b8e863fa...",
    "userId": "6871b8b063fa...",
    "todo": "학습을 위한 Todo List API 서버 만들기",
    "completed": false,
  },
  // ...
]
```




## 할 일 추가

인증된 사용자의 할 일 목록(To do List)에 새 할 일을 추가합니다.

### 엔드포인트 

> POST `/todos`

#### 헤더

인증된 사용자의 토큰이 필요합니다.

```sh
Authorization: Bearer <token>
```

#### 요청 본문  

```json
{
  "todo": "운동하기"
}
```

#### 예시 코드

```js
await addTodo('운동하기')
```

#### 응답 예시  

```json
{
  "todo": {
    "_id": "6871c4cecbe59a...",
    "userId": "6871b8b063fa...",
    "todo": "운동하기",
    "completed": false,
  },
  "message": "새 할 일이 목록에 추가되었습니다."
}
```




## 할 일 전체 수정

인증된 사용자의 기존 할 일을 전체 수정합니다.

### 엔드포인트 

> PUT `/todos/:id`

#### 헤더

인증된 사용자의 토큰이 필요합니다.

```sh
Authorization: Bearer <token>
```

#### 요청 본문  

```json
{
  "todo": "유산소 운동하기",
  "completed": true
}
```

#### 예시 코드

```js
await updateTodo('6871c4cecbe59a...', '유산소 운동하기', true)
```

#### 응답 예시  

```json
{
  "todo": {
    "_id": "6871c4cecbe59a...",
    "userId": "6871b8b063fa...",
    "todo": "유산소 운동하기",
    "completed": true
  },
  "message": "기존 할 일을 전체 수정했습니다."
}
```




## 할 일 일부 수정

인증된 사용자의 기존 할 일을 부분 수정합니다.

### 엔드포인트 

> PATCH `/todos/:id`

#### 헤더

인증된 사용자의 토큰이 필요합니다.

```sh
Authorization: Bearer <token>
```

#### 요청 본문  

```json
{
  "completed": false
}
```

#### 예시 코드

```js
await patchTodo('6871c4cecbe59a...', { completed: false })
```

#### 응답 예시  

```json
{
  "todo": {
    "_id": "6871c4cecbe59a...",
    "userId": "6871b8b063fa...",
    "todo": "유산소 운동하기",
    "completed": false
  },
  "message": "기존 할 일을 부분 수정했습니다."
}
```




## 할 일 삭제

인증된 사용자의 기존 할 일을 삭제합니다.

### 엔드포인트 

> DELETE `/todos/:id`

#### 헤더

인증된 사용자의 토큰이 필요합니다.

```sh
Authorization: Bearer <token>
```

#### 요청 본문  

```json
{
  "completed": true
}
```

#### 예시 코드

```js
await deleteTodo('6871c4cecbe59a...')
```

#### 응답 예시  

```json
{
  "deletedId": "6871c4cecbe59a...",
  "message": "기존 할 일이 삭제되었습니다."
}
```