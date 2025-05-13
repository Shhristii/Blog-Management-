import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthProvider";

const BlogActions = ({ blog, onDelete, className, buttonStyle = "icon" }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isAuthor =
    user && blog && (user._id === blog.author?._id || user._id === blog.userId);

  if (!isAuthor) return null;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this blog?"
      );
      if (!confirmDelete) return;

      await axios.delete(`https://blog-hqx2.onrender.com/blog/${blog._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Blog deleted successfully!");

      if (onDelete) {
        onDelete(blog._id);
      } else {
        navigate("/blog");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-blog/${blog._id}`, { state: { blog } });
  };

  if (buttonStyle === "icon") {
    return (
      <div className={`flex space-x-2 ${className}`}>
        <button
          onClick={handleEdit}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
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
        </button>

        <button
          onClick={handleDelete}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
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
        </button>
      </div>
    );
  }

  // Text buttons style
  return (
    <div className={`flex space-x-3 ${className}`}>
      <button
        onClick={handleEdit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
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
      </button>

      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
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
  );
};

BlogActions.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.object,
    userId: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func,
  className: PropTypes.string,
  buttonStyle: PropTypes.oneOf(["icon", "text"]),
};

export default BlogActions;