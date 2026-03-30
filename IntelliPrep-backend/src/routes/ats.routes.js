const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { checkATS } = require("../controllers/ats.controller");
const multer = require("multer");
const upload = multer();

router.post("/check", auth, upload.single("resume"), checkATS);

module.exports = router;
