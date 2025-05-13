import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios";

const MyBlogPage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://blog-hqx2.onrender.com/blog/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
        setError("Failed to load your blogs.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchUserBlogs();
  }, [user, token]);

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://blog-hqx2.onrender.com/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      toast.success("Blog deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete blog.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blogs.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-red-500">
          {error || "No blogs found"}
        </h2>
        <Link
          to="/create-blog"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Create your first blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Blogs</h1>
      <div className="space-y-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="border p-6 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <div className="flex gap-2">
                <Link
                  to={`/edit-blog/${blog._id}`}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Published on: {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-800 mb-3 line-clamp-3">
              {blog.summary || blog.content.slice(0, 150)}...
            </p>
            <Link
              to={`/blog/${blog._id}`}
              className="text-blue-500 hover:underline text-sm"
            >
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBlogPage;
