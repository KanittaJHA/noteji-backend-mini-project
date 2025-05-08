import express from "express";
import { createAccount, login, getUser, logout } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/create-account", createAccount);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-user", authenticateToken, getUser);

export default router;
