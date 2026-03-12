import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-foreground/50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[75vw] max-w-md bg-card border-l-2 border-border transition-transform duration-100 linear ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
          <h2 className="font-heading text-lg uppercase">CARRINHO</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" fill="currentColor" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground font-body mt-8">
              Seu carrinho está vazio.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 border-b-2 border-border pb-4"
                >
                  <div className="flex-1">
                    <h4 className="font-heading text-xs uppercase">
                      {item.product.nome}
                    </h4>
                    <p className="text-sm font-body text-muted-foreground">
                      R$ {item.product.preco.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center border-2 border-border hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-heading text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center border-2 border-border hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-heading uppercase text-sm">TOTAL</span>
              <span className="font-heading text-xl">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Button onClick={handleCheckout} size="lg" className="w-full">
              FINALIZAR PEDIDO
            </Button>
            <Button
              onClick={clearCart}
              variant="outline"
              size="sm"
              className="w-full"
            >
              LIMPAR CARRINHO
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
