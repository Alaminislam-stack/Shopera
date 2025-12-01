import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { shops } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

export const createShop = asyncHandler(async (req, res, next) => {
  const { shopName, shopType, address, city, phone } = req.body;
  console.log(shopName, shopType, address, city, phone);
  const userId = req.user.id;

  // Validation
  if (!shopName || !shopType || !address || !city || !phone) {
    return next(new errorHandler("Please provide all required fields", 400));
  }

  // Check if user already has a shop
  const existingShop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, userId))
    .limit(1);

  if (existingShop.length > 0) {
    return next(new errorHandler("User already has a shop", 409));
  }

  // Create shop
  const [newShop] = await db
    .insert(shops)
    .values({
      name: shopName,
      type: shopType,
      address,
      city,
      phone,
      userId,
    })
    .returning();

  res.status(201).json({
    success: true,
    message: "Shop created successfully",
    shop: newShop,
  });
});

export const getShop = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Get user's shop
  const shop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, userId))
    .limit(1);

  if (!shop.length) {
    return next(new errorHandler("User does not have a shop", 404));
  }

  res.status(200).json({
    success: true,
    message: "Shop retrieved successfully",
    shop: shop[0],
  });
});

export const updateShop = asyncHandler(async (req, res, next) => {
  const { name, type, address, city, phone } = req.body;
  const userId = req.user.id;

  // Get user's shop
  const shop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, userId))
    .limit(1);

  if (!shop.length) {
    return next(new errorHandler("User does not have a shop", 404));
  }

  // Update shop
  const [updatedShop] = await db
    .update(shops)
    .set({
      name,
      type,
      address,
      city,
      phone,
    })
    .where(eq(shops.userId, userId))
    .returning();

  res.status(200).json({
    success: true,
    message: "Shop updated successfully",
    shop: updatedShop,
  });
});

export const deleteShop = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Get user's shop
  const shop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, userId))
    .limit(1);

  if (!shop.length) {
    return next(new errorHandler("User does not have a shop", 404));
  }

  // Delete shop
  await db.delete(shops).where(eq(shops.userId, userId));

  res.status(200).json({
    success: true,
    message: "Shop deleted successfully",
  });
});
