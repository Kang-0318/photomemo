import { useEffect, useState } from "react";
import { login, register } from "../api/client";
import "./style/AuthModal.scss";

function AuthModal({ open, onClose, onAuthed, defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  // ✅ 쿼리에 따라 모드 자동 변경
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "register") {
        const data = await register({ email, password, displayname: displayName });
        alert("회원가입 완료! 로그인 해주세요.");
        setMode("login");
      } else {
        const data = await login({ email, password });
        onAuthed(data);
        onClose();
      }
    } catch (error) {
      alert("오류: " + (error.response?.data?.message || error.message));
    }
  };

  if (!open) return null;

  return (
    <div className="auth-modal">
      <div className="modal-content">
        <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="닉네임"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <p className="switch-mode">
          {mode === "login" ? (
            <>
              계정이 없나요?{" "}
              <button onClick={() => setMode("register")}>회원가입</button>
            </>
          ) : (
            <>
              이미 계정이 있나요?{" "}
              <button onClick={() => setMode("login")}>로그인</button>
            </>
          )}
        </p>

        <button className="btn-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
