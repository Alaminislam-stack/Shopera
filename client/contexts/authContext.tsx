"use client";

import axiosInstanceUtility from "@/lib/axiosInstanceUtility";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  isLoading: boolean;
  user: any;
  shop: any;
  isAuthenticated: boolean;
  regisrte: (data: any) => Promise<any>;
  registerWithGoogle: (data: any) => Promise<any>;
  login: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.get("/user/profile");
      setUser(response.data.user);
      setShop(response.data.shop);
      setIsLoading(false);
    } catch (error) {
      console.log("Not authenticated");
      setUser(null);
      setShop(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const regisrte = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstanceUtility.post("/user/register", data);
      setUser(response.data.user);
      setShop(response.data.shop);
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const registerWithGoogle = async (data: any) => {
    try {
      console.log(data);
      setIsLoading(true);
      const response = await axiosInstanceUtility.post(
        "/user/registerWithGoogle",
        data
      );
      setUser(response.data.user);
      setShop(response.data.shop);
      setIsLoading(false);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const login = async (data: any) => {
    try {
      console.log(data);
      setIsLoading(true);
      const response = await axiosInstanceUtility.post("/user/login", data);
      setUser(response.data.user);
      setShop(response.data.shop);
      setIsLoading(false);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await axiosInstanceUtility.get("/user/logout");
      setUser(null);
      setShop(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user,
        shop,
        isAuthenticated: !!user,
        regisrte,
        registerWithGoogle,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
