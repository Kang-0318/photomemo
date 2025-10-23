import { useNavigate } from "react-router-dom";
import "./style/LoginSelect.scss";

function LoginSelect() {
  const navigate = useNavigate();

  return (
    <div className="login-select">
      <h1>로그인 유형을 선택하세요</h1>
      <p>관리자 또는 일반 사용자로 로그인할 수 있습니다.</p>

      <div className="btn-group">
        <button onClick={() => navigate("/login")} className="btn user">
          👤 일반 사용자 로그인
        </button>
        <button onClick={() => navigate("/admin/login")} className="btn admin">
          🧑‍💼 관리자 로그인
        </button>
        <button onClick={() => navigate("/register")} className="btn register">
          🆕 회원가입
        </button>
      </div>
    </div>
  );
}

export default LoginSelect;
