import { Router } from "express";
import {
    getLoginPage,
    getRegisterPage,
    getVerifyEmailCodePage,
    getVerifyNumberCodePage,
} from "../controllers/pageController.js";

import { postLoginUser, getLogout } from "../controllers/userController.js";
import { sendOtp, verifyAndRegister } from "../controllers/verifOtpController.js";

const router = Router();

// Renders pages
router.get("/login", getLoginPage);
router.get("/register", getRegisterPage);
router.get("/verify-email", getVerifyEmailCodePage);
router.get("/verify-number", getVerifyNumberCodePage);
router.get("/logout", getLogout);

// Handle login form submission
router.post("/action/login", postLoginUser);

// API routes for client-side fetch
router.post("/api/auth/send-otp", sendOtp);
router.post("/api/auth/verify-and-register", verifyAndRegister);


export default router;