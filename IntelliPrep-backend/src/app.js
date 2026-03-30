const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

//routes
const interviewRoutes = require("./routes/interview.routes");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const atsRoutes = require("./routes/ats.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const mockInterviewRoutes = require("./routes/mockInterview.routes");


app.use(express.json());
app.use("/api/interview", interviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/mock-interview", mockInterviewRoutes);

app.get("/", (req,res)=>{
    res.send("Backend working fine");
});

module.exports = app;
