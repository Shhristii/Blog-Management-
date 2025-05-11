import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthProvider";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Add this line to access the login function

  return (
    <div className="min-h-screen bg-fuchsia-400 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Blog</h2>
        <ToastContainer />
        <Formik
          initialValues={{ title: "", content: "", image: "" }}
          // Updated initial values to include image
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(2, "Too Short!")
              .max(100, "Too Long!")
              .required("Title Required"),
            content: Yup.string()
              .min(10, "Too Short!")
              .max(1000, "Too Long!")
              .required("Content Required"),
            image: Yup.string().url("Invalid URL").required("Image Required"),
          })}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              const res = await axios.post(
                "https://blog-hqx2.onrender.com/blog",
                values
              );

              // Our updated backend now returns both token and user

              // Store in localStorage
              //   localStorage.setItem("token", token);
              //   localStorage.setItem("user", JSON.stringify(user));

              // Update context

              toast.success(
                "Blog created successfully! Redirecting to home..."
              );
              resetForm();

              setTimeout(() => {
                navigate("/");
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
                  name="content"
                  type="text"
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
                  Image URL
                </label>
                <Field
                  name="image"
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
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
