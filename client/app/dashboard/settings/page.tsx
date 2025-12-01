"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Store } from "lucide-react";
import { useShop } from "@/contexts/shopContext";

export default function SettingsPage() {
  const { getShop, isLoading, deleteShop, updateShop, shop } = useShop();
  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        shopName: shop.name || "",
        address: shop.address || "",
        city: shop.city || "",
        phone: shop.phone || "",
      });
    }
  }, [shop]);

  // Check if form data has changed from original shop data
  const hasChanges =
    formData.shopName !== (shop?.name || "") ||
    formData.address !== (shop?.address || "") ||
    formData.city !== (shop?.city || "") ||
    formData.phone !== (shop?.phone || "");

  const handleUpdateShop = () => {
    updateShop(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">সেটিংস</h1>
        <p className="text-muted-foreground">
          আপনার দোকান এবং অ্যাকাউন্টের তথ্য পরিবর্তন করুন
        </p>
      </div>

      <div className="grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
        <nav className="flex flex-col space-y-1">
          <Button variant="ghost" className="justify-start">
            <Store className="mr-2 h-4 w-4" />
            দোকানের তথ্য
          </Button>
        </nav>

        <div className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>দোকানের সাধারণ তথ্য</CardTitle>
              <CardDescription>
                আপনার দোকানের নাম এবং ঠিকানা যা ইনভয়েসে দেখানো হবে
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">দোকানের নাম</label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) =>
                    setFormData({ ...formData, shopName: e.target.value })
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ঠিকানা</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ফোন নম্বর</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={isLoading || !hasChanges}
                  className="cursor-pointer"
                  onClick={handleUpdateShop}
                >
                  {isLoading && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                  পরিবর্তন সেভ করুন
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>মুদ্রা এবং ভাষা</CardTitle>
              <CardDescription>
                আপনার পছন্দ অনুযায়ী সিস্টেম সেটিংস ঠিক করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    মুদ্রা (Currency)
                  </label>
                  <select className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option>বাংলাদেশী টাকা (BDT)</option>
                    <option>US Dollar (USD)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ভাষা (Language)</label>
                  <select className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option>বাংলা</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
