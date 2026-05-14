const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  generateQuestions
} = require("../controllers/question.controller");

router.post("/generate", auth, generateQuestions);

module.exports = router;