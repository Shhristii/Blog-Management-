import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import BlogActions from "./BlogAction";
import PropTypes from "prop-types";

const BlogCard = ({
  title,
  content,
  image,
  author,
  createdAt,
  _id,
  onDelete,
}) => {
  const { user } = useContext(AuthContext);

  // Helper functions
  const truncateContent = (text, maxLength = 100) => {
    if (!text) return "";
    // Handle HTML content by stripping tags first
    const strippedText = text.replace(/<[^>]*>/g, "");
    if (strippedText.length <= maxLength) return strippedText;
    return strippedText.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const getAuthorName = () => {
    if (!author) return "Anonymous";
    if (typeof author === "object") return author.name || "Anonymous";
    return author;
  };

  const getAuthorInitial = () => {
    const name = getAuthorName();
    return name.charAt(0).toUpperCase();
  };

  // Random background color for placeholder images
  const getRandomGradient = () => {
    const gradients = [
      "from-blue-400 to-indigo-500",
      "from-indigo-400 to-purple-500",
      "from-purple-400 to-pink-500",
      "from-pink-400 to-red-500",
      "from-red-400 to-yellow-500",
      "from-yellow-400 to-green-500",
      "from-green-400 to-teal-500",
      "from-teal-400 to-blue-500",
    ];
    // Use blog ID to make the color consistent for the same blog
    const index = _id
      ? _id.charCodeAt(0) % gradients.length
      : Math.floor(Math.random() * gradients.length);
    return gradients[index];
  };

  // Check if current user is the author
  const isAuthor =
    user &&
    (user._id === author?._id ||
      (typeof author === "string" && user._id === author));

  const blogData = {
    _id,
    author,
    userId: typeof author !== "object" ? author : null,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col group relative">
      {/* Edit/Delete Actions - Absolute positioned on hover */}
      <BlogActions
        blog={blogData}
        onDelete={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        buttonStyle="icon"
      />

      <div className="h-48 w-full overflow-hidden relative">
        {image ? (
          <img
            src={image}
            alt={`Cover for ${title}`}
            className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='288' height='192' viewBox='0 0 288 192'%3E%3Crect width='288' height='192' fill='%23CCCCCC'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='24' fill='%23666666'%3EImage not available%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-r ${getRandomGradient()} flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2 hover:text-indigo-600 transition-colors duration-200">
            {title || "Untitled Post"}
          </h2>
          {createdAt && (
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0 mt-1">
              {formatDate(createdAt)}
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {truncateContent(content) || "No content available"}
        </p>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
          <div className="flex items-center">
            <div className="bg-indigo-100 h-8 w-8 rounded-full flex items-center justify-center text-indigo-800 font-semibold">
              {getAuthorInitial()}
            </div>
            <span className="ml-2 text-sm text-gray-700 truncate max-w-[100px]">
              {getAuthorName()}
            </span>
          </div>

          <span
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md transition-colors duration-200 hover:bg-indigo-700"
            role="button"
            aria-label={`Read more about ${title}`}
          >
            Read More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  image: PropTypes.string,
  author: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  createdAt: PropTypes.string,
  _id: PropTypes.string,
  onDelete: PropTypes.func,
};

export default BlogCard;
