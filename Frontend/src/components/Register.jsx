import {
  divider,
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  pageBackground,
  submitBtn,
  mutedText,
  loadingClass
} from '../styles/common'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router'
import { useState } from 'react'
import axios from 'axios'
import BASE_URL from '../config'
import { toast } from 'react-hot-toast'

function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [preview, setPreview] = useState(null)

  const onUserRegister = async (userObj) => {
    const formData = new FormData()
    formData.append('firstName', userObj.firstName)
    formData.append('lastName', userObj.lastName || '')
    formData.append('email', userObj.email)
    formData.append('password', userObj.password)
    formData.append('role', userObj.role)
    if (userObj.profileImageUrl?.[0]) {
      formData.append('profileImageUrl', userObj.profileImageUrl[0])
    }
    try {
      setLoading(true)
      setApiError(null)
      const res = await axios.post(`${BASE_URL}/auth/users`, formData, {
        withCredentials: true
      })
      if (res.status === 201) {
        toast.success('Account created! Please sign in.')
        navigate('/login')
      }
    } catch (err) {
      setApiError(err.response?.data?.error || err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className={loadingClass}>Creating your account...</p>

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {/* API Error — FIXED: was showing class name, now shows actual error message */}
        {apiError && <p className={errorClass}>{apiError}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* ROLE */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="USER"
                  {...register('role', { required: 'Please select a role' })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="AUTHOR"
                  {...register('role', { required: 'Please select a role' })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">Author</span>
              </label>
            </div>
            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>

          <div className={divider} />

          {/* NAME */}
          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="First name"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'At least 2 characters required' },
                  maxLength: { value: 30, message: 'Max 30 characters allowed' },
                  validate: (v) => v.trim().length > 0 || 'Cannot be empty'
                })}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>
            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Last name"
                {...register('lastName', {
                  maxLength: { value: 30, message: 'Max 30 characters allowed' }
                })}
              />
              {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* EMAIL */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Min. 8 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters required' }
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* PROFILE IMAGE */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image (optional)</label>
            <input
              type="file"
              className={inputClass}
              accept="image/png,image/jpeg"
              {...register('profileImageUrl', {
                validate: {
                  fileType: (files) => {
                    if (!files?.[0]) return true
                    return ['image/png', 'image/jpeg'].includes(files[0].type) || 'Only JPG/PNG allowed'
                  },
                  fileSize: (files) => {
                    if (!files?.[0]) return true
                    return files[0].size <= 2 * 1024 * 1024 || 'Max size 2MB'
                  }
                }
              })}
              onChange={(event) => {
                const file = event.target.files[0]
                if (file) setPreview(URL.createObjectURL(file))
              }}
            />
            {errors.profileImageUrl && (
              <p className={errorClass}>{errors.profileImageUrl.message}</p>
            )}
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 overflow-hidden rounded-full ring-2"
                />
              </div>
            )}
          </div>

          <button type="submit" className={submitBtn}>
            Create Account
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{' '}
          <NavLink to="/login" className="text-[#0066cc] font-medium">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Register
