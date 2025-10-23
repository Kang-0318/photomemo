import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import "./style/AuthPanel.scss";

const AuthPanel = ({
  isAuthed,
  user,
  me,
  onFetchMe,
  onLogout,
  onAuthed,
  requiredRole,
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // ✅ URL 쿼리에서 mode 감지
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode"); // 'register' 또는 null
  const hasRequiredRole = !requiredRole || (user && user.role === requiredRole);

  // ✅ 로그인 페이지 들어올 때 자동 모달 열기
  useEffect(() => {
    if (!isAuthed) setOpen(true);
  }, [isAuthed]);

  if (open) {
    return (
      <AuthModal
        open={open}
        onClose={() => setOpen(false)}
        onAuthed={onAuthed}
        defaultMode={mode === "register" ? "register" : "login"} // ✅ 회원가입 모드 진입
      />
    );
  }

  return (
    <section className="container-sm admin-card">
      <header className="admin-head">
        <h1 className="title">
          {requiredRole === "admin" ? "관리자 인증" : "로그인"}
        </h1>
        <p>로그인 또는 회원가입 후 이용할 수 있습니다.</p>
      </header>

      {!isAuthed ? (
        <div className="auth-row">
          <button onClick={() => setOpen(true)} className="btn btn-primary">
            로그인 / 회원가입
          </button>
        </div>
      ) : (
        <div className="auth-row">
          <span>
            안녕하세요, <b>{user?.displayName || user?.email}</b>님
          </span>
          <span
            className={`badge ${hasRequiredRole ? "badge-ok" : "badge-warn"}`}
          >
            {hasRequiredRole ? requiredRole : `권한없음: ${requiredRole} 필요`}
          </span>

          <div className="auth-actions">
            {hasRequiredRole && (
              <button className="btn" onClick={onFetchMe}>
                내 정보 보기
              </button>
            )}
            <button className="btn" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        </div>
      )}

      {isAuthed && !hasRequiredRole && (
        <div className="alert alert-warn">
          현재 계정에는 관리자 권한이 없습니다.
        </div>
      )}

      {me && (
        <pre className="code">{JSON.stringify(me, null, 2)}</pre>
      )}
    </section>
  );
};

export default AuthPanel;
