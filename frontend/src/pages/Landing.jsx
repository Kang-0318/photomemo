import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  // ✅ 로그인 정보(localStorage) 확인
  const token = localStorage.getItem("token");

  const handleStart = () => {
    if (token) {
      // 로그인 되어 있으면 리뷰 페이지로
      navigate("/reviews");
    } else {
      // 로그인 안 되어 있으면 로그인 페이지로
      navigate("/admin/login");
    }
  };

  return (
    <div className="landing">
      <h1>🎮 게임 리뷰 허브</h1>
      <p>게임을 기록하고, 평점을 남기고, 다른 사람과 공유하세요.</p>

      <button onClick={handleStart}>시작하기</button>

      <div className="features">
        <div className="feature-box">
          <h3>빠른 기록</h3>
          <p>게임 제목, 평점, 한 줄 리뷰로 바로 등록!</p>
        </div>
        <div className="feature-box">
          <h3>검색 & 필터</h3>
          <p>장르, 제목, 작성자로 빠르게 찾아보기.</p>
        </div>
        <div className="feature-box">
          <h3>간단 공유</h3>
          <p>공유 링크로 다른 유저에게 리뷰 전달.</p>
        </div>
      </div>
    </div>
  );
}
