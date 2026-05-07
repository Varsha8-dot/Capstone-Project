import exp from 'express'
import { userModel } from '../models/UserModel.js'
import { articleModel } from '../models/ArticleModel.js'
import { verifyToken } from '../middleware/verifyToken.js'
export const authorApp = exp.Router()

// Write / publish article
authorApp.post('/articles', verifyToken('AUTHOR'), async (req, res, next) => {
  try {
    const articleObj = req.body
    const user = req.user
    // FIX: check author exists before accessing properties
    const author = await userModel.findById(articleObj.author)
    if (!author) {
      return res.status(404).json({ message: 'Invalid author' })
    }
    if (author.email !== user.email) {
      return res.status(403).json({ message: 'You are not authorized' })
    }
    const articleDocument = new articleModel(articleObj)
    await articleDocument.save()
    res.status(201).json({ message: 'Article published successfully' })
  } catch (err) {
    next(err)
  }
})

// Read own articles
authorApp.get('/articles', verifyToken('AUTHOR'), async (req, res, next) => {
  try {
    const authorIdOfToken = req.user?.id
    const articlesList = await articleModel
      .find({ author: authorIdOfToken })
      .sort({ createdAt: -1 })
    res.status(200).json({ message: 'Articles', payload: articlesList })
  } catch (err) {
    next(err)
  }
})

// Edit article
authorApp.put('/articles', verifyToken('AUTHOR'), async (req, res, next) => {
  try {
    const authorIdOfToken = req.user?.id
    const { articleId, title, category, content } = req.body
    const modifiedArticle = await articleModel.findOneAndUpdate(
      { _id: articleId, author: authorIdOfToken },
      { $set: { title, category, content } },
      { new: true }
    )
    if (!modifiedArticle) {
      return res.status(403).json({ message: 'You are not authorized to edit this article' })
    }
    res.status(200).json({ message: 'Article updated', payload: modifiedArticle })
  } catch (err) {
    next(err)
  }
})

// Soft delete / restore article
authorApp.patch('/articles', verifyToken('AUTHOR'), async (req, res, next) => {
  try {
    const authorIdOfToken = req.user?.id
    const { articleId, isArticleActive } = req.body
    const articleOfDB = await articleModel.findOne({
      _id: articleId,
      author: authorIdOfToken
    })
    if (!articleOfDB) {
      return res.status(404).json({ message: 'Article not found' })
    }
    if (isArticleActive === articleOfDB.isActive) {
      return res.status(200).json({ message: 'Article already in the same state' })
    }
    articleOfDB.isActive = isArticleActive
    await articleOfDB.save()
    res.status(200).json({ message: 'Article status updated', payload: articleOfDB })
  } catch (err) {
    next(err)
  }
})
