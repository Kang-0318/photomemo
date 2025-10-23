import express from "express";
import auth from "../middlewares/auth.js";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const reviews = await Review.find().populate("user", "email");
  res.json(reviews);
});

router.post("/", auth, async (req, res) => {
  try {
    const review = new Review({ ...req.body, user: req.user.id });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "리뷰 등록 실패", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", auth, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "리뷰 삭제 완료" });
});

export default router;
