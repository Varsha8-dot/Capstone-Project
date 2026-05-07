import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import BASE_URL from '../config'
import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted
} from '../styles/common'

function AuthorArticles() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuth((state) => state.currentUser)

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const getAuthorArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/author-api/articles`, {
          withCredentials: true
        })

        if (res.status === 200) {
          setArticles(res.data.payload)
        }
      } catch (err) {
        console.log(err)
        setError(err.response?.data?.error || 'Failed to fetch articles')
      } finally {
        setLoading(false)
      }
    }

    getAuthorArticles()
  }, [user, location.state?.refreshedAt])

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article
    })
  }

  if (loading) return <p className={loadingClass}>Loading articles...</p>
  if (error) return <p className={errorClass}>{error}</p>

  if (articles.length === 0) {
    return (
      <div className={emptyStateClass}>
        You haven't published any articles yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <div
          key={article._id}
          className={`${articleCardClass} relative flex flex-col overflow-hidden`}
        >
          {/* Status Badge */}
          <span
            className={
              article.isActive ? articleStatusActive : articleStatusDeleted
            }
          >
            {article.isActive ? 'ACTIVE' : 'DELETED'}
          </span>

          <div className="flex flex-col gap-2 min-w-0">
            <p className={articleMeta}>{article.category}</p>

            {/* Title */}
            <p className={`${articleTitle} wrap-break-word line-clamp-2`}>
              {article.title}
            </p>

            {/* Content */}
            <p className={`${articleExcerpt} wrap-break-word line-clamp-3`}>
              {article.content}
            </p>
          </div>

          <button
            className={`${ghostBtn} mt-auto pt-4`}
            onClick={() => openArticle(article)}
          >
            Read Article →
          </button>
        </div>
      ))}
    </div>
  )
}

export default AuthorArticles