import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { products } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

export const createProduct = asyncHandler(async (req, res) => {
  const { name, category, buyingPrice, sellingPrice, stock, status, shopId } =
    req.body;
  const existingProduct = await db
    .select()
    .from(products)
    .where(eq(products.name, name));
  if (existingProduct.length > 0) {
    return res.status(400).json({ message: "Product already exists" });
  }
  const newProduct = await db.insert(products).values({
    name,
    category,
    buyingPrice,
    sellingPrice,
    stock,
    shopId,
    status,
  });
  res
    .status(201)
    .json({ message: "Product created successfully", product: newProduct });
});

export const getProducts = asyncHandler(async (req, res) => {
  const { shopId } = req.body;
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.shopId, shopId));

  if (!allProducts) {
    return res.status(400).json({ message: "Products not found" });
  }
  res.status(200).json({ products: allProducts });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    category,
    buyingPrice,
    sellingPrice,
    stock,
    status,
    shopId,
  } = req.body;
  try {
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    if (!existingProduct) {
      return res.status(400).json({ message: "Product not found" });
    }
    const updatedProduct = await db
      .update(products)
      .set({
        name,
        category,
        buyingPrice,
        sellingPrice,
        stock,
        shopId,
        status,
      })
      .where(eq(products.id, id))
      .returning();
    res.status(201).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    errorHandler(error, res);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const product = await db.delete(products).where(eq(products.id, id));
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    errorHandler(error, res);
  }
});


// sales product
export const addSalesProduct = asyncHandler(async (req, res) => {
  const { name, category, buyingPrice, sellingPrice, stock, status, shopId } =
    req.body;
  const existingProduct = await db
    .select()
    .from(products)
    .where(eq(products.name, name));
  if (existingProduct.length > 0) {
    return res.status(400).json({ message: "Product already exists" });
  }
  const newProduct = await db.insert(products).values({
    name,
    category,
    buyingPrice,
    sellingPrice,
    stock,
    shopId,
    status,
  });
  res
    .status(201)
    .json({ message: "Product created successfully", product: newProduct });
});
