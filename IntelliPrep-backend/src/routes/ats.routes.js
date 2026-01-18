const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { checkATS } = require("../controllers/ats.controller");

router.post("/check", auth, checkATS);

module.exports = router;
