import dotenv from 'dotenv'
dotenv.config()

import exp from 'express'
import { connect } from 'mongoose'
import { userApp } from './APIs/UserAPI.js'
import { authorApp } from './APIs/AuthorAPI.js'
import { adminApp } from './APIs/AdminAPI.js'
import { commonApp } from './APIs/CommonAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = exp()

// Debug log - shows in Render logs
console.log('ENV CHECK → DB_URI:', process.env.DB_URI ? 'FOUND ✅' : 'MISSING ❌')
console.log('ENV CHECK → NODE_ENV:', process.env.NODE_ENV)

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(cookieParser())
app.use(exp.json())

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))

app.use('/user-api', userApp)
app.use('/author-api', authorApp)
app.use('/admin-api', adminApp)
app.use('/auth', commonApp)

app.use((req, res) => {
  res.status(404).json({ message: `Path ${req.url} is invalid` })
})

app.use((err, req, res, next) => {
  console.log(err.name, err)
  if (err.name === 'ValidationError')
    return res.status(400).json({ message: 'Validation error', error: err.message })
  if (err.name === 'CastError')
    return res.status(400).json({ message: 'Cast error', error: err.message })
  res.status(500).json({ message: 'Server error', error: err.message })
})

const connectDB = async () => {
  try {
    const uri = process.env.DB_URI
    if (!uri) throw new Error('DB_URI is not set in environment!')
    await connect(uri, { family: 4 })
    console.log('DB Connected ✅')
    const port = process.env.PORT || 5000
    app.listen(port, () => console.log(`Server running on port ${port} ✅`))
  } catch (err) {
    console.log('Error in DB Connect:', err.message)
    process.exit(1)
  }
}

connectDB()
