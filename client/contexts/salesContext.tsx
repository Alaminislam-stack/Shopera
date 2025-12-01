"use client";

import axiosInstanceUtility from "@/lib/axiosInstanceUtility";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

interface Sale {
  id: string;
  productName: string;
  productId?: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  profit: number;
  date: string;
  shopId: string;
  createdAt: string;
  saleId?: string;
}

interface SaleContextType {
  isLoading: boolean;
  createSale: (data: Partial<Sale>) => Promise<any>;
  updateSale: (data: Partial<Sale>) => Promise<any>;
  deleteSale: (saleId: string, shopId: string) => Promise<any>;
  getSales: (shopId: string) => Promise<any>;
  sales: Sale[];
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

export const SaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);

  const createSale = async (data: Partial<Sale>) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/sales/createSale",
        data
      );
      // Refetch sales after creating a new one
      if (data.shopId) {
        await getSales(data.shopId);
      }
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getSales = async (shopId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post("/sales/getSales", {
        shopId,
      });
      setSales(response.data.sales);
      setIsLoading(false);

      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateSale = async (data: Partial<Sale>) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/sales/updateSale",
        data
      );
      // Refetch sales after updating
      if (data.shopId) {
        await getSales(data.shopId);
      }
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteSale = async (saleId: string, shopId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post("/sales/deleteSale", {
        saleId,
      });
      // Refetch sales after deleting
      if (shopId) {
        await getSales(shopId);
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
    <SaleContext.Provider
      value={{
        isLoading,
        createSale,
        updateSale,
        deleteSale,
        getSales,
        sales,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export const useSale = () => {
  const context = useContext(SaleContext);
  if (context === undefined) {
    throw new Error("useSale must be used within an SaleProvider");
  }
  return context;
};
