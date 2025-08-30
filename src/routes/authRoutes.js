import { Router } from "express";
import {
    getLoginPage,
    getRegisterPage,
    getVerifyEmailCodePage,
    getVerifyNumberCodePage,
} from "../controllers/pageController.js";

import {
    postRegisterUser,
    postLoginUser,
    verifyEmailCode,
    verifyNumberCode,
    getLogout
} from "../controllers/userController.js";

const router = Router();

router.get("/login", getLoginPage);
router.get("/register", getRegisterPage);
router.get("/verify-email", getVerifyEmailCodePage);
router.get("/verify-number", getVerifyNumberCodePage);
router.get("/logout", getLogout);

router.post("/action/register", postRegisterUser);
router.post("/action/login", postLoginUser);
router.post("/action/verify-email", verifyEmailCode);
router.post("/action/verify-number", verifyNumberCode);

export default router;