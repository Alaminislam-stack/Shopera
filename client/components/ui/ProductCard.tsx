import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  vendor: string;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  vendor,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/20" />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="mb-1 font-semibold transition-colors hover:text-primary">
            {name}
          </h3>
        </Link>

        <p className="mb-2 text-xs text-muted-foreground">by {vendor}</p>

        <div className="mb-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">৳{price.toLocaleString()}</span>
          <Button size="sm">
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
