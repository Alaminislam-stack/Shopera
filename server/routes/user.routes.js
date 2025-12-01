import express from "express";
import { register, registerWithGoogle, login, profile, logout } from "../controllers/user.cotrollers.js";
import { userAuthMiddelware } from "../middlewares/auth.meddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/registerWithGoogle", registerWithGoogle);
router.post("/login", login);
router.get("/profile", userAuthMiddelware, profile);
router.get("/logout", userAuthMiddelware, logout);

export default router;
