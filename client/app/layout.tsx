import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../contexts/authContext";
import { Toaster } from "react-hot-toast";
import { ShopProvider } from "@/contexts/shopContext";
import { ProductProvider } from "@/contexts/productContext";
import { ExpenseProvider } from "@/contexts/expensesContext";
import { SaleProvider } from "@/contexts/salesContext";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopera - ব্যবসা ব্যবস্থাপনা সিস্টেম",
  description:
    "Shopera - আপনার দোকান ব্যবস্থাপনার জন্য সম্পূর্ণ সমাধান। পণ্য, বিক্রয়, খরচ এবং রিপোর্ট সহজেই পরিচালনা করুন।",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <ShopProvider>
              <ProductProvider>
                <ExpenseProvider>
                  <SaleProvider>
                    <ClientLayout>{children}</ClientLayout>
                    <Toaster position="top-center" />
                  </SaleProvider>
                </ExpenseProvider>
              </ProductProvider>
            </ShopProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
