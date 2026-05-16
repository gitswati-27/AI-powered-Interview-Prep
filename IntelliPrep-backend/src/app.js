const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3001",
    "https://prep-with-prepwise.vercel.app/"
  ],
  credentials: true
}));

//routes
const interviewRoutes = require("./routes/interview.routes");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const atsRoutes = require("./routes/ats.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const mockInterviewRoutes = require("./routes/mockInterview.routes");
const questionRoutes = require("./routes/question.routes");


app.use(express.json());
app.use("/api/interview", interviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/mock-interview", mockInterviewRoutes);
app.use("/api/questions", questionRoutes);


app.get("/", (req,res)=>{
    res.send("Backend working fine");
});

module.exports = app;
