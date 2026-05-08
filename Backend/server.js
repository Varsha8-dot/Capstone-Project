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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173']

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
)

app.use(cookieParser())
app.use(exp.json())

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))

// Path-level middleware
app.use('/user-api', userApp)
app.use('/author-api', authorApp)
app.use('/admin-api', adminApp)
app.use('/auth', commonApp)

// Connect to DB and start server
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL, { family: 4 })
    console.log('DB Connected')
    const port = process.env.PORT || 5000
    app.listen(port, () => console.log(`Server listening on port ${port}`))
  } catch (err) {
    console.log('Error in DB Connect', err)
    process.exit(1)
  }
}

connectDB()

// Handle invalid paths
app.use((req, res, next) => {
  res.status(404).json({ message: `Path ${req.url} is invalid` })
})

// Error handler
app.use((err, req, res, next) => {
  console.log(err.name, err)
  if (err.name === 'ValidationError')
    return res.status(400).json({ message: 'Validation error', error: err.message })
  if (err.name === 'CastError')
    return res.status(400).json({ message: 'Cast error', error: err.message })
  res.status(500).json({ message: 'Server error', error: err.message })
})
