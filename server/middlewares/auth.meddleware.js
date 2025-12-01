import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHendler.js";
import { asyncHandler } from "../utils/asyncHedler.js";

export const userAuthMiddelware = asyncHandler((req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new errorHandler("Not authorized, no token", 401));
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-this");
    req.user = tokenData;
    next();
});