import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body; // get refresh token from body

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error when logging out" });
  }
};
