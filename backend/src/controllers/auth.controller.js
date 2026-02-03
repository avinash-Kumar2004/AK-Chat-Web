import { generateToken } from "../lib/utlis.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from '../lib/cloudinary.js'
export const signup = async (req, res) => {
  const { full_Name, phone, email, password, dob, gender, profile_Pic } =
    req.body;
  try {
    if (!full_Name || !email || !phone || !password || !dob || !gender) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }
    if (password.length < 8 || phone.length !== 10) {
  return res.status(400).json({
    message: "Password must be at least 8 characters and phone must be 10 digits",
  });
}
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone number already exists",
      });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      full_Name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      dob,
      gender,
      profile_Pic,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        full_Name: newUser.full_Name,
        email: newUser.email,
        dob: newUser.dob,
        gender: newUser.gender,
        profile_Pic: newUser.profile_Pic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email or phone already exists",
      });
    }

    console.log("Error in SignUp Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login =async (req, res) => {
  const {email,phone,password} = req.body
  try {
     if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    const user = await User.findOne({$or:[email?{email:email.toLowerCase()}:null,phone?{phone}:null].filter(Boolean)})
    if(!user){
      return res.status(400).json({message:"Invalid Crediental"})
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Crediental"})
    }
    generateToken(user._id,res)
    res.status(200).json({
      _id:user._id,
      full_Name:user.full_Name,
      email:user.email,
      phone:user.phone,
      age:user.age,
      gender:user.gender,
      dob:user.dob,
      profile_Pic:user.profile_Pic
    })
  } catch (error) {
    console.log("Error in the Login controller:",error.message);
    res.status(500).json({message:"Internal Server Error"}) 
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
  } catch (error) {
    console.log("Error in logout Controller:",error.message); 
    res.status(500).json({message:"Internal Server error"})
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "avatars",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, // ✅ SAME NAME
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};


export const checkAuth = (req,res)=>{
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log('Error in CheckAuth Controller:',error.message);
   res.status(500).json({message:"Internal Server Error in checkauth"})
  }
}
