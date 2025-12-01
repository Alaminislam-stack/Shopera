"use client";

import axiosInstanceUtility from "@/lib/axiosInstanceUtility";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  shopId: string;
  createdAt: string;
  expenseId?: string;
}

interface ExpenseContextType {
  isLoading: boolean;
  createExpense: (data: Partial<Expense>) => Promise<any>;
  updateExpense: (data: Partial<Expense>) => Promise<any>;
  deleteExpense: (expenseId: string, shopId: string) => Promise<any>;
  getExpenses: (shopId: string) => Promise<any>;
  expenses: Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const createExpense = async (data: Partial<Expense>) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/expenses/createExpense",
        data
      );
      // Refetch products after creating a new one
      if (data.shopId) {
        await getExpenses(data.shopId);
      }
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getExpenses = async (shopId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/expenses/getExpenses",
        {
          shopId,
        }
      );
      setExpenses(response.data.expenses);
      setIsLoading(false);

      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateExpense = async (data: Partial<Expense>) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/expenses/updateExpense",
        data
      );
      // Refetch products after updating
      if (data.shopId) {
        await getExpenses(data.shopId);
      }
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteExpense = async (expenseId: string, shopId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/expenses/deleteExpense",
        { expenseId }
      );
      // Refetch expenses after deleting
      if (shopId) {
        await getExpenses(shopId);
      }
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        isLoading,
        createExpense,
        updateExpense,
        deleteExpense,
        getExpenses,
        expenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};
