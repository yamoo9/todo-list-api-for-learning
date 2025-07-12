// 배포 주소
const ROOT_ENDPOINT = 'https://todo-list-api-for-learning.onrender.com'

// 토큰 키
const TOKEN_KEY = '@@token'

// 메시지
const MESSAGES = {
  requestFailed: 'API 요청 실패',
  logout: '로그아웃 되었습니다.'
}

// 기본 헤더
function baseHeaders() {
  return { 'Content-Type': 'application/json' }
}

// 인증 헤더
function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// fetch 옵션 생성 유틸리티
function makeOptions(method = 'GET', body = null, useAuth = false) {
  const headers = { ...baseHeaders() }
  if (useAuth) Object.assign(headers, authHeaders())

  const options = { method, headers }

  if (body !== null && !['GET', 'DELETE'].includes(method)) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  return options
}

// 에러 핸들링 공통 함수
async function handleResponse(response) {
  let data

  try {
    data = await response.json()
  } catch {
    data = { raw: await response.text() }
  }
  
  if (!response.ok) {
    const message = data.message ?? data.raw ?? MESSAGES.requestFailed
    throw new Error(message)
  }
  
  return data
}

// --------------------------------------------------------------------------
// 사용자 생성

async function register(email, password) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/register`,
      makeOptions('POST', { email, password })
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[register]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 사용자 로그인

async function login(email, password) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/login`,
      makeOptions('POST', { email, password })
    )
    const data = await handleResponse(response)
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token)
    }
    return data
  } catch (error) {
    console.error('[login]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 사용자 로그아웃

function logout() {
  localStorage.removeItem(TOKEN_KEY)
  return { message: MESSAGES.logout }
}

// --------------------------------------------------------------------------
// 가입된 사용자 조회

async function getUser(email) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/users/${email}`,
      makeOptions('GET')
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[getUser]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 가입된 사용자 삭제

async function deleteUser(email) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/users/${email}`,
      makeOptions('DELETE')
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[deleteUser]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 할 일 추가

async function addTodo(todo) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/todos`,
      makeOptions('POST', { todo }, true)
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[addTodo]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 할 일 목록 조회

async function getTodos() {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/todos`,
      makeOptions('GET', null, true)
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[getTodos]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 할 일 전체 수정

async function updateTodo(id, todo, completed) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/todos/${id}`,
      makeOptions('PUT', { todo, completed }, true)
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[updateTodo]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 할 일 부분 수정

async function patchTodo(id, patchObj) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/todos/${id}`,
      makeOptions('PATCH', patchObj, true)
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[patchTodo]', error)
    throw error
  }
}

// --------------------------------------------------------------------------
// 할 일 삭제

async function deleteTodo(id) {
  try {
    const response = await fetch(
      `${ROOT_ENDPOINT}/todos/${id}`,
      makeOptions('DELETE', null, true)
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('[deleteTodo]', error)
    throw error
  }
}