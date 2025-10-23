import { Navigate } from "react-router-dom";

function ProtectRoute({ isAuthed, children }) {
  if (!isAuthed) {
    // 로그인 안 된 상태 → 로그인 선택 페이지로 이동
    return <Navigate to="/loginselect" replace />;
  }
  return children;
}

export default ProtectRoute;