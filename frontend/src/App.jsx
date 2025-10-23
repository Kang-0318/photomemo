import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import api from './api/client';
import AuthPanel from './components/AuthPanel';
import ProtectRoute from './components/ProtectRoute';
import Landing from './pages/Landing';
import LoginSelect from './pages/LoginSelect'; // ✅ 추가
import ReviewPage from './pages/ReviewPage';
import AdminDashboard from './pages/admin/adminDashboard';

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
    navigate('/');
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
      <Routes>
        {/* 메인 랜딩 */}
        <Route path="/" element={<Landing />} />

        {/* ✅ 로그인 선택 페이지 추가 */}
        <Route path="/login-select" element={<LoginSelect />} />

        {/* 사용자 로그인 */}
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

        {/* 리뷰 */}
        <Route
          path="/reviews"
          element={
            <ProtectRoute isAuthed={isAuthed}>
              <ReviewPage user={user} token={token} />
            </ProtectRoute>
          }
        />

        {/* 관리자 대시보드 */}
        <Route
          path="/admin/dashboard"
          element={
            token && user?.role === 'admin' ? (
              <AdminDashboard token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* 잘못된 경로 → 홈 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
