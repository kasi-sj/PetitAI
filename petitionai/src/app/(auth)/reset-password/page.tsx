"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth"; // Import the resetPassword action

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Store success messages
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const router = useRouter();
  const searchParams = useSearchParams(); // Get the token from the URL
  const token = searchParams?.get("token"); // Assume the token is passed as a query parameter

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Reset error message before new password reset attempt
    setSuccessMessage(""); // Reset success message

    if (!token) {
      setErrorMessage("Invalid or expired reset token.");
      return;
    }

    const result = await resetPassword(token, data.newPassword); // Call the resetPassword action

    setLoading(false);
    if (result.success) {
      setSuccessMessage(result.message || "Password reset successful!");
      // Redirect to login page after success
      setTimeout(() => router.push("/sign-in"), 2000); // Adjust the redirect time
    } else {
      setErrorMessage(result.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex h-screen bg-white items-center justify-center">
      <div className="w-[800px] h-[500px] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-1/2 bg-slate-500 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-semibold -mt-2 text-center mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-[#ffffff] text-black border-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password"
                {...register("newPassword", {
                  required: "New password is required",
                })}
              />
              {errors.newPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-[#ffffff] text-black border-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your new password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword.message}
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
              {loading ? "Resetting..." : "Reset Password"}
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
        <div className="w-1/2 bg-slate flex items-center justify-center text-white p-10">
          <Image
            src="/login.jpg"
            alt="Reset Password"
            className="z-20 -ml-2"
            width={320}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
