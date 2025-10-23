import { useEffect, useState } from "react";
import api from "../../api/client";

function AdminDashboard({ token }) {
  const [reviews, setReviews] = useState([]);

  // 전체 리뷰 불러오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/api/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(data);
      } catch (error) {
        console.error("리뷰 목록 불러오기 실패", error);
      }
    };
    fetchReviews();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("이 리뷰를 삭제할까요?")) return;
    try {
      await api.delete(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (error) {
      alert("삭제 실패");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>🧾 전체 리뷰 관리</h2>
      <p>총 {reviews.length}개의 리뷰가 등록되어 있습니다.</p>
      <div className="review-list">
        {reviews.map((r) => (
          <div key={r._id} className="review-card">
            <h4>{r.title}</h4>
            <p>작성자: {r.user?.email || "알 수 없음"}</p>
            <p>장르: {r.genre}</p>
            <p>평점: {r.rating}</p>
            <p>{r.content}</p>
            <button onClick={() => handleDelete(r._id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
