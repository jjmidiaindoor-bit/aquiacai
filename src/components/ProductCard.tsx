import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/types";
import acaiImg from "@/assets/acai-product-1.jpg";
import creamImg from "@/assets/cream-product.jpg";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, justAdded } = useCart();
  const [buttonText, setButtonText] = useState("ADICIONAR");
  const isJustAdded = justAdded === product.id;

  const handleAdd = () => {
    addItem(product);
    setButtonText("ADICIONADO!");
    setTimeout(() => setButtonText("ADICIONAR"), 600);
  };

  const getImage = () => {
    if (product.foto_url) return product.foto_url;
    if (product.categoria_id === "2") return creamImg;
    return acaiImg;
  };

  return (
    <div className="flex flex-col bg-card border-2 border-border overflow-hidden">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={getImage()}
          alt={product.nome}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 gap-2">
        <h3 className="font-heading text-sm uppercase tracking-wide">
          {product.nome}
        </h3>
        <p className="text-xs text-muted-foreground font-body leading-relaxed flex-1">
          {product.descricao}
        </p>
        <p className="font-heading text-lg">
          R$ {product.preco.toFixed(2).replace(".", ",")}
        </p>
        <Button
          onClick={handleAdd}
          className={`w-full text-xs transition-all duration-100 ${
            isJustAdded
              ? "bg-accent text-accent-foreground"
              : ""
          }`}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
