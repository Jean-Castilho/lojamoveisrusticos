import { Router } from "express";
import publicRoutes from "./publicRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = Router();

router.use(publicRoutes);
router.use(authRoutes);
router.use(adminRoutes);

export default router;