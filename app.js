require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

// --------------------------------------------------------------------------

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
    res.status(401).json({ message: '인증된 사용자가 아닙니다.' })
  }
}

// --------------------------------------------------------------------------

// 회원가입
app.post('/register', async (req, res) => {
  const { email, password } = req.body
  const hash = await bcrypt.hash(password, 10)

  try {
    const user = await User.create({ email, password: hash })
    // Registered
    res.json({ message: '가입에 성공했습니다.' })
  } catch {
    // Email already exists
    res.status(400).json({ message: '이미 존재하는 이메일입니다.' })
  }
})

// --------------------------------------------------------------------------

// 로그인
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  // Invalid credentials
  if (!user) return res.status(400).json({ message: '가입한 적 없는 사용자입니다.' })
  const valid = await bcrypt.compare(password, user.password)

  if (!valid) return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' })
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)

  res.json({ token, message: '성공적으로 로그인 되었습니다.' })
})

// --------------------------------------------------------------------------

// GET (인증 필요)
app.get('/todos', auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id })
  res.json(todos)
})

// --------------------------------------------------------------------------

// POST (인증 필요)
app.post('/todos', auth, async (req, res) => {
  const todo = await Todo.create({
    userId: req.user.id,
    todo: req.body.todo,
    completed: false,
  })
  res.json(todo)
})

// --------------------------------------------------------------------------

// PUT (인증 필요)
app.put('/todos/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { todo: req.body.todo, completed: req.body.completed },
    { new: true }
  )
  res.json(todo)
})

// --------------------------------------------------------------------------

// PATCH (인증 필요)
app.patch('/todos/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  )
  res.json(todo)
})

// --------------------------------------------------------------------------

// DELETE (인증 필요)
app.delete('/todos/:id', auth, async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id, userId: req.user.id })
  res.json({ message: '삭제되었습니다.' })
})

// --------------------------------------------------------------------------

// 서버 실행
app.listen(3000, () => console.log('API 서버 시작'))
