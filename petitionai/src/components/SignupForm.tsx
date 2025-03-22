"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { registerUser } from "@/actions/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Strong Password Schema
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const result = await registerUser(data.name, data.email, data.password);

    if (result.success) {
      setSuccessMessage(
        "Verification email sent. Please check your inbox to verify your account."
      );
    } else {
      setErrorMessage(result.message || "Failed to create an account.");
    }

    setLoading(false);
  };

  const handleGoogleSignup = () => {
    router.replace(
      `https://petit-ai-auth.onrender.com/oauth2/authorization/google`
    );
  };

  return (
    <div className="flex h-screen bg-white items-center justify-center">
      <div className="w-[800px] h-[550px] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-1/2 bg-slate-500 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-semibold -mt-2 text-center mb-6">
            Sign up for PetitAI
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white text-black border-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white text-black border-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-lg bg-[#ffffff] text-black border-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <p className="text-green-500 text-sm text-center bg-green-100 py-2 rounded-md">
                {successMessage}
              </p>
            )}

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center bg-red-100 py-2 rounded-md">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Sending verification email..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-2 mt-3 rounded-lg bg-white text-[#11182E] font-semibold shadow-md hover:bg-gray-100 transition"
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account ?{" "}
            <a
              href="/sign-in"
              className="text-slate-900 font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-slate-800 flex items-center justify-center text-white p-10">
          <Image
            src="/login.jpg"
            alt="signup"
            className="z-20 -ml-2"
            width={320}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
