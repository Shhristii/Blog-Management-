import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Add this line to access the login function

  return (
    <div className="min-h-screen bg-fuchsia-400 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <ToastContainer />
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Invalid email")
              .required("Email Required"),
            password: Yup.string()
              .min(8, "Too Short!")
              .max(50, "Too Long!")
              .required("Password Required"),
          })}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              const res = await axios.post(
                "http://localhost:8000/login",
                values
              );

              // Our updated backend now returns both token and user
              const { token, user } = res.data;

              // Store in localStorage
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(user));

              // Update context
              login(token, user);

              toast.success("Login successful! Redirecting to home...");
              resetForm();

              setTimeout(() => {
                navigate("/");
              }, 1500);
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                  "Login failed! Please check your credentials."
              );
              console.error(
                "Login error:",
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
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
