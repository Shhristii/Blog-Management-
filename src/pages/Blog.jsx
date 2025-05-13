import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios";

const SingleBlogPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://blog-hqx2.onrender.com/blog/single/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status !== 200) throw new Error("Blog not found");
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Blog not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this blog?"
      );
      if (!confirmDelete) return;

      const res = await axios.delete(
        `https://blog-hqx2.onrender.com/blog/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete blog");

      toast.success("Blog deleted successfully!");
      navigate("/blog");
    } catch (error) {
      toast.error(error.message || "Failed to delete blog");
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-red-500">
          {error || "Blog not found"}
        </h2>
        <Link to="/blog" className="mt-4 text-blue-500 hover:underline">
          Back to Blogs
        </Link>
      </div>
    );
  }

  const isAuthor = user?._id === blog.author?._id || user?._id === blog.userId;
  const publishDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-500 hover:underline"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to All Blogs
        </Link>

        {isAuthor && (
          <div className="flex space-x-3">
            <Link
              to={`/edit-blog/${blogId}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

      <div className="flex items-center mb-4">
        <img
          src={blog.author?.avatar || "/default-avatar.png"}
          alt={blog.author?.name || blog.username || "Author"}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <p className="font-medium">
            {blog.author?.name || blog.username || "Unknown Author"}
          </p>
          <div className="flex text-sm text-gray-500">
            <span>{publishDate}</span>
            <span className="mx-2">•</span>
            <span>{blog.readTime || "5 min read"}</span>
          </div>
        </div>
      </div>

      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <img
        src={blog.image || "/default-blog.jpg"}
        alt={blog.title}
        className="w-full h-auto rounded-lg shadow-md mb-8"
      />

      <div className="prose prose-lg max-w-none">
        {typeof blog.content === "string" && (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 flex items-start">
        <img
          src={blog.author?.avatar || "/default-avatar.png"}
          alt={blog.author?.name || blog.username || "Author"}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h3 className="font-bold text-lg">
            {blog.author?.name || blog.username || "Unknown Author"}
          </h3>
          {blog.author?.bio && (
            <p className="text-gray-600 mt-1">{blog.author.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
