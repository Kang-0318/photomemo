import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// ✅ 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 미들웨어
app.use(cors({
  origin: process.env.FRONT_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// ✅ DB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err.message));

// ✅ 기본 테스트 라우트
app.get("/", (_req, res) => res.send("Game Review API OK"));

// ✅ 라우트 임포트
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"; // 🎮 추가
import uploadRoutes from "./routes/upload.js";

// ✅ 라우트 등록
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes); // 🎮 추가

// ✅ 404 처리
app.use((req, res) => {
  res.status(404).json({ message: "요청하신 경로를 찾을 수 없습니다." });
});

// ✅ 에러 처리 (500)
app.use((err, req, res, next) => {
  console.error("🚨 서버 오류:", err);
  res.status(500).json({ message: "서버 내부 오류", error: err.message });
});

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
