const MESSAGES = {
  auth: {
    unauthorized: '인증된 사용자가 아닙니다.'
  },
  register: {
    success: '가입에 성공했습니다.',
    failed: '이미 가입된 이메일입니다.'
  },
  login: {
    success: '성공적으로 로그인 되었습니다.',
    failed: {
      email: '가입된 이메일이 아닙니다.',
      password: '가입된 비밀번호와 일치하지 않습니다.',
    }
  },
  get: {
    message: '모든 할 일 목록을 가져왔습니다.'
  },
  post: {
    message: '새 할 일이 목록에 추가되었습니다.'
  },
  put: {
    message: '기존 할 일을 전체 수정했습니다.'
  },
  patch: {
    message: '기존 할 일을 부분 수정했습니다.'
  },
  delete: {
    message: '기존 할 일이 삭제되었습니다.'
  },
  server: {
    message: '할 일 목록 API 서버를 시작합니다.',
  }
}

module.exports = MESSAGES