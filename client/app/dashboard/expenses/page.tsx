"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Receipt,
  PieChart,
  Trash,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useExpense } from "@/contexts/expensesContext";
import { useShop } from "@/contexts/shopContext";

export default function ExpensesPage() {
  const {
    createExpense,
    updateExpense,
    deleteExpense,
    expenses,
    isLoading,
    getExpenses,
  } = useExpense();
  const { shop, getShop } = useShop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "" as any,
    shopId: shop?.id || "",
  });

  const categories = [
    "ভাড়া",
    "বিদ্যুৎ বিল",
    "পণ্য ক্রয়",
    "কর্মচারী বেতন",
    "মার্কেটিং",
    "যাতায়াত",
    "অন্যান্য",
  ];

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      amount: Number(formData.amount) || 0,
    };

    if (isEditMode && editingExpenseId) {
      const response = await updateExpense({
        ...submitData,
        expenseId: editingExpenseId,
      });
      if (response) {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingExpenseId(null);
        setFormData({
          category: "",
          description: "",
          amount: "" as any,
          shopId: shop?.id || "",
        });
      }
    } else {
      const response = await createExpense(submitData);
      if (response) {
        setIsModalOpen(false);
        setFormData({
          category: "",
          description: "",
          amount: "" as any,
          shopId: shop?.id || "",
        });
      }
    }
  };

  const handleEdit = (expense: any) => {
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      shopId: expense.shopId,
    });
    setEditingExpenseId(expense.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (expenseId: string) => {
    if (confirm("আপনি কি এই খরচটি মুছে ফেলতে চান?")) {
      if (shop?.id) {
        await deleteExpense(expenseId, shop.id);
      }
    }
  };

  const handleAddNew = () => {
    setFormData({
      category: "",
      description: "",
      amount: "" as any,
      shopId: shop?.id || "",
    });
    setIsEditMode(false);
    setEditingExpenseId(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getShop();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (shop?.id) {
      getExpenses(shop.id);
    }
  }, [shop?.id]);

  console.log(expenses);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">খরচ ব্যবস্থাপনা</h1>
          <p className="text-muted-foreground">ব্যবসার সকল খরচ ট্র্যাক করুন</p>
        </div>
        <Button className="cursor-pointer" onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          নতুন খরচ যোগ করুন
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              এই মাসের মোট খরচ
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              মোট খরচের সংখ্যা
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length} টি</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>ক্যাটাগরি অনুযায়ী খরচ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryTotal = expenses
                  .filter((e) => e.category === category)
                  .reduce((sum, e) => sum + e.amount, 0);

                if (categoryTotal === 0) return null;

                const percentage = Math.round(
                  (categoryTotal / totalExpenses) * 100
                );

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        ৳{categoryTotal} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>সাম্প্রতিক খরচ</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      খরচ ID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      ক্যাটাগরি
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      বিবরণ
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      পরিমাণ
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      তারিখ ও সময়
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      কার্যক্রম
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium text-xs">
                        #{expense.id.slice(-8)}
                      </td>
                      <td className="p-4 align-middle">{expense.category}</td>
                      <td className="p-4 align-middle">
                        {expense.description}
                      </td>
                      <td className="p-4 align-middle font-medium">
                        ৳{expense.amount}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {new Date(expense.createdAt).toLocaleString("bn-BD")}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(expense)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        ID: #{expense.id.slice(-8)}
                      </p>
                      <p className="font-medium">{expense.category}</p>
                    </div>
                    <p className="text-lg font-bold">৳{expense.amount}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {expense.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.createdAt).toLocaleString("bn-BD")}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(expense)}
                      className="flex-1"
                    >
                      সম্পাদনা
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(expense.id)}
                      className="flex-1"
                    >
                      মুছুন
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingExpenseId(null);
        }}
        title={isEditMode ? "খরচ সম্পাদনা করুন" : "নতুন খরচ যোগ করুন"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ক্যাটাগরি</label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">নির্বাচন করুন</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">বিবরণ</label>
            <input
              required
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="খরচের বিবরণ লিখুন"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">পরিমাণ</label>
            <input
              required
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value as any })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setEditingExpenseId(null);
              }}
            >
              বাতিল
            </Button>
            <Button className="cursor-pointer" type="submit">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditMode ? (
                "আপডেট করুন"
              ) : (
                "খরচ যোগ করুন"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
