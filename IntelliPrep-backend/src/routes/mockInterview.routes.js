const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  startInterview,
  submitAnswer,
  getInterviewResults
} = require("../controllers/mockInterview.controller");

// 🎙️ Start interview
router.post("/start", auth, startInterview);

// 📤 Submit answer
router.post("/answer", auth, submitAnswer);

// 📊 Get latest interview results
router.get("/results", auth, getInterviewResults);

module.exports = router;