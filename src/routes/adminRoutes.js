import { Router } from "express";
import {
    getAdminDashboardPage,
    getAdminProductsPage,
    getAdminUsersPage,
    getAdminOrdersPage,
    getAdminSettingsPage,
} from "../controllers/pageController.js";
import { isAuthenticated, requireRole } from "../middleware/roleMiddleware.js";
import { promoteUser } from "../controllers/userController.js";

const router = Router();

// Todas as rotas deste arquivo requerem autenticação e role 'admin' ou 'staff'
router.use(isAuthenticated, requireRole(['admin', 'staff']));

router.get('/admin/dashboard', getAdminDashboardPage);
router.get('/admin/products', getAdminProductsPage);
router.get('/admin/users', getAdminUsersPage);
router.get('/admin/orders', getAdminOrdersPage);
router.get('/admin/settings', getAdminSettingsPage);

// Rota para alterar role de um usuário - apenas admin
router.put('/admin/users/:id/role', isAuthenticated, requireRole('admin'), promoteUser);

export default router;