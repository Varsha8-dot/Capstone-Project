import exp from 'express'
import { userModel } from '../models/UserModel.js'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middleware/verifyToken.js'
const { sign } = jwt
export const commonApp = exp.Router()
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import cloudinary from '../config/cloudinary.js'

// Register
commonApp.post('/users', upload.single('profileImageUrl'), async (req, res, next) => {
  let cloudinaryResult = null
  try {
    const allowedRoles = ['USER', 'AUTHOR']
    const newUser = req.body
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer)
      newUser.profileImageUrl = cloudinaryResult?.secure_url
    }
    const newUserDocument = new userModel(newUser)
    await newUserDocument.validate()
    newUserDocument.password = await hash(newUser.password, 10)
    await newUserDocument.save({ validateBeforeSave: false })
    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id)
    }
    next(err)
  }
})

// Login
commonApp.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' })
    }
    const isMatched = await compare(password, user.password)
    if (!isMatched) {
      return res.status(400).json({ message: 'Invalid password' })
    }
    if (!user.isUserActive) {
      return res.status(403).json({
        message: 'Your account has been deactivated. Please contact the admin.'
      })
    }
    const signedToken = sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        profileImageUrl: user.profileImageUrl
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    )
    res.cookie('token', signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    const userObj = user.toObject()
    delete userObj.password
    res.status(200).json({ message: 'Login success', payload: userObj })
  } catch (err) {
    next(err)
  }
})

// Logout
commonApp.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })
  res.status(200).json({ message: 'Logout success' })
})

// Check auth (page refresh)
commonApp.get('/check-auth', verifyToken('USER', 'AUTHOR', 'ADMIN'), (req, res) => {
  res.status(200).json({ message: 'Authenticated', payload: req.user })
})

// Change password
commonApp.put('/password', verifyToken('USER', 'AUTHOR', 'ADMIN'), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password cannot be same as current password' })
    }
    const user = await userModel.findById(req.user?.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const verified = await compare(currentPassword, user.password)
    if (!verified) return res.status(401).json({ message: 'Incorrect current password' })
    user.password = await hash(newPassword, 10)
    await user.save()
    res.status(200).json({ message: 'Password changed successfully' })
  } catch (err) {
    next(err)
  }
})
