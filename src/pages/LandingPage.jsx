import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

const LandingPage = () => {
  const { token } = useContext(AuthContext);
  return (
    <div
      className="min-h-screen bg-fuchsia-400 bg-cover bg-center flex flex-col items-center justify-center px-4"
      // Commented background image styling
      //   style={{
      //     backgroundImage: "url('/background.jpg')",
      //     backdropFilter: "blur",
      //   }}
    >
      <div className="bg-opacity-40 p-8 rounded-lg text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span className="text-yellow-300">Your BlogSpace</span>
        </h1>
        <p className="text-lg text-gray-200 mb-6">
          Share your thoughts, stories, and ideas with the world. Easy to use
          beautifully designed blogging platform.
        </p>
        {!token && ( // Changed to !token to show login/signup when NOT logged in
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 border border-teal-600 text-black-600 rounded-md font-semibold hover:bg-teal-50"
            >
              Sign Up
            </Link>
          </div>
        )}

        {token && ( // Show different options when user IS logged in
          <div className="flex justify-center gap-4">
            <Link
              to="/home"
              className="px-6 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/create-blog"
              className="px-6 py-2 border border-teal-600 text-black-600 rounded-md font-semibold hover:bg-teal-50"
            >
              Create New Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
