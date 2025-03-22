"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { login } from "@/actions/auth";
import { useUserStore } from "@/utils/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUser } from "@/actions/user";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const { setUser } = useUserStore();
  const router = useRouter();


  // Handle redirect after Google sign-in
  const checkForSetup = async (userId: string, token: string) => {
    try {
      const user = await getUser(userId);
      if (user?.isSetUpCompleted) {
        setUser(userId, token);
        if (user?.isAdmin) {
          router.replace("/admin")
        } else {
          router.replace("/user");
        }
      } else {
        setUser(userId, token);
        router.replace("/set-up");
      }
      setLoading(false);
    } catch (error: unknown) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const error = urlParams.get("error");

    if (error) {
      setErrorMessage(error || "Google Sign-in failed. Email already Exists");
    }

    if (token && userId) {
      checkForSetup(userId, token);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage("");

    const result = await login(data.email, data.password);

    if (result.success) {
      checkForSetup(result.userId, result.token);
    } else {
      setErrorMessage(result.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    router.replace(
      `https://petit-ai-auth.onrender.com/oauth2/authorization/google`
    );
  };

  // if (user?.userId) {
  //   router.push("/user");
  // }

  return (
    <div className="flex h-screen bg-white  items-center justify-center">
      <div className="w-[800px] h-[500px] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-1/2 bg-slate-500 p-10 flex flex-col justify-center text-white">
          <h2 className="text-2xl font-semibold -mt-2 text-center mb-6">
            Sign in to PetitAI
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

            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-lg text-black bg-white border-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Type your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
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

            <div className="flex items-center justify-end text-sm">
              <a href="/forgot-password" className="text-white hover:underline">
                Forgot Password!
              </a>
            </div>

            {/* Display error message above login button */}
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
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2 mt-3 rounded-lg bg-white text-[#11182E] font-semibold shadow-md hover:bg-gray-100 transition"
            >
              <FcGoogle className="text-xl" />
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don&apos;t have an account ?{" "}
            <a
              href="/sign-up"
              className="text-slate-900 font-semibold  hover:underline"
            >
              Create Account
            </a>
          </p>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-slate-800 flex items-center justify-center text-white p-10">
          <Image
            src="/login.jpg"
            alt="log"
            className="z-20 -ml-2"
            width={320}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
