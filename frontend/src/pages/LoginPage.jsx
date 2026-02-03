import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthImagePattern from "../component/AuthImagePattern";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("email"); // email or phone
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loginType === "email" && !formData.email.trim()) {
      return toast.error("Email is required");
    }
    if (loginType === "phone" && !formData.phone.trim()) {
      return toast.error("Phone is required");
    }
    if (!formData.password.trim()) {
      return toast.error("Password is required");
    }

    login({
      password: formData.password,
      ...(loginType === "email"
        ? { email: formData.email }
        : { phone: formData.phone }),
    });
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dropdown + Dynamic Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Login with</span>
              </label>
              <div className="flex gap-2">
                {/* Dropdown */}
                <select
                  className="select select-bordered w-32"
                  value={loginType}
                  onChange={(e) => setLoginType(e.target.value)}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>

                {/* Dynamic Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    {loginType === "email" ? (
                      <Mail className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <Phone className="h-5 w-5 text-base-content/40" />
                    )}
                  </div>

                  <input
                    type={loginType === "email" ? "email" : "tel"}
                    className="input input-bordered w-full pl-10"
                    placeholder={
                      loginType === "email"
                        ? "you@example.com"
                        : "Enter phone number"
                    }
                    value={
                      loginType === "email"
                        ? formData.email
                        : formData.phone
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [loginType]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};

export default LoginPage;
