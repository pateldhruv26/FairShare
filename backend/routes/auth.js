import express from "express";
import { signup, signin, signout, refreshToken } from '../controllers/auth.js';
import { googleAuth } from "../controllers/google.js";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh-token", refreshToken);
router.post("/google", googleAuth);

export default router;