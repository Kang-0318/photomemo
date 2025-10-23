import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'; // ✅ 추가
import AuthModal from "./AuthModal"
import './style/AuthPanel.scss'

const AuthPanel = ({
  isAuthed,
  user,
  me,
  onFetchMe,
  onLogout,
  onAuthed,
  requiredRole
}) => {
  const [open, setOpen] = useState(false)
  const hasRequiredRole = !requiredRole || (user && user.role === requiredRole)

  const location = useLocation() // ✅ 쿼리 읽기용
  const query = new URLSearchParams(location.search)
  const mode = query.get("mode") // ✅ 'register' 감지

  // ✅ 로그인 페이지 들어올 때 자동으로 모달 열기
  useEffect(() => {
    if (!isAuthed) setOpen(true)
  }, [isAuthed])

  if (open) {
    return (
      <AuthModal
        open={open}
        onClose={() => setOpen(false)}
        onAuthed={onAuthed}
        defaultMode={mode === "register" ? "register" : "login"} // ✅ 회원가입으로 바로 진입
      />
    )
  }

  return (
    <section className='container-sm admin-card'>
      <header className='admin-head'>
        <h1 className='title'>
          {requiredRole === "admin" ? "관리자 인증" : "로그인"}
        </h1>
        <p>버튼 → 모달에서 로그인/회원가입 → 토큰 저장 → /me 호출</p>
      </header>

      {!isAuthed ? (
        <div className="auth-row">
          <button onClick={() => setOpen(true)} className="btn btn-primary">
            로그인 / 회원가입
          </button>
        </div>
      ) : (
        <div className="auth-row">
          <span>안녕하세요 <b>{user?.displayName || user?.email}</b></span>
          <span className={`badge ${hasRequiredRole ? 'badge-ok' : 'badge-warn'}`}>
            {hasRequiredRole ? requiredRole : `권한없음: ${requiredRole} 필요`}
          </span>
          <div className="auth-actions">
            {hasRequiredRole && (
              <button className="btn" onClick={onFetchMe}>/me 호출</button>
            )}
            <button className="btn" onClick={onLogout}>로그아웃</button>
          </div>
        </div>
      )}

      {isAuthed && !hasRequiredRole && (
        <div className="alert alert-warn">
          현재 계정에는 관리자 권한이 없습니다. 관리자 승인이 필요합니다.
        </div>
      )}

      {me && (
        <pre className="code">
          {JSON.stringify(me, null, 2)}
        </pre>
      )}
    </section>
  )
}

export default AuthPanel
