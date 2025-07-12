// 배포 주소
const API_URL = 'https://todo-list-api-for-learning.onrender.com'

// 로그인 후 저장
let token = null

// 요청에 토큰 자동 추가
function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// 기본 헤더
function baseHeaders() {
  return { 'Content-Type': 'application/json' }
}

// --------------------------------------------------------------------------

// 회원가입
// POST /register
async function register(email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { ...baseHeaders() },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

// --------------------------------------------------------------------------

// 로그인
// POST /login
async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { ...baseHeaders() },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (data.token) token = data.token
  return data
}

// --------------------------------------------------------------------------

// 할 일 목록 조회
// GET /todos
async function getTodos() {
  const res = await fetch(`${API_URL}/todos`, {
    headers: { ...authHeaders() },
  })
  return res.json()
}

// --------------------------------------------------------------------------

// 할 일 추가
// POST /todos
async function addTodo(todo) {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { ...baseHeaders(), ...authHeaders() },
    body: JSON.stringify({ todo }),
  })
  return res.json()
}

// 할 일 전체 수정 (PUT)
async function updateTodo(id, todo, completed) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { ...baseHeaders(), ...authHeaders() },
    body: JSON.stringify({ todo, completed }),
  })
  return res.json()
}

// 할 일 일부 수정 (PATCH)
async function patchTodo(id, patchObj) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { ...baseHeaders(), ...authHeaders() },
    body: JSON.stringify(patchObj),
  })
  return res.json()
}

// 할 일 삭제
async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return res.json()
}
