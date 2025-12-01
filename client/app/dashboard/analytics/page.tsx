"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useShop } from "@/contexts/shopContext";
import { useSale } from "@/contexts/salesContext";
import { useExpense } from "@/contexts/expensesContext";
import { useProduct } from "@/contexts/productContext";

export default function AnalyticsPage() {
  const { getShop, shop } = useShop();
  const { getSales, sales } = useSale();
  const { getExpenses, expenses } = useExpense();
  const { getProducts, products } = useProduct();

  useEffect(() => {
    const fetchData = async () => {
      await getShop();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (shop?.id) {
      getSales(shop.id);
      getExpenses(shop.id);
      getProducts(shop.id);
    }
  }, [shop?.id]);

  // Get last 6 months data
  const monthlyData = useMemo(() => {
    const months = [];
    const monthNames = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      const monthName = monthNames[date.getMonth()];

      const monthSales = sales.filter((sale) =>
        sale.createdAt?.startsWith(monthKey)
      );
      const monthExpenses = expenses.filter((expense) =>
        expense.createdAt?.startsWith(monthKey)
      );

      const income = monthSales.reduce(
        (sum, sale) => sum + sale.sellingPrice * sale.quantity,
        0
      );
      const expense = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const profit =
        monthSales.reduce((sum, sale) => sum + sale.profit, 0) - expense;

      months.push({ month: monthName, income, expense, profit });
    }

    return months;
  }, [sales, expenses]);

  const maxIncome = Math.max(...monthlyData.map((d) => d.income), 1);

  // Calculate yearly totals
  const yearlyIncome = useMemo(() => {
    return sales.reduce(
      (sum, sale) => sum + sale.sellingPrice * sale.quantity,
      0
    );
  }, [sales]);

  const yearlyProfit = useMemo(() => {
    const salesProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return salesProfit - totalExpenses;
  }, [sales, expenses]);

  const avgMonthlySales = useMemo(() => {
    if (monthlyData.length === 0) return 0;
    const total = monthlyData.reduce((sum, month) => sum + month.income, 0);
    return Math.round(total / monthlyData.length);
  }, [monthlyData]);

  // Category analysis from products
  const categoryAnalysis = useMemo(() => {
    const categoryMap = new Map<string, number>();

    products.forEach((product) => {
      const current = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, current + 1);
    });

    const total = products.length || 1;
    const categories = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        category,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4);

    return categories;
  }, [products]);

  // Expense category analysis
  const expenseAnalysis = useMemo(() => {
    const categoryMap = new Map<string, number>();

    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0) || 1;
    const categories = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        percentage: Math.round((amount / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4);

    return categories;
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          রিপোর্ট ও অ্যানালিটিক্স
        </h1>
        <p className="text-muted-foreground">
          আপনার ব্যবসার আর্থিক বিশ্লেষণের বিস্তারিত
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সর্বমোট আয়</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{yearlyIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">সব বিক্রয় থেকে</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              সর্বমোট নিট লাভ
            </CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                yearlyProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                yearlyProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ৳{yearlyProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">খরচ বাদে</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              গড় মাসিক বিক্রয়
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{avgMonthlySales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">গত ৬ মাসের গড়</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>মাসিক আয়-ব্যয় বিশ্লেষণ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.length > 0 ? (
              monthlyData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="w-20 font-medium">{data.month}</span>
                    <div className="flex flex-1 items-center gap-2 px-4">
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(data.income / maxIncome) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex w-48 justify-end gap-4 text-xs">
                      <span className="text-green-600">
                        আয়: ৳{data.income.toLocaleString()}
                      </span>
                      <span className="text-red-600">
                        ব্যয়: ৳{data.expense.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                এখনও কোনো ডেটা নেই
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>পণ্যের ক্যাটাগরি বিতরণ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryAnalysis.length > 0 ? (
                categoryAnalysis.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <span className="font-medium">{cat.category}</span>
                    <span className="font-bold">{cat.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  এখনও কোনো পণ্য নেই
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>খরচের খাতসমূহ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseAnalysis.length > 0 ? (
                expenseAnalysis.map((exp) => (
                  <div
                    key={exp.category}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <span className="font-medium">{exp.category}</span>
                    <span className="font-bold text-red-600">
                      {exp.percentage}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  এখনও কোনো খরচ নেই
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
