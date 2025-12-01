import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { sales, products } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq, and } from "drizzle-orm";

export const createSale = asyncHandler(async (req, res, next) => {
  const {
    productName,
    productId,
    quantity,
    buyingPrice,
    sellingPrice,
    shopId,
  } = req.body;

  // Validation
  if (!productName || !quantity || !buyingPrice || !sellingPrice || !shopId) {
    return next(new errorHandler("Please provide all required fields", 400));
  }

  // Calculate profit
  const profit = (sellingPrice - buyingPrice) * quantity;

  // If productId is provided, update the product stock
  if (productId) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product) {
      // Update stock
      const newStock = product.stock - quantity;
      if (newStock < 0) {
        return next(new errorHandler("Insufficient stock", 400));
      }

      await db
        .update(products)
        .set({ stock: newStock })
        .where(eq(products.id, productId));
    }
  }

  // Create sale
  const [newSale] = await db
    .insert(sales)
    .values({
      productName,
      productId: productId || null,
      quantity,
      buyingPrice,
      sellingPrice,
      profit,
      shopId,
    })
    .returning();

  res.status(201).json({
    success: true,
    message: "Sale created successfully",
    sale: newSale,
  });
});

export const getSales = asyncHandler(async (req, res, next) => {
  const { shopId } = req.body;

  // Get all sales for the shop
  const allSales = await db
    .select()
    .from(sales)
    .where(eq(sales.shopId, shopId));

  if (!allSales.length) {
    return next(new errorHandler("No sales found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Sales retrieved successfully",
    sales: allSales,
  });
});

export const updateSale = asyncHandler(async (req, res, next) => {
  const { saleId, productName, quantity, buyingPrice, sellingPrice } = req.body;

  // Get the sale
  const [sale] = await db
    .select()
    .from(sales)
    .where(eq(sales.id, saleId))
    .limit(1);

  if (!sale) {
    return next(new errorHandler("Sale not found", 404));
  }

  // Calculate new profit
  const profit = (sellingPrice - buyingPrice) * quantity;

  // Update sale
  const [updatedSale] = await db
    .update(sales)
    .set({
      productName,
      quantity,
      buyingPrice,
      sellingPrice,
      profit,
    })
    .where(eq(sales.id, saleId))
    .returning();

  res.status(200).json({
    success: true,
    message: "Sale updated successfully",
    sale: updatedSale,
  });
});

export const deleteSale = asyncHandler(async (req, res, next) => {
  const { saleId } = req.body;

  // Get the sale
  const [sale] = await db
    .select()
    .from(sales)
    .where(eq(sales.id, saleId))
    .limit(1);

  if (!sale) {
    return next(new errorHandler("Sale not found", 404));
  }

  // Delete sale
  await db.delete(sales).where(eq(sales.id, saleId));

  res.status(200).json({
    success: true,
    message: "Sale deleted successfully",
  });
});
