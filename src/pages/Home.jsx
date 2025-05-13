import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "../../components/BlogCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthProvider";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = React.useContext(AuthContext);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://blog-hqx2.onrender.com/blog");
      setBlogs(response.data);
      localStorage.setItem("allBlogs", JSON.stringify(response.data));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
      if (!confirmDelete) return;

      await axios.delete(`https://blog-hqx2.onrender.com/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      toast.success("Blog deleted successfully!");
      fetchBlogs(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <ToastContainer position="top-right" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Blog Posts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thoughtful articles, stories, and insights from our
            community of writers.
          </p>
        </div>

        {/* Create Blog CTA */}
        <div className="mb-10 flex justify-center">
          <Link
            to="/create-blog"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Blog
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-6 text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No blogs found
            </h3>
            <p className="mt-2 text-gray-600">
              Be the first one to create a blog post!
            </p>
            <Link
              to="/create-blog"
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
            >
              Create Blog
            </Link>
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="relative group">
                <Link
                  to={`/blog/${blog._id}`}
                  state={{ blog: blog }}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <Card
                    _id={blog._id}
                    title={blog.title}
                    content={blog.content}
                    image={blog.image}
                    author={blog.author || blog.username}
                    createdAt={blog.createdAt}
                  />
                </Link>
                
                {/* Edit/Delete buttons (only show if user is author) */}
                {(user?._id === blog.author?._id || user?._id === blog.userId) && (
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      state={{ blog: blog }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(blog._id);
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;