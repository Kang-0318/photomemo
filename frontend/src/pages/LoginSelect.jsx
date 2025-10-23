import { useNavigate } from "react-router-dom";
import "./style/LoginSelect.scss";

function LoginSelect() {
  const navigate = useNavigate();

  return (
    <div className="login-select">
      <h1>🎮 Game Review Hub</h1>
      <p>로그인 유형을 선택하세요</p>

      <div className="login-buttons">
        <button className="btn admin" onClick={() => navigate("/admin/login")}>
          🧑‍💼 관리자 로그인
        </button>
        <button className="btn user" onClick={() => navigate("/user/login")}>
          👤 일반 사용자 로그인
        </button>
        <button className="btn register" onClick={() => navigate("/register")}>
          🆕 회원가입
        </button>
      </div>
    </div>
  );
}

export default LoginSelect;
