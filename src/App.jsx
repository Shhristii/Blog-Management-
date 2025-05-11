import React from "react";
import { Route, Routes } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-blog" element={<CreateBlog/>} />

      </Routes>
    </>
  );
};

export default App;
