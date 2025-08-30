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

const router = Router();

router.get("/", getHomePage);
router.get("/produtos", getProductsPage);
router.get("/sobre", getAboutPage);
router.get("/contato", getContactPage);
router.get("/cart", getCartPage);
router.get("/favoritos", getFavoritesPage);
router.get("/payment/pix", getPixPaymentPage);
router.get("/profile", getProfilePage);

export default router;