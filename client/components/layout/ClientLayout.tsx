"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Hide navbar/footer on these routes
  const hideLayout =
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/setup-shop";

  return (
    <>
      {!hideLayout && (
        <nav className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Shopera Logo"
                className="h-8 w-8"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold">Shopera</span>
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard" className="border-accent rounded-md border">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">লগইন</Button>
                  </Link>
                  <Link href="/register">
                    <Button>রেজিস্টার</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      {children}

      {!hideLayout && (
        <footer className="border-t bg-muted/30 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2025 Shopera. দোকান ব্যবস্থাপনা সিস্টেম</p>
          </div>
        </footer>
      )}
    </>
  );
}
