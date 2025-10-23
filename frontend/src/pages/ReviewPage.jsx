import React, { useEffect, useState } from "react";
import api from "../api/client";
import "./style/ReviewPage.scss";

function ReviewPage({ user, token }) {
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  // ✅ 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/api/reviews");
      setReviews(data.reverse());
    } catch (error) {
      console.error("리뷰 가져오기 실패:", error);
    }
  };

  // ✅ 리뷰 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      await api.post("/api/reviews", { title, rating, content });
      setTitle("");
      setRating(5);
      setContent("");
      fetchReviews();
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록 실패");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="review-page">
      <h1>🎮 게임 리뷰 허브</h1>
      <p>게임 리뷰를 작성하고 공유해보세요!</p>

      {/* 리뷰 작성 영역 */}
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="게임 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>
              ⭐ {n}
            </option>
          ))}
        </select>

        <textarea
          placeholder="리뷰 내용을 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">등록하기</button>
      </form>

      {/* 리뷰 목록 */}
      <div className="review-list">
        <h2>📋 등록된 리뷰</h2>
        {reviews.length === 0 ? (
          <p>아직 등록된 리뷰가 없습니다.</p>
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
