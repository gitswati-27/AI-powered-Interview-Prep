const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

router.get("/health", (req,res)=>{
    res.json({status: "OK", message: "Interview route working fine"});
});

//to check if jwt works i am creating this protected test route
router.get("/start", auth, (req, res) => {
  res.json({
    message: "Interview session can be started",
    userId: req.userId
  });
});


module.exports = router;