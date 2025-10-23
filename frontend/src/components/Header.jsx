import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Header.scss";

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 경로 확인용
  const isLanding = location.pathname === "/"; // ✅ 첫 화면 여부 확인

  const handleLogoutClick = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      onLogout();
      navigate("/");
    }
  };

  return (
    <header className="app-header">
      <div className="header-left" onClick={() => navigate("/")}>
        🎮 <b>Game Review Hub</b>
      </div>

      {/* ✅ 첫화면("/")에서는 로그인/로그아웃 버튼을 숨김 */}
      {!isLanding && (
        <div className="header-right">
          {user ? (
            <>
              <span className="user-info">{user.displayName || user.email}</span>
              <button className="btn-logout" onClick={handleLogoutClick}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="btn-login" onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
