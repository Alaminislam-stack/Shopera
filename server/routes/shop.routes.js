import express from "express";
import { userAuthMiddelware } from "../middlewares/auth.meddleware.js";
import { createShop, deleteShop, getShop, updateShop } from "../controllers/shop.cotrollers.js";

const router = express.Router();

router.post("/createShop", userAuthMiddelware, createShop);
router.get("/getShop", userAuthMiddelware, getShop);
router.post("/updateShop", userAuthMiddelware, updateShop);
router.delete("/deleteShop", userAuthMiddelware, deleteShop);

export default router;