import exp from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { articleModel } from '../models/ArticleModel.js'
export const userApp = exp.Router()

// Read all active articles
userApp.get('/articles', verifyToken('USER', 'ADMIN'), async (req, res, next) => {
  try {
    const articlesList = await articleModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
    res.status(200).json({ message: 'Article List', payload: articlesList })
  } catch (err) {
    next(err)
  }
})

// Get single article by ID
userApp.get('/article/:id', verifyToken('USER', 'ADMIN', 'AUTHOR'), async (req, res, next) => {
  try {
    const article = await articleModel
      .findById(req.params.id)
      .populate('comments.user', 'firstName email')
    if (!article) return res.status(404).json({ message: 'Article not found' })
    res.status(200).json({ message: 'Article found', payload: article })
  } catch (err) {
    next(err)
  }
})

// Add comment to article
userApp.put('/articles', verifyToken('USER', 'ADMIN'), async (req, res, next) => {
  try {
    const { articleId, comment } = req.body
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' })
    }
    const articleDocument = await articleModel
      .findOne({ _id: articleId, isActive: true })
      .populate('comments.user', 'firstName email')
    if (!articleDocument) {
      return res.status(404).json({ message: 'Article not found' })
    }
    articleDocument.comments.push({ user: req.user?.id, comment: comment.trim() })
    await articleDocument.save()
    await articleDocument.populate('comments.user', 'firstName email')
    res.status(200).json({ message: 'Comment added successfully', payload: articleDocument })
  } catch (err) {
    next(err)
  }
})
