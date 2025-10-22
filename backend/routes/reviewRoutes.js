import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import Review from "../models/Review.js";

const router = express.Router();

// 전체 리뷰 조회
router.get("/", async (req, res) => {
  const reviews = await Review.find().populate("user", "username");
  res.json(reviews);
});

// 리뷰 등록
router.post("/", protectRoute, async (req, res) => {
  try {
    const review = new Review({ ...req.body, user: req.user.id });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "리뷰 등록 실패", error: error.message });
  }
});

// 리뷰 수정
router.put("/:id", protectRoute, async (req, res) => {
  const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// 리뷰 삭제
router.delete("/:id", protectRoute, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "리뷰 삭제 완료" });
});

export default router;
