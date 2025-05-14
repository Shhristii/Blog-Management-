import axios from "axios";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      console.error("User not logged in.");
      setLoading(false);
      return;
    }

    setUser(storedUser);

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `https://blog-hqx2.onrender.com/blog/${storedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlogs(res.data || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleUpdateUser = async (values, { setSubmitting }) => {
    try {
      // Simulate update by modifying local storage
      const updatedUser = { ...user, ...values };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("User info updated locally!");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update user info locally.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user)
    return (
      <div className="text-center mt-10 text-red-500">
        No user data found. Please log in.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          User Profile
        </h2>

        {!editing ? (
          <>
            <div className="space-y-4 text-gray-800">
              <div><strong>Name:</strong> {user.name || "N/A"}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>User ID:</strong> {user._id}</div>
              <div><strong>Total Blogs:</strong> {blogs.length}</div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Update Info
            </button>
          </>
        ) : (
          <Formik
            initialValues={{ name: user.name || "", email: user.email }}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            })}
            onSubmit={handleUpdateUser}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Field
                    name="name"
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">
            Your Blog Titles
          </h3>
          {blogs.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              {blogs.map((blog) => (
                <li key={blog._id}>{blog.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have not written any blogs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
