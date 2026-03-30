const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getATSAnalytics } = require("../controllers/analytics.controller");

router.get("/ats", auth, getATSAnalytics);

module.exports = router;
