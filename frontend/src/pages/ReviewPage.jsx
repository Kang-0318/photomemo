import axios from "axios";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    genre: "",
    rating: "",
    content: "",
  });

  useEffect(() => {
    axios.get("/api/reviews").then(res => setReviews(res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post("/api/reviews", form);
    const { data } = await axios.get("/api/reviews");
    setReviews(data);
  };

  return (
    <div className="review-page">
      <h1>🎮 게임 리뷰 작성</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="게임 제목" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="장르" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
        <input type="number" placeholder="평점 (0~10)" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
        <textarea placeholder="리뷰 내용" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}></textarea>
        <button type="submit">업로드</button>
      </form>

      <h2>📜 등록된 리뷰</h2>
      <ul>
        {reviews.map(r => (
          <li key={r._id}>
            <h3>{r.title} ({r.rating}/10)</h3>
            <p>{r.genre}</p>
            <p>{r.content}</p>
            <small>by {r.user?.username || "익명"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
