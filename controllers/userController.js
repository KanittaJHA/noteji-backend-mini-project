import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/user.model.js";

// Register
export const createAccount = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !validator.isEmail(email) || !password) {
        return res.status(400).json({
            error: true,
            message: "Invalid input"
        });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
            error: true,
            message: "Weak password"
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            error: true,
            message: "User exists"
        });
    }

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
        { expiresIn: "3h" }
    );

    const { password: _, ...userData } = user.toObject();

    res.json({
        error: false,
        user: userData,
        accessToken: token,
        message: "Registration successful"
    });
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Email and password required"
        });
    }

    const user = await User.findOne({ email });
    const isValid = user && await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(400).json({
            error: true,
            message: "Invalid credentials"
        });
    }

    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
    };

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
    );

    res.json({
        error: false,
        user: payload,
        accessToken,
        message: "Login successful"
    });
};

// Get User Info
export const getUser = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
        return res.sendStatus(401);
    }

    res.json({
        user,
        message: ""
    });
};
