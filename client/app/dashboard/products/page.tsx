"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useProduct } from "@/contexts/productContext";
import { useShop } from "@/contexts/shopContext";

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

export default function ProductsPage() {
  const {
    createProduct,
    isLoading,
    products,
    deleteProduct,
    getProducts,
    updateProduct,
  } = useProduct();
  const { shop, getShop } = useShop();

  useEffect(() => {
    const fetchData = async () => {
      await getShop();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (shop?.id) {
      getProducts(shop.id);
    }
  }, [shop?.id]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    buyingPrice: "" as any,
    sellingPrice: "" as any,
    stock: "" as any,
    status: "Active" as "Active" | "Inactive",
    shopId: shop?.id || "",
  });

  const calculateProfit = (buying: number, selling: number) => {
    const profit = selling - buying;
    const percentage = ((profit / buying) * 100).toFixed(1);
    return { profit, percentage };
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        buyingPrice: "" as any,
        sellingPrice: "" as any,
        stock: "" as any,
        status: "Active" as "Active" | "Inactive",
        shopId: shop?.id || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      buyingPrice: Number(formData.buyingPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      stock: Number(formData.stock) || 0,
    };

    if (editingProduct) {
      const result = await updateProduct({
        ...editingProduct,
        ...submitData,
      });
      if (result) {
        setIsModalOpen(false);
      }
    } else {
      const result = await createProduct({
        ...submitData,
        shopId: shop?.id || "",
      });
      if (result) {
        setIsModalOpen(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="sm:text-3xl text-xl font-bold tracking-tight">
            পণ্য ব্যবস্থাপনা
          </h1>
          <p className="text-muted-foreground text-sm">
            আপনার ইনভেন্টরি পরিচালনা করুন
          </p>
        </div>
        <Button className="cursor-pointer" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          নতুন পণ্য যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>পণ্যের তালিকা</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    পণ্য
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    ক্যাটাগরি
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    কেনা দাম
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    বিক্রয় দাম
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    লাভ
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    স্টক
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    অবস্থা
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    কাজ
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {products.map((product) => {
                  const { profit, percentage } = calculateProfit(
                    product.buyingPrice,
                    product.sellingPrice
                  );
                  return (
                    <tr
                      key={product.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {product.name}
                      </td>
                      <td className="p-4 align-middle">{product.category}</td>
                      <td className="p-4 align-middle">
                        ৳{product.buyingPrice}
                      </td>
                      <td className="p-4 align-middle">
                        ৳{product.sellingPrice}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-green-600 font-medium">
                            ৳{profit}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span
                          className={
                            product.stock < 10 ? "text-red-500 font-medium" : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "Active"
                            ? "সক্রিয়"
                            : "নিষ্ক্রিয়"}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => {
              const { profit, percentage } = calculateProfit(
                product.buyingPrice,
                product.sellingPrice
              );
              return (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-lg">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">কেনা দাম</p>
                      <p className="font-medium">৳{product.buyingPrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">বিক্রয় দাম</p>
                      <p className="font-medium">৳{product.sellingPrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">লাভ</p>
                      <p className="font-medium text-green-600">
                        ৳{profit} ({percentage}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">স্টক</p>
                      <p
                        className={`font-medium ${
                          product.stock < 10 ? "text-red-500" : ""
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenModal(product)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      সম্পাদনা
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      মুছুন
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "পণ্য সম্পাদনা করুন" : "নতুন পণ্য যোগ করুন"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">পণ্যের নাম</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="পণ্যের নাম লিখুন"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">ক্যাটাগরি</label>
            <input
              required
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="ক্যাটাগরি লিখুন"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">কেনা দাম</label>
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
              <label className="text-sm font-medium">বিক্রয় দাম</label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">স্টক</label>
              <input
                required
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value as any })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">অবস্থা</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="Active">সক্রিয়</option>
                <option value="Inactive">নিষ্ক্রিয়</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              বাতিল
            </Button>
            <Button
              className="cursor-pointer"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editingProduct ? (
                "আপডেট করুন"
              ) : (
                "যোগ করুন"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
