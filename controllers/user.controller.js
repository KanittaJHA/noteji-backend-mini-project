import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/user.model.js";

// Register
export const createAccount = async (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !validator.isEmail(email) || !password) {
        return next(new Error("Invalid input"));
    }

    if (!validator.isStrongPassword(password)) {
        return next(new Error("Weak password"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new Error("User exists"));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 14);

        const user = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { _id: user._id, email, fullName },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" }
        );

        const { password: _, ...userData } = user.toObject();

        res
            .cookie("accessToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .json({
                error: false,
                user: userData,
                accessToken: token,
                message: "Registration successfully"
            });
    } catch (error) {
        next(error);
    }
};

// Login
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new Error("Email and password required"));
    }

    try {
        const user = await User.findOne({ email });
        const isValid = user && await bcrypt.compare(password, user.password);

        if (!isValid) {
            return next(new Error("Invalid credentials"));
        }

        const payload = {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        };

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" }
        );

        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .json({
                error: false,
                user: payload,
                accessToken,
                message: "Login successfully"
            });
    } catch (error) {
        next(error);
    }
};

// Get User Info
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return next(new Error("User not found"));
        }

        res.json({
            error: false,
            user,
            message: "User info retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Logout (optional)
export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        secure: process.env.NODE_ENV === "production"
    });

    res.json({
        error: false,
        message: "Logged out successfully"
    });
};
