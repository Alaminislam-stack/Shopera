import express from "express";
import { userAuthMiddelware } from "../middlewares/auth.meddleware.js";
import {
  createSale,
  getSales,
  updateSale,
  deleteSale,
} from "../controllers/sales.controllers.js";

const router = express.Router();

router.post("/createSale", userAuthMiddelware, createSale);
router.post("/getSales", userAuthMiddelware, getSales);
router.post("/updateSale", userAuthMiddelware, updateSale);
router.post("/deleteSale", userAuthMiddelware, deleteSale);

export default router;
