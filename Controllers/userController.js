import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await userModel.findOne({
      email: { $regex: new RegExp(email, "i") },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new userModel({ email, password, name, username });
    await newUser.save(); 

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userToSend = { ...newUser._doc };
    delete userToSend.password;

    res.status(201).json({ user: userToSend, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("Received Password:", password); 

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log("Stored Hashed Password:", user.password); 

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); 

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = user.createJWT();
    return res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
    return next(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
