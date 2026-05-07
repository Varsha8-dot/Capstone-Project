import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import Root from './components/Root'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import AuthorProfile from './components/AuthorProfile'
import AdminProfile from './components/AdminProfile'
import Articles from './components/Articles'
import ArticleById from './components/ArticleById'
import WriteArticles from './components/WriterArticles'
import AuthorArticles from './components/AuthorArticles'
import UserList from './components/UserList'
import AuthorList from './components/AuthorList'
import EditArticle from './components/EditArticle'
import { Toaster } from 'react-hot-toast'
import Unauthorized from './components/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const routerObj = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        { path: '', element: <Home /> },
        { path: 'register', element: <Register /> },
        { path: 'login', element: <Login /> },
        {
          path: 'user-profile',
          element: (
            <ProtectedRoute allowedRoles={['USER']}>
              <UserProfile />
            </ProtectedRoute>
          )
        },
        { path: 'articles', element: <Articles /> },
        {
          path: 'author-profile',
          element: (
            <ProtectedRoute allowedRoles={['AUTHOR']}>
              <AuthorProfile />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <AuthorArticles /> },
            { path: 'articles', element: <AuthorArticles /> },
            { path: 'write-article', element: <WriteArticles /> }
          ]
        },
        {
          path: 'admin-profile',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminProfile />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="users" replace /> },
            { path: 'users', element: <UserList /> },
            { path: 'authors', element: <AuthorList /> },
            { path: 'articles', element: <Articles /> }
          ]
        },
        { path: 'article/:id', element: <ArticleById /> },
        { path: 'edit-article', element: <EditArticle /> },
        { path: 'unauthorized', element: <Unauthorized /> }
      ]
    }
  ])

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </div>
  )
}

export default App
