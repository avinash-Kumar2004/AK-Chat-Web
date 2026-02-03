import mongoose from "mongoose";
const userScehma = new mongoose.Schema(
  {
    full_Name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique:true,
      match: [/^[0-9]{10}$/, "Invalid phone number"],
    },
    email: {
      type: String,
      required: true,
      lowercase:true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userScehma);
export default User;
