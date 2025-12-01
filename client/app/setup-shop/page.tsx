"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Store, MapPin, Phone, Loader2 } from "lucide-react";
import { useShop } from "@/contexts/shopContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SetupShopPage() {
  const { createShop, isLoading } = useShop();
  const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: "",
    shopType: "",
    address: "",
    city: "",
    phone: "",
  });

  const shopTypes = [
    "মুদি দোকান",
    "কাপড়ের দোকান",
    "ইলেকট্রনিক্স",
    "ফার্মেসি",
    "রেস্টুরেন্ট",
    "বুক স্টোর",
    "মোবাইল শপ",
    "অন্যান্য",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createShop(formData);
    console.log(result);
    if (result?.success) {
      router.push("/dashboard");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">আপনার দোকান সেটআপ করুন</CardTitle>
            <CardDescription>
              দোকানের তথ্য দিয়ে আপনার ব্যবসা শুরু করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="shopName" className="text-sm font-medium">
                    দোকানের নাম *
                  </label>
                  <input
                    id="shopName"
                    type="text"
                    required
                    value={formData.shopName}
                    onChange={(e) =>
                      setFormData({ ...formData, shopName: e.target.value })
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="যেমন: আলম স্টোর"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="shopType" className="text-sm font-medium">
                    দোকানের ধরন *
                  </label>
                  <select
                    id="shopType"
                    required
                    value={formData.shopType}
                    onChange={(e) =>
                      setFormData({ ...formData, shopType: e.target.value })
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {shopTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  <MapPin className="mr-1 inline h-4 w-4" />
                  দোকানের ঠিকানা *
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="রোড নং, এলাকা"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    শহর *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="যেমন: ঢাকা"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    <Phone className="mr-1 inline h-4 w-4" />
                    দোকানের ফোন নম্বর *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  পিছনে যান
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "দোকান তৈরি করুন"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
