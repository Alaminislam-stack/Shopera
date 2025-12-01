"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useSale } from "@/contexts/salesContext";
import { useShop } from "@/contexts/shopContext";

export default function SalesPage() {
  const { createSale, updateSale, deleteSale, sales, getSales, isLoading } =
    useSale();
  const { shop, getShop } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "" as any,
    buyingPrice: "" as any,
    sellingPrice: "" as any,
    shopId: shop?.id || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await getShop();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (shop?.id) {
      getSales(shop.id);
    }
  }, [shop?.id]);

  // Calculate today's sales (filter by today's date)
  const today = new Date().toISOString().split("T")[0];
  const todayTotal = sales
    .filter((sale) => sale.createdAt?.startsWith(today))
    .reduce((sum, sale) => sum + sale.sellingPrice * sale.quantity, 0);

  const todayProfit = sales
    .filter((sale) => sale.createdAt?.startsWith(today))
    .reduce((sum, sale) => sum + sale.profit, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      quantity: Number(formData.quantity) || 1,
      buyingPrice: Number(formData.buyingPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      shopId: shop?.id || "",
    };

    if (isEditMode && editingSaleId) {
      const response = await updateSale({
        ...submitData,
        saleId: editingSaleId,
      });
      if (response) {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingSaleId(null);
        setFormData({
          productName: "",
          quantity: "" as any,
          buyingPrice: "" as any,
          sellingPrice: "" as any,
          shopId: shop?.id || "",
        });
      }
    } else {
      const response = await createSale(submitData);
      if (response) {
        setIsModalOpen(false);
        setFormData({
          productName: "",
          quantity: "" as any,
          buyingPrice: "" as any,
          sellingPrice: "" as any,
          shopId: shop?.id || "",
        });
      }
    }
  };

  const handleEdit = (sale: any) => {
    setFormData({
      productName: sale.productName,
      quantity: sale.quantity,
      buyingPrice: sale.buyingPrice,
      sellingPrice: sale.sellingPrice,
      shopId: sale.shopId,
    });
    setEditingSaleId(sale.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (saleId: string) => {
    if (confirm("আপনি কি এই বিক্রয়টি মুছে ফেলতে চান?")) {
      if (shop?.id) {
        await deleteSale(saleId, shop.id);
      }
    }
  };

  const handleAddNew = () => {
    setFormData({
      productName: "",
      quantity: "" as any,
      buyingPrice: "" as any,
      sellingPrice: "" as any,
      shopId: shop?.id || "",
    });
    setIsEditMode(false);
    setEditingSaleId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            বিক্রয় রেকর্ড
          </h1>
          <p className="text-muted-foreground">
            সকল বিক্রয়ের তথ্য দেখুন এবং নতুন বিক্রয় যোগ করুন
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="cursor-pointer w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          নতুন বিক্রয় যোগ করুন
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              আজকের মোট বিক্রয়
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{todayTotal.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আজকের লাভ</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ৳{todayProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              মোট বিক্রয় সংখ্যা
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length} টি</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>সাম্প্রতিক বিক্রয়</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    বিক্রয় ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    পণ্য
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    পরিমাণ
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    বিক্রয় মূল্য
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    লাভ
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
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle font-medium text-xs">
                      #{sale.id.slice(-8)}
                    </td>
                    <td className="p-4 align-middle">{sale.productName}</td>
                    <td className="p-4 align-middle">{sale.quantity}</td>
                    <td className="p-4 align-middle">
                      ৳{sale.sellingPrice * sale.quantity}
                    </td>
                    <td className="p-4 align-middle text-green-600 font-medium">
                      ৳{sale.profit}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(sale.createdAt).toLocaleString("bn-BD")}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(sale)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(sale.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      ID: #{sale.id.slice(-8)}
                    </p>
                    <p className="font-medium text-lg">{sale.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ৳{sale.sellingPrice * sale.quantity}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      লাভ: ৳{sale.profit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">পরিমাণ</p>
                    <p className="font-medium">{sale.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ইউনিট মূল্য</p>
                    <p className="font-medium">৳{sale.sellingPrice}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-2 border-t">
                  {new Date(sale.createdAt).toLocaleString("bn-BD")}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(sale)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    সম্পাদনা
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(sale.id)}
                    className="flex-1"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    মুছুন
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingSaleId(null);
        }}
        title={isEditMode ? "বিক্রয় সম্পাদনা করুন" : "নতুন বিক্রয় যোগ করুন"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">পণ্যের নাম</label>
            <input
              required
              type="text"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="পণ্যের নাম লিখুন"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">পরিমাণ</label>
            <input
              required
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value as any })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ইউনিট কেনা দাম</label>
              <input
                required
                type="number"
                value={formData.buyingPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buyingPrice: e.target.value as any,
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ইউনিট বিক্রয় দাম</label>
              <input
                required
                type="number"
                value={formData.sellingPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellingPrice: e.target.value as any,
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setEditingSaleId(null);
              }}
            >
              বাতিল
            </Button>
            <Button
              disabled={isLoading}
              className="cursor-pointer"
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditMode ? (
                "আপডেট করুন"
              ) : (
                "বিক্রয় যোগ করুন"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
