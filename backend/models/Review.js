import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  rating: { type: Number, required: true, min: 0, max: 10 },
  content: { type: String, required: true },
  imageUrl: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
