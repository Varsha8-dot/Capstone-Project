import { useParams, useLocation, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import { toast } from 'react-hot-toast'
import BASE_URL from '../config'
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText
} from '../styles/common.js'
import { useForm } from 'react-hook-form'

function ArticleById() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm()

  const user = useAuth((state) => state.currentUser)

  const [article, setArticle] = useState(location.state || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (article) return
    const getArticle = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/user-api/article/${id}`, {
          withCredentials: true
        })
        setArticle(res.data.payload)
      } catch (err) {
        setError(err.response?.data?.message || 'Article not found')
      } finally {
        setLoading(false)
      }
    }
    getArticle()
  }, [id, article])

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    })

  const toggleArticleStatus = async () => {
    const newStatus = !article.isActive
    if (!window.confirm(newStatus ? 'Restore this article?' : 'Delete this article?')) return
    try {
      const res = await axios.patch(
        `${BASE_URL}/author-api/articles`,
        { articleId: article._id, isArticleActive: newStatus },
        { withCredentials: true }
      )
      toast.success(res.data.message)
      navigate('/author-profile/articles', { replace: true, state: { refreshedAt: Date.now() } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const editArticle = (articleObj) => {
    navigate('/edit-article', { state: articleObj })
  }

  const addComment = async (commentObj) => {
    if (!commentObj.comment?.trim()) return
    commentObj.articleId = article._id
    try {
      const res = await axios.put(`${BASE_URL}/user-api/articles`, commentObj, {
        withCredentials: true
      })
      if (res.status === 200) {
        toast.success('Comment added!')
        setArticle(res.data.payload)
        reset()
      }
    } catch (err) {
      toast.error('Failed to add comment')
    }
  }

  if (loading) return <p className={loadingClass}>Loading article...</p>
  if (error) return <p className={errorClass}>{error}</p>
  if (!article) return null

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>
        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>
        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || 'Author'}</div>
          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* Author actions */}
      {user?.role === 'AUTHOR' && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>
          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isActive ? 'Delete' : 'Restore'}
          </button>
        </div>
      )}

      {/* Comment form for USER & ADMIN */}
      {(user?.role === 'USER' || user?.role === 'ADMIN') && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)} className="w-full flex flex-col gap-3">
            <input
              type="text"
              {...register('comment', { required: true })}
              className={inputClass}
              placeholder="Write your comment here..."
            />
            <button
              type="submit"
              className="bg-[#0066cc] text-white px-5 py-2 rounded-full w-fit text-sm hover:bg-[#004499] transition"
            >
              Add Comment
            </button>
          </form>
        </div>
      )}

      {/* Comments */}
      <div className={commentsWrapper}>
        {article.comments?.length === 0 && (
          <p className="text-[#a1a1a6] text-sm text-center">No comments yet</p>
        )}
        {article.comments?.map((commentObj, index) => {
          const name = commentObj.user?.email || commentObj.user?.firstName || 'User'
          const firstLetter = name.charAt(0).toUpperCase()
          return (
            <div key={index} className={commentCard}>
              <div className={commentHeader}>
                <div className={commentUserRow}>
                  <div className={avatar}>{firstLetter}</div>
                  <div>
                    <p className={commentUser}>{name}</p>
                    <p className={commentTime}>
                      {formatDate(commentObj.createdAt || new Date())}
                    </p>
                  </div>
                </div>
              </div>
              <p className={commentText}>{commentObj.comment}</p>
            </div>
          )
        })}
      </div>

      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  )
}

export default ArticleById
