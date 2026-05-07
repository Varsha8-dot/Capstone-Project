import { NavLink } from 'react-router'
import { navBrandClass, mutedText, linkClass, divider } from '../styles/common'

function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8e8ed] px-8 py-8 mt-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className={navBrandClass}>MyBlog</p>

          <div className="flex gap-5">
            <NavLink to="/" className={`${linkClass} text-sm`}>
              Home
            </NavLink>
            <NavLink to="/articles" className={`${linkClass} text-sm`}>
              Articles
            </NavLink>
            <NavLink to="/register" className={`${linkClass} text-sm`}>
              Register
            </NavLink>
            <NavLink to="/login" className={`${linkClass} text-sm`}>
              Login
            </NavLink>
          </div>
        </div>

        <div className={divider} />

        <p className={mutedText}>© {new Date().getFullYear()} MyBlog</p>
      </div>
    </footer>
  )
}

export default Footer