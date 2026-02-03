import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessagesSquare,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../component/AuthImagePattern";
import toast from "react-hot-toast";
const SignUpPage = () => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_Name: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });
  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.full_Name.trim()) return toast.error("Full Name is required");
    if (!formData.phone.trim()) return toast.error("Phone is required");
    if (formData.phone.length < 10)
      return toast.error("Enter a valid phone number");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+/.test(formData.email))
      return toast.error("Invalid Email Format");
    if (!formData.password.trim())
      return toast.error("Password Must be required");
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(formData.password)
    )
      return toast.error(
        "Password must be at least 8 characters and include a letter, number, and special character",
      );
    if (!formData.dob.trim()) return toast.error("DOB is required");
    if (!formData.gender.trim()) return toast.error("Gender is required");
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* {left hand side} */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md  space-y-8">
          {/* {LOGO} */}
          <div className="text-center mb-8 pt-5">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessagesSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get Started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.full_Name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_Name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Phone</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Phone className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Gender</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="w-5 h-5 text-gray-500" />
                </div>

                <select
                  className="select select-bordered w-full pl-10"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>

                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date of Birth</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>

                <input
                  type="date"
                  className="input input-bordered w-full pl-10"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative">
                {/* Left lock icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>

                {/* Input */}
                <input
                  type={ShowPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />

                {/* Show / Hide button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!ShowPassword)}
                >
                  {ShowPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* {right side} */}
      <AuthImagePattern
        title="Join Our Community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
