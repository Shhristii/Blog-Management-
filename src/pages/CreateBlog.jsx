import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthProvider";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null); // For storing the image file
  const [imageError, setImageError] = useState("");
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageError("");
    }
  };

  return (
    <div className="min-h-screen bg-fuchsia-400 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Blog</h2>
        <ToastContainer />
        <Formik
          initialValues={{ title: "", content: "" }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(2, "Too Short!")
              .max(100, "Too Long!")
              .required("Title Required"),
            content: Yup.string()
              .min(10, "Too Short!")
              .max(1000, "Too Long!")
              .required("Content Required"),
          })}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              if (!file) {
                setImageError("Please upload an image");
                return;
              }

              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("content", values.content);
              formData.append("image", file);
              
              // Check if user data exists before appending
              if (user?._id) {
                formData.append("userId", user._id);
                formData.append("author", user._id); // Author should be the user's ObjectId
              }
              if (user?.name) {
                formData.append("username", user.name);
              }
              if (user?.email) formData.append("email", user.email);

              const res = await axios.post(
                "https://blog-hqx2.onrender.com/blog/create",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              toast.success(
                "Blog created successfully! Redirecting to home..."
              );
              resetForm();
              setFile(null);

              setTimeout(() => {
                navigate("/home");
              }, 1500);
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                  "Blog creation failed! Please check your details."
              );
              console.error(
                "Blog creation error:",
                error.response?.data || error.message
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Field
                  name="title"
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <Field
                  as="textarea"
                  name="content"
                  rows="4"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {imageError && (
                  <div className="text-red-500 text-sm mt-1">{imageError}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                {isSubmitting ? "Creating..." : "Create Blog"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateBlog;