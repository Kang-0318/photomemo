import React, { useState } from "react";
import { getErrorMessage, login, register } from "../api/client";

function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        const data = await login({ email, password });
        onAuthed(data); // ✅ 로그인일 때만 로그인 성공 처리
      } else {
        // ✅ 회원가입 후엔 자동 로그인시키지 말기
        await register({ email, password, displayName });
        alert("회원가입이 완료되었습니다! 로그인 후 이용해주세요.");
        setMode("login"); // 회원가입 → 로그인 탭으로 전환
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className={`auth-modal ${open ? "open" : ""}`}>
      <div className="auth-box">
        <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="닉네임"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary">
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <p>
          {mode === "login"
            ? "계정이 없으신가요?"
            : "이미 계정이 있으신가요?"}
          <button
            type="button"
            className="link-btn"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "회원가입" : "로그인"}
          </button>
        </p>

        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
