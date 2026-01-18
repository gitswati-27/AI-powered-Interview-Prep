const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth.middleware");
const { uploadResume } = require("../controllers/resume.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", auth, upload.single("resume"), uploadResume);

module.exports = router;
