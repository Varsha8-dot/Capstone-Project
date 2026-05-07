import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'
import { navLinkClass, divider } from '../styles/common'

function AdminProfile() {
  const currentUser = useAuth((state) => state.currentUser)
  const logout = useAuth((state) => state.logout)
  const navigate = useNavigate()

  const onLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
              alt="profile"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold flex-shrink-0">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name */}
          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              {currentUser?.firstName}
            </h2>
          </div>

          {/* Admin badge */}
          <span className="text-xs font-medium bg-[#0066cc]/10 text-[#0066cc] px-3 py-1 rounded-full">
            Admin
          </span>
        </div>

        {/* LOGOUT */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6 bg-[#f5f5f7] p-2 rounded-full w-fit">
        <NavLink
          to="users"
          className={({ isActive }) =>
            isActive
              ? 'bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm'
              : `${navLinkClass} px-5 py-2`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="authors"
          className={({ isActive }) =>
            isActive
              ? 'bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm'
              : `${navLinkClass} px-5 py-2`
          }
        >
          Authors
        </NavLink>

        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive
              ? 'bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm'
              : `${navLinkClass} px-5 py-2`
          }
        >
          Articles
        </NavLink>
      </div>

      <div className={divider} />

      {/* CONTENT */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminProfile