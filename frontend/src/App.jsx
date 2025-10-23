import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import api from './api/client';
import AuthPanel from './components/AuthPanel';
import Header from './components/Header';
import ProtectRoute from './components/ProtectRoute';
import Landing from './pages/Landing';
import ReviewPage from './pages/ReviewPage';
import AdminDashboard from './pages/admin/adminDashboard';
import UserDashboard from './pages/user/UserDashboard';

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [me, setMe] = useState(null);
  const isAuthed = !!token;
  const navigate = useNavigate();

  const handleAuthed = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    // ✅ 로그인 성공 시 역할별 페이지로 자동 이동
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/reviews');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setMe(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // 로그아웃 후 홈으로
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setMe(data);
    } catch (error) {
      setMe({ error: error.response?.data || '실패' });
    }
  };

  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  return (
    <div className="page">
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        {/* 메인 랜딩 페이지 */}
        <Route
          path="/"
          element={
            isAuthed ? (
              user?.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/reviews" replace />
              )
            ) : (
              <Landing />
            )
          }
        />

        {/* 일반 로그인 (유저용) */}
        <Route
          path="/login"
          element={
            <AuthPanel
              isAuthed={isAuthed}
              user={user}
              me={me}
              onFetchMe={fetchMe}
              onLogout={handleLogout}
              onAuthed={handleAuthed}
              requiredRole="user"
            />
          }
        />

        {/* 리뷰 작성 페이지 (유저만) */}
        <Route
          path="/reviews"
          element={
            <ProtectRoute isAuthed={isAuthed}>
              <ReviewPage user={user} token={token} />
            </ProtectRoute>
          }
        />

        {/* 유저 대시보드 */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <UserDashboard user={user} token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 관리자 로그인 */}
        <Route
          path="/admin/login"
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
          path="/admin/dashboard"
          element={
            token && user?.role === 'admin' ? (
              <AdminDashboard token={token} />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* 잘못된 경로 → 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
