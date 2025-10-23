import { useEffect, useState } from "react";
import api from "../../api/client";

function UserDashboard({ user, token }) {
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    // 내 리뷰만 불러오기
    const fetchMyReviews = async () => {
      try {
        const { data } = await api.get("/api/reviews");
        // 로그인한 사용자의 리뷰만 필터링
        const filtered = data.filter((r) => r.user?._id === user?._id);
        setMyReviews(filtered);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };
    fetchMyReviews();
  }, [user]);

  return (
    <div className="user-dashboard">
      <header>
        <h2>🎮 내 계정</h2>
        <p>{user?.displayName || user?.email}</p>
      </header>

      <section className="profile-section">
        <h3>내 프로필</h3>
        <ul>
          <li>이메일: {user?.email}</li>
          <li>역할: {user?.role}</li>
          <li>상태: {user?.isActive ? "활성" : "비활성"}</li>
        </ul>
      </section>

      <section className="review-section">
        <h3>내가 작성한 리뷰</h3>
        {myReviews.length === 0 ? (
          <p>작성한 리뷰가 없습니다.</p>
        ) : (
          <div className="review-list">
            {myReviews.map((review) => (
              <div key={review._id} className="review-card">
                <h4>{review.title}</h4>
                <p>장르: {review.genre}</p>
                <p>평점: {review.rating}</p>
                <p>{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default UserDashboard;
