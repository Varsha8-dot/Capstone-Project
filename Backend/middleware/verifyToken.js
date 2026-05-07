import jwt from 'jsonwebtoken'
const { verify } = jwt

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from cookie
      const token = req.cookies?.token
      if (!token) {
        return res.status(401).json({ message: 'Please login first' })
      }
      // Validate token
      const decodedToken = verify(token, process.env.SECRET_KEY)
      // Check role
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: 'You are not authorized' })
      }
      req.user = decodedToken
      next()
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
}
