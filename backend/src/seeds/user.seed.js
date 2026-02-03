import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { ConnectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const rawUsers = [
  { name: "Aarav Sharma", gender: "Male", password: "Aarav@123" },
  { name: "Ananya Verma", gender: "Female", password: "Ananya@123" },
  { name: "Rohan Mehta", gender: "Male", password: "Rohan@123" },
  { name: "Priya Singh", gender: "Female", password: "Priya@123" },
  { name: "Kunal Patel", gender: "Male", password: "Kunal@123" },
  { name: "Neha Gupta", gender: "Female", password: "Neha@123" },
  { name: "Aditya Malhotra", gender: "Male", password: "Aditya@123" },
  { name: "Pooja Khanna", gender: "Female", password: "Pooja@123" },
  { name: "Rahul Kapoor", gender: "Male", password: "Rahul@123" },
  { name: "Simran Kaur", gender: "Female", password: "Simran@123" },
  { name: "Vikram Joshi", gender: "Male", password: "Vikram@123" },
  { name: "Isha Arora", gender: "Female", password: "Isha@123" },
  { name: "Siddharth Jain", gender: "Male", password: "Siddharth@123" },
  { name: "Kavya Nair", gender: "Female", password: "Kavya@123" },
  { name: "Mohit Bansal", gender: "Male", password: "Mohit@123" },
];

const seedDatabase = async () => {
  try {
    await ConnectDB();
    await User.deleteMany();

    const users = await Promise.all(
      rawUsers.map(async (user, index) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const firstName = user.name.split(" ")[0].toLowerCase();

        return {
          full_Name: user.name,
          phone: `98${(10000000 + index).toString()}`,
          email: `${firstName}${index + 1}@chatapp.com`,
          password: hashedPassword, // 🔐 hashed save
          dob: new Date(1992 + index, index % 12, (index % 28) + 1),
          gender: user.gender,
          profilePic:
            user.gender === "Male"
              ? `https://randomuser.me/api/portraits/men/${index + 10}.jpg`
              : `https://randomuser.me/api/portraits/women/${index + 10}.jpg`,
        };
      })
    );

    await User.insertMany(users);

    console.log("✅ 15 users with DIFFERENT passwords seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
