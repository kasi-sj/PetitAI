"use server";
import axios from "axios";

export const login = async (email: string, password: string) => {
  try {
    const url = `${process.env.BACK_END_AUTH_URL}/users/login`;
    console.log([url, email, password, process.env.BACK_END_AUTH_URL]);

    const body = { email, hashedPassword: password };
    const response = await axios.post(url, body);

    console.log("Login successful:", response.data);
    return {
      success: true,
      token: response.data.token,
      userId: response.data.userId,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Unauthorized: Invalid email or password");
        return { success: false, message: "Invalid email or password" };
      } else {
        console.error("Login failed:", error.response?.status, error.message);
        return { success: false, message: "Login failed. Please try again." };
      }
    } else {
      console.error("Unexpected error:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  }
};

// Forgot Password Action
export const forgotPassword = async (email: string) => {
  try {
    const url = `${process.env.BACK_END_AUTH_URL}/users/forgot-password`;
    const body = { email: email };

    // Sending request to the backend
    console.log(url, body);
    const response = await axios.post(url, body);

    console.log(
      "Forgot password request successful:",
      response.status,
      response.data.substring(0, 200)
    );
    return {
      success: true,
      message: "Password reset email sent successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Check for a specific error response status
      if (error.response?.status === 404) {
        console.error("User not found:", error.message);
        return { success: false, message: "User not found with that email." };
      } else {
        console.error(
          "Forgot password request failed:",
          error.response?.status,
          error.message
        );
        return {
          success: false,
          message:
            "An error occurred while sending the password reset email. Please try again.",
        };
      }
    } else {
      console.error("Unexpected error:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  }
};

// Reset Password Action
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const url = `${process.env.BACK_END_AUTH_URL}/users/reset-password`;
    const body = { token: token, newPassword: newPassword };

    console.log("Reset password request:", url, body);
    // Sending request to the backend to reset the password
    const response = await axios.post(url, body);

    console.log("Password reset successful:", response.status);
    return {
      success: true,
      message: "Your password has been successfully reset.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Check for a specific error response status
      if (error.response?.status === 400) {
        console.error("Invalid token:", error.message);
        return { success: false, message: "Invalid or expired reset token." };
      } else {
        console.error(
          "Password reset failed:",
          error.response?.status,
          error.message
        );
        return {
          success: false,
          message:
            "An error occurred while resetting your password. Please try again.",
        };
      }
    } else {
      console.error("Unexpected error:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  }
};

export const verifyToken = async (token: string | null) => {
  try {
    const url = `${process.env.BACK_END_AUTH_URL}/jwtVerify`;
    const header = { Authorization: `Bearer ${token}` };

    console.log("Verify token request:", url, header);
    // Sending request to the backend to verify the token
    const response = await axios.get(url, { headers: header });
    console.log(response.data);
    if (response.data != true) {
      return { success: false, message: "Invalid or expired token." };
    } else {
      console.log("Token verification successful:");
      return {
        success: true,
        message: "Token verified successfully.",
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Check for a specific error response status
      if (error.response?.status === 401) {
        console.error("Invalid token:", error.message);
        return { success: false, message: "Invalid or expired token." };
      } else {
        console.error(
          "Token verification failed:",
          error.response?.status,
          error.message
        );
        return {
          success: false,
          message:
            "An error occurred while verifying the token. Please try again.",
        };
      }
    } else {
      console.log(error);
      return { success: false, message: "An unexpected error occurred." };
    }
  }
};

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const url = `${process.env.BACK_END_AUTH_URL}/users/register`;
    const response = await axios.post(url, {
      name,
      email,
      hashedPassword: password,
    });

    console.log(response.status, response.data.substring(0, 200));
    return {
      success: true,
      message:
        "Registration successful! Please check your email for verification.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific HTTP status codes
      if (error.response.status === 409) {
        return { success: false, message: "Email already registered!" };
      }
      return {
        success: false,
        message: error.response.data?.message || "Registration failed!",
      };
    }
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
