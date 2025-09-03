import { Router } from "express";
import {
    getHomePage,
    getProductsPage,
    getAboutPage,
    getContactPage,
    getCartPage,
    getFavoritesPage,
    getPixPaymentPage,
    getProfilePage
} from "../controllers/pageController.js";
import { isAuthenticated } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", getHomePage);
router.get("/produtos", getProductsPage);
router.get("/sobre", getAboutPage);
router.get("/contato", getContactPage);
router.get("/cart", isAuthenticated, getCartPage);
router.get("/favoritos", isAuthenticated, getFavoritesPage);
router.get("/payment/pix", getPixPaymentPage);
router.get("/profile", isAuthenticated, getProfilePage);

export default router;