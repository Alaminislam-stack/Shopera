import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-xl font-bold">Shopera</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted multi-vendor marketplace for quality products at
              great prices.
            </p>
            <div className="flex gap-2">
              <button className="rounded-full bg-primary/10 p-2 hover:bg-primary/20">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="rounded-full bg-primary/10 p-2 hover:bg-primary/20">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="rounded-full bg-primary/10 p-2 hover:bg-primary/20">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="rounded-full bg-primary/10 p-2 hover:bg-primary/20">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop" className="hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-foreground">
                  Vendors
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-foreground">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Vendor</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/become-vendor" className="hover:text-foreground">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/vendor-guide" className="hover:text-foreground">
                  Vendor Guide
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-foreground">
                  Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Shopera. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
