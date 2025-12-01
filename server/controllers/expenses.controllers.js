import { asyncHandler } from "../utils/asyncHedler.js";
import { errorHandler } from "../utils/errorHendler.js";
import { expenses } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

export const createExpense = asyncHandler(async (req, res, next) => {
  const { category, description, amount, shopId } = req.body;

  // Validation
  if (!category || !description || !amount || !shopId) {
    return next(new errorHandler("Please provide all required fields", 400));
  }

  // Create expense
  const [newExpense] = await db
    .insert(expenses)
    .values({
      category,
      description,
      amount,
      shopId,
    })
    .returning();

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    expense: newExpense,
  });
});

export const getExpense = asyncHandler(async (req, res, next) => {
  const { shopId } = req.body;

  // Get user's expenses
  const allExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.shopId, shopId));

  if (!allExpenses.length) {
    return next(new errorHandler("No expenses found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Expenses retrieved successfully",
    expenses: allExpenses,
  });
});

export const updateExpense = asyncHandler(async (req, res, next) => {
  const { category, description, amount, expenseId } = req.body;

  // Get user's expense
  const expense = await db
    .select()
    .from(expenses)
    .where(eq(expenses.id, expenseId))
    .limit(1);

  if (!expense.length) {
    return next(new errorHandler("Expense not found", 404));
  }

  // Update expense
  const [updatedExpense] = await db
    .update(expenses)
    .set({
      category,
      description,
      amount,
    })
    .where(eq(expenses.id, expenseId))
    .returning();

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    expense: updatedExpense,
  });
});

export const deleteExpense = asyncHandler(async (req, res, next) => {
  const { expenseId } = req.body;

  // Get user's expense
  const expense = await db
    .select()
    .from(expenses)
    .where(eq(expenses.id, expenseId))
    .limit(1);

  if (!expense.length) {
    return next(new errorHandler("Expense not found", 404));
  }

  // Delete expense
  await db.delete(expenses).where(eq(expenses.id, expenseId));

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});
