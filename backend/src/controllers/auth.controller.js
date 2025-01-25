// backend\src\controllers\auth.controller.js
const { uploadImage } = require("../lib/cloudinary");
const { generateToken } = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");


const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Check if all fields are provided
        if (!fullName || !email || !password) {
            return res.status(400).json({ 
                message: "Please fill in all required fields" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please enter a valid email address" 
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ fullName, email, password: hashedPassword });
        generateToken(newUser._id, res);
        await newUser.save();
        // Send user data without password
        const { password: userPassword, ...userData } = newUser._doc;
        res.status(201).json({ 
            message: "User created successfully",
            user: userData 
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please provide both email and password" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please enter a valid email address" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        generateToken(user._id, res);

        // Send user data without password
        const { password: userPassword, ...userData } = user._doc;
        res.status(200).json({
            message: "Logged in successfully",
            user: userData
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = (req, res) => {
    try {
        // Clear the JWT cookie
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateProfile = async (req, res) => {
try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    if(!profilePic){
        return res.status(400).json({message:"Profile picture is required"});
    }
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const imageUrl = await uploadImage(profilePic);
    const updateUser = await User.findByIdAndUpdate(userId,{profilePic:imageUrl.secure_url},{new:true});
    await user.save();
    res.status(200).json({message:"Profile updated successfully",user});
} catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({message:"Internal server error"});
}
   
};

const checkAuth = (req, res) => {
    try {
        res.status(200).json({message:"User is authenticated",user:req.user});
    } catch (error) {
        console.error("Check auth error:", error);
        res.status(500).json({message:"Internal server error"});
    }
}
module.exports = { signup, login, logout, updateProfile,checkAuth };
