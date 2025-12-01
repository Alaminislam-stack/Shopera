import { Bell, Search, User, Menu } from "lucide-react";
import { Button } from "../ui/Button";
import { useShop } from "@/contexts/shopContext";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {

  const { shop } = useShop();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-full border p-1 pr-3 hover:bg-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium md:block">{shop?.name}</span>
        </button>
      </div>
    </header>
  );
}
