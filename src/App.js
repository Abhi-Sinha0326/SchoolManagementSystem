import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/signupPage';
import StudentsPage from './pages/StudentsPage';
import UserHomePage from "./pages/UserHomePage";
import ScoreCard from "./pages/ScoreCard";
import AdminLogin from "./pages/AdminLogin";
import PageNotFound from "./pages/errorPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
    }
  
    return () => {
      localStorage.removeItem("userId");
    };
  }, [userId]);
  

  return ( 
    <>
      <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
        <Routes>
          <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<UserHomePage userId={userId} />} />
          <Route path="/scoreCard" element={<ScoreCard userId={userId} />} />
          <Route path="/adminLogin" element={<AdminLogin userId={userId} />} />
          <Route path="/studentsPage" element={<StudentsPage userId={userId} />} />
          <Route path="/about" element={<PageNotFound />} />
          <Route path="/contact" element={<PageNotFound />} /> 
        </Routes>
      </Router>
    </>
  );
};

export default App;
