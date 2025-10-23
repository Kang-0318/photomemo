import React, { useEffect, useState } from "react";
import api from "../../api/client";
import "./adminDashboard.scss";

function AdminDashboard({ token, onLogout }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/api/reviews");
      setReviews(data);
    } catch (error) {
      console.error("리뷰 불러오기 실패:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      alert("삭제 실패");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="admin-dashboard">
      {/* ✅ 상단 관리자 로그아웃 버튼 */}
      <header className="admin-header">
        <h1>🗒️ 전체 리뷰 관리</h1>
        <button onClick={onLogout} className="btn btn-logout">
          로그아웃
        </button>
      </header>

      <p>총 {reviews.length}개의 리뷰가 등록되어 있습니다.</p>

      {reviews.map((r) => (
        <div key={r._id} className="review-card">
          <h3>{r.title}</h3>
          <p>작성자: {r.user?.email || "익명"}</p>
          <p>평점: {r.rating}</p>
          <p>{r.content}</p>
          <button className="btn btn-danger" onClick={() => handleDelete(r._id)}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
