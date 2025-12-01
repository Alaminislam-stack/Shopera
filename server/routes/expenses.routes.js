import express from "express";
import { userAuthMiddelware } from "../middlewares/auth.meddleware.js";
import {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenses.controllers.js";

const router = express.Router();

router.post("/createExpense", userAuthMiddelware, createExpense);
router.post("/getExpenses", userAuthMiddelware, getExpense);
router.post("/updateExpense", userAuthMiddelware, updateExpense);
router.post("/deleteExpense", userAuthMiddelware, deleteExpense);

export default router;
