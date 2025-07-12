require('dotenv').config()
const MESSAGES = require('./config')

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())


// --------------------------------------------------------------------------
// 데이터베이스 구성

// MongoDB 연결
mongoose.connect(process.env.TODOLIST_DB)

// User 스키마 정의
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
})

// User 모델 정의
const User = mongoose.model('User', userSchema)

// Todo 스키마 정의
const todoSchema = new mongoose.Schema({
  userId: String,
  todo: String,
  completed: Boolean,
})

// Todo 모델 정의
const Todo = mongoose.model('Todo', todoSchema)

// --------------------------------------------------------------------------
// JWT 인증 미들웨어

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch {
    // Unauthorized
    res.status(401).json({ message: MESSAGES.auth.unauthorized })
  }
}

// --------------------------------------------------------------------------
// 기본 할 일 생성 함수

const createDefaultTodos = async (userId) => {
  try {
    const defaultTodos = [
      { userId, todo: 'Todo List API 시작하기', completed: false },
      { userId, todo: '첫 번째 할 일 추가하기', completed: false },
    ]

    await Todo.insertMany(defaultTodos)
  } catch (error) {
    console.error('기본 할 일 생성 중 오류 발생:', error)
  }
}


// --------------------------------------------------------------------------
// 사용자 생성

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  const hash = await bcrypt.hash(password, 10)

  try {
    const user = await User.create({ email, password: hash })
    await createDefaultTodos(user._id)
    res.json({ message: MESSAGES.register.success })
  } catch {
    res.status(400).json({ message: MESSAGES.register.failed })
  }
})


// --------------------------------------------------------------------------
// 가입된 사용자 조회

app.get('/users/:email', async (req, res) => {
  try {
    const { email } = req.params
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(404).json({ message: MESSAGES.users.notFound })
    }
    
    const userResponse = {
      _id: user._id,
      email: user.email
    }
    
    res.json({ user: userResponse, message: MESSAGES.users.found })
  } catch (error) {
    res.status(500).json({ message: MESSAGES.users.error })
  }
})


// --------------------------------------------------------------------------
// 가입된 사용자 및 데이터 모두 삭제

app.delete('/users/:email', async (req, res) => {
  try {
    const { email } = req.params
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(404).json({ message: MESSAGES.users.notFound })
    }
    
    await Todo.deleteMany({ userId: user._id })
    await User.deleteOne({ _id: user._id })

    const userResponse = {
      _id: user._id,
      email: user.email
    }
    
    res.json({ deletedUser: userResponse, message: MESSAGES.users.deleted })
  } catch (error) {
    res.status(500).json({ message: MESSAGES.users.error })
  }
})


// --------------------------------------------------------------------------
// 사용자 로그인

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  // Invalid credentials
  if (!user) return res.status(400).json({ message: MESSAGES.login.failed.email })
  const valid = await bcrypt.compare(password, user.password)

  if (!valid) return res.status(400).json({ message: MESSAGES.login.failed.password })
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)

  res.json({ token, message: MESSAGES.login.success })
})

// --------------------------------------------------------------------------
// GET (인증 필요)

app.get('/todos', auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id })
  res.json({ todos, message: MESSAGES.get.message })
})

// --------------------------------------------------------------------------

// POST (인증 필요)
app.post('/todos', auth, async (req, res) => {
  const todo = await Todo.create({
    userId: req.user.id,
    todo: req.body.todo,
    completed: false,
  })
  res.json({ todo, message: MESSAGES.post.message })
})

// --------------------------------------------------------------------------

// PUT (인증 필요)
app.put('/todos/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { todo: req.body.todo, completed: req.body.completed },
    { new: true }
  )
  res.json({ todo, message: MESSAGES.put.message })
})

// --------------------------------------------------------------------------

// PATCH (인증 필요)
app.patch('/todos/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  )
  res.json({ todo, message: MESSAGES.patch.message })
})

// --------------------------------------------------------------------------

// DELETE (인증 필요)
app.delete('/todos/:id', auth, async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id, userId: req.user.id })
  res.json({ deletedId: req.params.id, message: MESSAGES.delete.message })
})

// --------------------------------------------------------------------------

// 서버 실행
app.listen(3000, () => console.log(MESSAGES.server.message))
