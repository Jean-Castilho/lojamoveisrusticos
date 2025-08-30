import { Router } from "express";
import {
    getAdminDashboardPage,
    getAdminProductsPage,
    getAdminUsersPage,
    getAdminOrdersPage,
    getAdminSettingsPage,
} from "../controllers/pageController.js";

const router = Router();

router.get('/admin/dashboard', getAdminDashboardPage);
router.get('/admin/products', getAdminProductsPage);
router.get('/admin/users', getAdminUsersPage);
router.get('/admin/orders', getAdminOrdersPage);
router.get('/admin/settings', getAdminSettingsPage);

export default router;