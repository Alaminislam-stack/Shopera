import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/authContext";

const sidebarLinks = [
  { name: "ড্যাশবোর্ড", href: "/dashboard", icon: LayoutDashboard },
  { name: "পণ্য", href: "/dashboard/products", icon: Package },
  { name: "বিক্রয়", href: "/dashboard/sales", icon: ShoppingCart },
  { name: "খরচ", href: "/dashboard/expenses", icon: Receipt },
  { name: "রিপোর্ট", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "সেটিংস", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center gap-2 px-2">
        <img src="/logo.png" alt="Shopera Logo" className="h-8 w-8" />
        <span className="text-xl font-bold">Shopera</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              "text-muted-foreground" // Active state logic to be added
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.name}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
        <LogOut className="h-4 w-4" />
        সাইন আউট
      </button>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card px-4 py-6 md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black transition-opacity"
            onClick={onClose}
          />
          <aside className="relative flex w-64 flex-col bg-card px-4 py-6 shadow-xl transition-transform">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
