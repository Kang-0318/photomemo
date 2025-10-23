import React, { useEffect, useState } from "react";
import api from "../api/client";
import "./style/ReviewPage.scss";

function ReviewPage({ user }) {
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/api/reviews");
      setReviews(data.reverse());
    } catch (error) {
      console.error("리뷰 불러오기 실패:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("모든 항목을 입력하세요.");

    try {
      await api.post("/api/reviews", {
        title,
        rating: parseInt(rating), // ✅ 숫자 변환
        content, // ✅ 필드명 일치
      });
      setTitle("");
      setRating(5);
      setContent("");
      fetchReviews();
    } catch (error) {
      alert("리뷰 등록 실패");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="review-page">
      <h1>🎮 게임 리뷰</h1>

      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="게임 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>{n}점</option>
          ))}
        </select>
        <textarea
          placeholder="한 줄 리뷰를 작성하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">등록하기</button>
      </form>

      <div className="review-list">
        <h2>📋 리뷰 목록</h2>
        {reviews.length === 0 ? (
          <p>리뷰가 없습니다.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="review-card">
              <h3>{r.title}</h3>
              <p>⭐ {r.rating}</p>
              <p>{r.content}</p>
              <p className="author">
                작성자: {r.user?.displayName || r.user?.email || "익명"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewPage;
