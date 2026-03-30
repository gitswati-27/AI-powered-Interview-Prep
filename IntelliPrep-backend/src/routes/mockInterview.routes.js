const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  startInterview,
  submitAnswer,
  getInterviewResults
} = require("../controllers/mockInterview.controller");

router.post("/start", auth, startInterview);
router.post("/answer", auth, submitAnswer);
router.get("/results/:interviewId", auth, getInterviewResults);

module.exports = router;
