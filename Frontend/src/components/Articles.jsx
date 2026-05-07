import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import BASE_URL from '../config'
import {
  pageWrapper,
  articleGrid,
  articleCardClass,
  articleTitle,
  tagClass,
  ghostBtn,
  timestampClass,
  loadingClass,
  errorClass,
  emptyStateClass
} from '../styles/common'

function Articles() {
  const navigate = useNavigate()
  const user = useAuth((state) => state.currentUser)

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const getArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/user-api/articles`, {
          withCredentials: true
        })
        setArticles(res.data.payload || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    getArticles()
  }, [user])

  const formatDate = (value) =>
    new Date(value).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium'
    })

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, { state: article })
  }

  if (loading) return <p className={loadingClass}>Loading articles...</p>
  if (error) return <p className={errorClass}>{error}</p>

  return (
    <div className={pageWrapper}>
      {articles.length === 0 ? (
        <p className={emptyStateClass}>No articles available yet.</p>
      ) : (
        <div className={articleGrid}>
          {articles.map((article) => (
            <div
              key={article._id}
              className={`${articleCardClass} flex flex-col gap-2`}
            >
              {/* Category */}
              <p className={tagClass}>{article.category}</p>

              {/* Title */}
              <p className={`${articleTitle} line-clamp-2`}>{article.title}</p>

              {/* Excerpt */}
              <p className="text-sm text-[#6e6e73] line-clamp-3 break-words">
                {article.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-4">
                <p className={timestampClass}>
                  {formatDate(article.createdAt)}
                </p>
                <button
                  className={ghostBtn}
                  onClick={() => openArticle(article)}
                >
                  Read →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Articles