import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ATS from "./pages/ATS";
import Interview from "./pages/Interview";
import Results from "./pages/Results";


function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false}/>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ats" element={<ATS />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;