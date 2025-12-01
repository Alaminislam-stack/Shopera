import { OAuth2Client } from "google-auth-library";

import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { users, shops } from "../db/schema.js";
import { db } from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(
      new errorHandler(
        "Please provide all required fields: name, email, and password",
        400
      )
    );
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new errorHandler("Please provide a valid email address", 400));
  }

  // Password length validation
  if (password.length < 6) {
    return next(
      new errorHandler("Password must be at least 6 characters long", 400)
    );
  }

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return next(new errorHandler("User with this email already exists", 409));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning();

  // Generate JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET || "your-secret-key-change-this",
    { expiresIn: "7d" }
  );

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  // Send response (exclude password)
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: userWithoutPassword,
    shop: null,
    token,
  });
});

export const registerWithGoogle = asyncHandler(async (req, res, next) => {
  const { credential, clientId } = req.body;
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  const { email, given_name, family_name } = payload;

  // Validation
  if (!credential || !clientId) {
    return next(new errorHandler("Please provide all required", 400));
  }

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    const token = jwt.sign(
      { id: existingUser[0].id, email: existingUser[0].email },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    // Get user shop
    const userShop = await db
      .select()
      .from(shops)
      .where(eq(shops.userId, existingUser[0].id))
      .limit(1);

    // Send response (exclude password)
    const { password: _, ...userWithoutPassword } = existingUser[0];

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user: userWithoutPassword,
      shop: userShop[0] || null,
      token,
    });
  }

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      name: given_name + " " + family_name,
      email,
      password: null,
    })
    .returning();

  // Generate JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET || "your-secret-key-change-this",
    { expiresIn: "7d" }
  );

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send response (exclude password)
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: userWithoutPassword,
    shop: null,
    token,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new errorHandler("Please provide all required fields", 400));
  }

  // Check if user exists
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return next(new errorHandler("User not found", 404));
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
    return next(new errorHandler("Invalid password", 401));
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user[0].id, email: user[0].email },
    process.env.JWT_SECRET || "your-secret-key-change-this",
    { expiresIn: "7d" }
  );

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  // Get user shop
  const userShop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, user[0].id))
    .limit(1);

  // Send response (exclude password)
  const { password: _, ...userWithoutPassword } = user[0];

  res.status(200).json({
    success: true,
    message: "User login successfully",
    user: userWithoutPassword,
    shop: userShop[0] || null,
    token,
  });
});

export const profile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user.length === 0) {
    return next(new errorHandler("User not found", 404));
  }

  // Get user shop
  const userShop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, userId))
    .limit(1);

  // Send response (exclude password)
  const { password: _, ...userWithoutPassword } = user[0];

  res.status(200).json({
    success: true,
    message: "User profile successfully",
    user: userWithoutPassword,
    shop: userShop[0] || null,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 0,
  });
  res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
});
