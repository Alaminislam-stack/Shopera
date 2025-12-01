"use client";

import axiosInstanceUtility from "@/lib/axiosInstanceUtility";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

interface ShopContextType {
  isLoading: boolean;
  createShop: (data: any) => Promise<any>;
  updateShop: (data: any) => Promise<any>;
  deleteShop: (data: any) => Promise<any>;
  getShop: () => Promise<any>;
  shop: any;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shop, setShop] = useState(null);

  const createShop = async (data: any) => {
    console.log(data);
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/shop/createShop",
        data
      );
      setShop(response.data.shop);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getShop = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.get("/shop/getShop");
      setShop(response.data.shop);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateShop = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/shop/updateShop",
        data
      );
      setShop(response.data.shop);
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteShop = async (data: any) => {
    try {
      console.log(data);
      setIsLoading(true);
      const response = await axiosInstanceUtility.delete("/shop/deleteShop");
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        isLoading,
        createShop,
        updateShop,
        deleteShop,
        getShop,
        shop,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within an ShopProvider");
  }
  return context;
};
