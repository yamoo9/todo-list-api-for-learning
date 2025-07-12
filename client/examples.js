// 사용자 생성
await register('test@example.com', '1234')

// 사용자 로그인
await login('test@example.com', '1234')

// 사용자 로그아웃
logout()

// 가입된 사용자 조회
await getUser('test@example.com')

// 가입된 사용자 삭제
await deleteUser('test@example.com')

// 할 일 추가
await addTodo('공부하기')

// 할 일 목록 조회
const todos = await getTodos()
console.log(todos)

// 할 일 전체 수정
if (todos.length > 0) {
  await updateTodo(todos[0]._id, '운동하기', true)
}

// 할 일 일부 수정
if (todos.length > 0) {
  await patchTodo(todos[0]._id, { completed: false })
}

// 할 일 삭제
if (todos.length > 0) {
  await deleteTodo(todos[0]._id)
}
