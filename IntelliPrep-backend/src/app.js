const express = require("express");

//routes
const interviewRoutes = require("./routes/interview.routes");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const atsRoutes = require("./routes/ats.routes");

const app = express();


app.use(express.json());
app.use("/api/interview", interviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ats", atsRoutes);

app.get("/", (req,res)=>{
    res.send("Backend working fine");
});

module.exports = app;
