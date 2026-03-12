import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-supabase";

interface CustomerHeaderProps {
  onCartOpen: () => void;
}

export function CustomerHeader({ onCartOpen }: CustomerHeaderProps) {
  const { itemCount, justAdded } = useCart();
  const { data: settings } = useSettings();

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          {settings?.logo_url && (
            <img 
              src={settings.logo_url} 
              alt={settings.nome_loja || "Logo"} 
              className="h-10 w-10 object-contain"
            />
          )}
          <h1 className="font-heading text-xl uppercase tracking-wider">
            {settings?.nome_loja || "AÇAÍ EXPRESS"}
          </h1>
        </div>
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
