"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useExpense } from "@/contexts/expensesContext";
import { useProduct } from "@/contexts/productContext";
import { useSale } from "@/contexts/salesContext";
import { useShop } from "@/contexts/shopContext";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useMemo } from "react";

export default function DashboardPage() {
  const { getShop, shop } = useShop();
  const { getProducts, products } = useProduct();
  const { getExpenses, expenses } = useExpense();
  const { getSales, sales } = useSale();

  useEffect(() => {
    const fetchData = async () => {
      await getShop();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (shop?.id) {
      getProducts(shop.id);
      getExpenses(shop.id);
      getSales(shop.id);
    }
  }, [shop?.id]);

  // Calculate today's sales
  const today = new Date().toISOString().split("T")[0];
  const todaySales = useMemo(() => {
    return sales.filter((sale) => sale.createdAt?.startsWith(today));
  }, [sales, today]);

  const todayRevenue = useMemo(() => {
    return todaySales.reduce(
      (sum, sale) => sum + sale.sellingPrice * sale.quantity,
      0
    );
  }, [todaySales]);

  const todayProfit = useMemo(() => {
    return todaySales.reduce((sum, sale) => sum + sale.profit, 0);
  }, [todaySales]);

  // Calculate this month's data
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthSales = useMemo(() => {
    return sales.filter((sale) => sale.createdAt?.startsWith(thisMonth));
  }, [sales, thisMonth]);

  const monthRevenue = useMemo(() => {
    return monthSales.reduce(
      (sum, sale) => sum + sale.sellingPrice * sale.quantity,
      0
    );
  }, [monthSales]);

  const monthExpenses = useMemo(() => {
    return expenses
      .filter((expense) => expense.createdAt?.startsWith(thisMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses, thisMonth]);

  const monthProfit = useMemo(() => {
    return monthSales.reduce((sum, sale) => sum + sale.profit, 0);
  }, [monthSales]);

  const netProfit = monthProfit - monthExpenses;

  const stats = [
    {
      title: "আজকের বিক্রয়",
      value: `৳${todayRevenue.toLocaleString()}`,
      change: `${todaySales.length} টি পণ্য বিক্রি`,
      icon: ShoppingCart,
      trend: "up" as const,
    },
    {
      title: "মোট পণ্য",
      value: products.length.toString(),
      change: "স্টকে আছে",
      icon: Package,
      trend: "up" as const,
    },
    {
      title: "মাসিক আয়",
      value: `৳${monthRevenue.toLocaleString()}`,
      change: `${monthSales.length} টি বিক্রয়`,
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "নিট লাভ",
      value: `৳${netProfit.toLocaleString()}`,
      change: `এই মাসে`,
      icon: TrendingUp,
      trend: netProfit >= 0 ? ("up" as const) : ("down" as const),
    },
  ];

  // Get recent sales (last 5)
  const recentSales = useMemo(() => {
    return [...sales]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((sale) => {
        const saleDate = new Date(sale.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - saleDate.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let timeAgo = "";
        if (diffDays > 0) {
          timeAgo = `${diffDays} দিন আগে`;
        } else if (diffHours > 0) {
          timeAgo = `${diffHours} ঘন্টা আগে`;
        } else {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          timeAgo = `${diffMinutes} মিনিট আগে`;
        }

        return {
          id: sale.id,
          product: sale.productName,
          quantity: sale.quantity,
          amount: `৳${(sale.sellingPrice * sale.quantity).toLocaleString()}`,
          time: timeAgo,
        };
      });
  }, [sales]);

  // Filter products with low stock (less than 10)
  const lowStockProducts = products.filter((product) => product.stock < 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">দোকান ড্যাশবোর্ড</h1>
        <p className="text-muted-foreground">
          আপনার ব্যবসার সম্পূর্ণ তথ্য এক নজরে
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক বিক্রয়</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{sale.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.quantity} টি • {sale.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {sale.amount}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  এখনও কোনো বিক্রয় নেই
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>কম স্টক সতর্কতা</CardTitle>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-600">
                        {product.stock} টি বাকি
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  সব পণ্যের স্টক ভালো আছে ✅
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>আর্থিক সারসংক্ষেপ (এই মাস)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">মোট আয়</span>
              <span className="font-medium text-green-600">
                ৳{monthRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">মোট খরচ</span>
              <span className="font-medium text-red-600">
                ৳{monthExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                বিক্রয় থেকে লাভ
              </span>
              <span className="font-medium text-green-600">
                ৳{monthProfit.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="font-medium">নিট লাভ</span>
              <span
                className={`text-xl font-bold ${
                  netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ৳{netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
