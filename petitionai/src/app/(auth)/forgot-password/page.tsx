"use client";

import { useForm } from "react-hook-form";
import {  useState } from "react";
import Image from "next/image";
import { forgotPassword } from "@/actions/auth"; // Import the forgotPassword action

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Store success messages
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setErrorMessage(""); // Reset error message before new password reset attempt
    setSuccessMessage(""); // Reset success message

    const result = await forgotPassword(data.email); // Call the forgotPassword action

    setLoading(false);
    if (result.success) {
      setSuccessMessage("Password reset link sent successfully!");
      // Redirect to login page after success
    } else {
      setErrorMessage(result.message || "Failed to send password reset link.");
    }
  };

  return (
    <div className="flex h-screen bg-white items-center justify-center">
      <div className="w-[800px] h-[500px] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-1/2 bg-slate-500 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-semibold -mt-2 text-center mb-6">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white text-black border-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Display error message */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center bg-red-100 py-2 rounded-md">
                {errorMessage}
              </p>
            )}

            {/* Display success message */}
            {successMessage && (
              <p className="text-green-500 text-sm text-center bg-green-100 py-2 rounded-md">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Remembered your password?{" "}
            <a href="/sign-in" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-slate-900 flex items-center justify-center text-white p-10">
          <Image
            src="/login.jpg"
            alt="Forgot Password"
            className="z-20 -ml-2"
            width={320}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
