import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthProvider";

const SingleBlogPage = () => {
  const { blogId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get blog data from location state or localStorage
    const getBlogData = () => {
      // First try to get from location state
      if (location.state?.blog) {
        setBlog(processBlogData(location.state.blog));
        setLoading(false);
        return;
      }

      // If not in location state, try to get from localStorage
      try {
        const allBlogs = JSON.parse(localStorage.getItem("allBlogs")) || [];
        const foundBlog = allBlogs.find(b => b._id === blogId);
        
        if (foundBlog) {
          setBlog(processBlogData(foundBlog));
          setLoading(false);
          return;
        }
        
        // If blog is not found in localStorage either
        setError("Blog post not found. Please go back to the blogs page.");
        setLoading(false);
      } catch (err) {
        console.error("Error retrieving blog data:", err);
        setError("There was an error loading the blog. Please try again.");
        setLoading(false);
      }
    };

    getBlogData();
  }, [blogId, location.state]);

  const processBlogData = (blogData) => {
    return {
      ...blogData,
      tags: blogData.tags || [],
      author: blogData.author || {
        avatar: "/default-avatar.png",
        name: blogData.username || "Unknown Author",
        bio: "",
      },
      imageUrl: blogData.image || "/default-blog.jpg",
      publishDate: blogData.createdAt
        ? new Date(blogData.createdAt).toLocaleDateString()
        : "Unknown date",
      readTime: blogData.readTime || "5 min read",
    };
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this blog?"
      );
      if (!confirmDelete) return;

      await fetch(`https://blog-hqx2.onrender.com/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Blog deleted successfully!");
      navigate("/blog");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-red-500">{error}</h2>
        <Link to="/blog" className="mt-4 text-blue-500 hover:underline">
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold">Blog post not found</h2>
        <Link to="/blog" className="mt-4 text-blue-500 hover:underline">
          Back to Blogs
        </Link>
      </div>
    );
  }

  const isAuthor = user?._id === blog.author?._id || user?._id === blog.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
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
            ></path>
          </svg>
          Back to All Blogs
        </Link>

        {/* Edit/Delete buttons for author */}
        {isAuthor && (
          <div className="flex space-x-3">
            <Link
              to={`/edit-blog/${blogId}`}
              state={{ blog }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

        <div className="flex items-center mb-4">
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="w-10 h-10 rounded-full mr-4"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div>
            <p className="font-medium">{blog.author.name}</p>
            <div className="flex text-sm text-gray-500">
              <span>{blog.publishDate}</span>
              <span className="mx-2">•</span>
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
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
      </div>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-auto rounded-lg shadow-md"
          onError={(e) => {
            e.target.src = "/default-blog.jpg";
          }}
        />
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        {/* Use proper content display based on format */}
        {typeof blog.content === 'string' && (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        )}
      </div>

      {/* Author Bio */}
      <div className="mt-12 pt-6 border-t border-gray-200 flex items-start">
        <img
          src={blog.author.avatar}
          alt={blog.author.name}
          className="w-12 h-12 rounded-full mr-4"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <div>
          <h3 className="font-bold text-lg">{blog.author.name}</h3>
          {blog.author.bio && (
            <p className="text-gray-600 mt-1">{blog.author.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;