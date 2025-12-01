"use client";

import axiosInstanceUtility from "@/lib/axiosInstanceUtility";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  status: "Active" | "Inactive";
  shopId: string;
}

interface ProductContextType {
  isLoading: boolean;
  createProduct: (data: Partial<Product>) => Promise<any>;
  updateProduct: (data: Partial<Product>) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
  getProducts: (shopId: string) => Promise<any>;
  products: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const createProduct = async (data: Partial<Product>) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/product/createProduct",
        data
      );
      // Refetch products after creating a new one
      if (data.shopId) {
        await getProducts(data.shopId);
      }
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getProducts = async (shopId: string) => {
    console.log(shopId);
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post("/product/getProducts", {
        shopId,
      });
      setProducts(response.data.products);
      setIsLoading(false);

      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateProduct = async (data: Partial<Product>) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/product/updateProduct",
        data
      );
      // Refetch products after updating
      if (data.shopId) {
        await getProducts(data.shopId);
      }
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/product/deleteProduct",
        { id }
      );
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        isLoading,
        createProduct,
        updateProduct,
        deleteProduct,
        getProducts,
        products,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within an ProductProvider");
  }
  return context;
};
