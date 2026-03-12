import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

interface CustomerHeaderProps {
  onCartOpen: () => void;
}

export function CustomerHeader({ onCartOpen }: CustomerHeaderProps) {
  const { itemCount, justAdded } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="font-heading text-xl uppercase tracking-wider">
          AÇAÍ EXPRESS
        </h1>
        <button
          onClick={onCartOpen}
          className="relative flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-100"
        >
          <ShoppingCart
            className={`h-5 w-5 ${justAdded ? "animate-shake" : ""}`}
            fill="currentColor"
          />
          {itemCount > 0 && (
            <span className="flex h-6 w-6 items-center justify-center bg-accent text-accent-foreground font-heading text-xs">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
