/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = ({ onGuestLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Login failed");
      return response;
    },
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleUser = {
        email: decoded.email,
        googleId: decoded.sub,
        profilePicture: decoded.picture,
        fullName: decoded.name,
      };
      loginMutation(googleUser);
    } catch {
      toast.error("Google login failed");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };
return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="flex w-full max-w-4xl bg-white  overflow-hidden">
      
      {/* Left side - Image */}
      <div className="hidden md:block w-1/2 bg-white">
      <img src="/newsPage.jpg"alt="NewsAI Illustration" className="h-full w-full  object-contain" />

      </div>

      {/* Right side - Login Form */}
      
      <div className="w-full md:w-1/2 p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Welcome to NewsAI</h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to catch up on the latest Indian stories and headlines.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="pl-10 w-full input input-bordered rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <MdPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pl-10 w-full input input-bordered rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>

          {isError && <p className="text-red-500 text-sm">{error.message}</p>}

          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition"
          >
            Continue as Guest
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>

    </div>
  </div>
);
}
export default LoginPage;