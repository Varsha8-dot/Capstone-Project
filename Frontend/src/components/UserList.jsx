import { useEffect, useState } from 'react'
import axios from 'axios'
import BASE_URL from '../config'
import {
  headingClass,
  mutedText,
  tagClass,
  avatar,
  loadingClass,
  errorClass,
  emptyStateClass,
  divider
} from '../styles/common'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/admin-api/users`, {
          withCredentials: true
        })
        if (res.status === 200) {
          setUsers(res.data.payload)
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    getUsers()
  }, [])

  const toggleUserStatus = async (userId, currentStatus) => {
    setTogglingId(userId)
    try {
      const res = await axios.put(
        `${BASE_URL}/admin-api/users/${userId}/status`,
        { isUserActive: !currentStatus },
        { withCredentials: true }
      )
      if (res.status === 200) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isUserActive: !currentStatus } : u
          )
        )
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user status')
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) return <p className={loadingClass}>Loading users...</p>
  if (error) return <p className={errorClass}>{error}</p>

  const activeCount = users.filter((u) => u.isUserActive).length
  const inactiveCount = users.length - activeCount

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <p className={tagClass}>Users</p>
        <h2 className={`${headingClass} mt-1`}>
          All Users{' '}
          <span className={`${mutedText} font-normal`}>({users.length})</span>
        </h2>
        <p className={`${mutedText} mt-1`}>
          Manage user access and account status
        </p>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          <div className="bg-[#34c759]/10 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-semibold text-[#248a3d]">
              {activeCount}
            </p>
            <p className="text-xs text-[#6e6e73]">Active</p>
          </div>
          <div className="bg-[#ff3b30]/10 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-semibold text-[#cc2f26]">
              {inactiveCount}
            </p>
            <p className="text-xs text-[#6e6e73]">Inactive</p>
          </div>
        </div>
      </div>

      <div className={divider} />

      {/* LIST */}
      {users.length === 0 ? (
        <p className={emptyStateClass}>No users found.</p>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-[#ebebf0] transition-colors duration-200"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full object-cover border flex-shrink-0"
                  />
                ) : (
                  <div className={`${avatar} flex-shrink-0`}>
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-[#1d1d1f]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className={mutedText}>{user.email}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    user.isUserActive
                      ? 'bg-[#34c759]/20 text-[#248a3d]'
                      : 'bg-[#ff3b30]/20 text-[#cc2f26]'
                  }`}
                >
                  {user.isUserActive ? 'Active' : 'Inactive'}
                </span>

                <button
                  disabled={togglingId === user._id}
                  onClick={() => toggleUserStatus(user._id, user.isUserActive)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition disabled:opacity-40 disabled:cursor-not-allowed ${
                    user.isUserActive
                      ? 'border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white'
                      : 'border-[#34c759] text-[#34c759] hover:bg-[#34c759] hover:text-white'
                  }`}
                >
                  {togglingId === user._id
                    ? '...'
                    : user.isUserActive
                      ? 'Deactivate'
                      : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserList