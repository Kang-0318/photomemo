import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ CORS 설정 (프론트엔드 주소 명시)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ 라우터 연결
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ DB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 완료"))
  .catch(err => console.error("❌ MongoDB 연결 실패:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
