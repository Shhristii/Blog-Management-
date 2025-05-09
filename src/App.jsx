import React from "react";
import { Route, Routes } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";

import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </>
  );
};

export default App;
