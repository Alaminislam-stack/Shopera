import express from "express";
import { userAuthMiddelware } from "../middlewares/auth.meddleware.js";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controllers.js";

const router = express.Router();

router.post("/createProduct", userAuthMiddelware, createProduct);
router.post("/getProducts", userAuthMiddelware, getProducts);
router.post("/updateProduct", userAuthMiddelware, updateProduct);
router.post("/deleteProduct", userAuthMiddelware, deleteProduct);

// sele
// router.post("/addSalesProduct", userAuthMiddelware, addSalesProduct);

export default router;