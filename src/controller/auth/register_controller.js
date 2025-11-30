import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../../models/User.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "Email or username existed" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Sign up successfully!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error when signup" });
  }
};
