import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ─── Helper to sign a token ───────────────────────────────────────────────────
const signToken = (user) => jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }                     // ← token lasts 7 days
);

// ─── Register ─────────────────────────────────────────────────────────────────
// router.post("/register", async (req, res) => {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         const existingUser = await User.findOne({
//             $or: [{ email }, { username }]  // ← check both are unique
//         });

//         if (existingUser) {
//             return res.status(409).json({ message: "Username or email already taken" });
//         }

//         const user = await User.create({ username, email, password });
//         const token = signToken(user);

//         res.status(201).json({
//             token,
//             user: { id: user._id, username: user.username, email: user.email }
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: err.message });
//     }
// });
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // ← Validate before hitting the DB
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already taken" });
        }

        const user = await User.create({ username, email, password });
        const token = signToken(user);

        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        // ← Handle Mongoose validation errors cleanly
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors)[0].message;
            return res.status(400).json({ message });
        }
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = signToken(user);

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

export default router;