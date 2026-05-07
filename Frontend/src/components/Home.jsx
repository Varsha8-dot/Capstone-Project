import { useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'
import {
  pageWrapper,
  section,
  pageTitleClass,
  bodyText,
  tagClass,
  primaryBtn,
  secondaryBtn,
  divider,
  mutedText,
  headingClass,
  cardClass
} from '../styles/common'

function Home() {
  const navigate = useNavigate()
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const currentUser = useAuth((state) => state.currentUser)

  const getProfilePath = () => {
    if (!currentUser) return '/login'
    if (currentUser.role === 'AUTHOR') return '/author-profile'
    if (currentUser.role === 'ADMIN') return '/admin-profile'
    return '/user-profile'
  }

  return (
    <div className={pageWrapper}>
      {/* HERO */}
      <section className={`${section} text-center py-10`}>
        <p className={tagClass}>MyBlog</p>
        <h1 className={`${pageTitleClass} mt-4 max-w-2xl mx-auto`}>
          A place to read and write things that matter.
        </h1>
        <p className={`${bodyText} mt-4 max-w-lg mx-auto`}>
          Articles from real people on topics worth your time.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          {isAuthenticated ? (
            <>
              <button className={primaryBtn} onClick={() => navigate('/articles')}>
                Browse Articles
              </button>
              <button className={secondaryBtn} onClick={() => navigate(getProfilePath())}>
                My Profile
              </button>
            </>
          ) : (
            <>
              <button className={primaryBtn} onClick={() => navigate('/register')}>
                Get Started
              </button>
              <button className={secondaryBtn} onClick={() => navigate('/login')}>
                Sign In
              </button>
            </>
          )}
        </div>
      </section>

      <div className={divider} />

      {/* WHAT YOU CAN DO */}
      <section className={section}>
        <h2 className={`${headingClass} mb-6`}>What you can do here</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={cardClass}>
            <p className="text-sm font-semibold text-[#1d1d1f] mb-1">Read</p>
            <p className={mutedText}>Browse articles from authors across different topics.</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm font-semibold text-[#1d1d1f] mb-1">Write</p>
            <p className={mutedText}>Publish your own articles and build an audience.</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm font-semibold text-[#1d1d1f] mb-1">Discuss</p>
            <p className={mutedText}>Leave comments and engage with what you read.</p>
          </div>
        </div>
      </section>

      <div className={divider} />

      {/* BOTTOM CTA */}
      <section className={`${section} text-center`}>
        <p className={`${bodyText} mb-4`}>
          {isAuthenticated ? 'Keep exploring.' : 'Free to join. No catch.'}
        </p>
        <button
          className={primaryBtn}
          onClick={() => navigate(isAuthenticated ? '/articles' : '/register')}
        >
          {isAuthenticated ? 'Go to Articles' : 'Create Account'}
        </button>
      </section>
    </div>
  )
}

export default Home
