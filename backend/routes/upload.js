import AWS from "aws-sdk";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

const router = express.Router();

// ✅ AWS 설정 (비어 있으면 무시)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
} else {
  console.log("⚠️ AWS 비활성화 상태 - S3 관련 기능은 동작하지 않음");
}

// ✅ S3 스토리지 설정
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME || "default-bucket",
    acl: "public-read",
    key: (req, file, cb) => {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    },
  }),
});

// ✅ 업로드 라우트
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "파일이 없습니다." });
  }
  res.status(200).json({ imageUrl: req.file.location });
});

// ✅ ESM export
export default router;
