import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.scss'
import api from './api/client'; // ✅ fetchMe에서 사용하기 위해 추가
import AuthPanel from './components/AuthPanel'
import Header from './components/Header'
import ProtectRoute from './components/ProtectRoute'
import Landing from './pages/Landing'
import ReviewPage from './pages/ReviewPage'; // ✅ 새로 추가
import AdminDashboard from './pages/admin/adminDashboard'
import UserDashboard from './pages/user/userDashboard'

function App() {

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [me, setMe] = useState(null)
  const isAuthed = !!token

  const handleAuthed = ({ user, token }) => {
    setUser(user)
    setToken(token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    setMe(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/api/auth/me')
      setMe(data)
    } catch (error) {
      setMe({ error: error.response?.data || '실패' })
    }
  }

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <div className='page'>
      <Header user={user} onLogout={handleLogout} /> {/* ✅ 상단 공통 헤더 유지 */}

      <Routes>
        {/* 메인 랜딩 페이지 */}
        <Route path='/' element={<Landing />} />

        {/* ✅ 게임 리뷰 작성 페이지 (로그인 필요) */}
        <Route
          path='/reviews'
          element={
            <ProtectRoute isAuthed={isAuthed}>
              <ReviewPage user={user} token={token} />
            </ProtectRoute>
          }
        />

        {/* 유저 대시보드 */}
        <Route
          path='/user/dashboard'
          element={
            <ProtectRoute isAuthed={isAuthed}>
              <UserDashboard user={user} me={me} />
            </ProtectRoute>
          }
        />

        {/* 관리자 로그인 */}
        <Route
          path='/admin/login'
          element={
            <AuthPanel
              isAuthed={isAuthed}
              user={user}
              me={me}
              onFetchMe={fetchMe}
              onLogout={handleLogout}
              onAuthed={handleAuthed}
              requiredRole="admin"
            />
          }
        />

        {/* 관리자 대시보드 */}
        <Route
          path='/admin/dashboard'
          element={
            <ProtectRoute isAuthed={isAuthed}>
              <AdminDashboard user={user} />
            </ProtectRoute>
          }
        />

        {/* 잘못된 경로 → 홈으로 리다이렉트 */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
