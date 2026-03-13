import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useSettings, useCreateOrder } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const createOrder = useCreateOrder();
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    observacao: "",
    formaPagamento: "",
    precisaTroco: false,
    valorTroco: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.telefone.trim() || !form.endereco.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!form.formaPagamento) {
      toast.error("Selecione a forma de pagamento.");
      return;
    }

    if (form.formaPagamento === "dinheiro" && form.precisaTroco && !form.valorTroco) {
      toast.error("Informe o valor para o troco.");
      return;
    }

    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    const listaProdutos = items
      .map(
        (i) =>
          `${i.quantity}x ${i.product.nome} - R$ ${(i.product.preco * i.quantity).toFixed(2).replace(".", ",")}`
      )
      .join("\n");

    // Prepare payment info
    let pagamentoInfo = "";
    if (form.formaPagamento === "pix") {
      pagamentoInfo = "💳 *Pagamento:* PIX";
    } else if (form.formaPagamento === "cartao") {
      pagamentoInfo = "💳 *Pagamento:* Cartão";
    } else if (form.formaPagamento === "dinheiro") {
      if (form.precisaTroco) {
        pagamentoInfo = `💵 *Pagamento:* Dinheiro\n💰 *Troco para:* R$ ${form.valorTroco}`;
      } else {
        pagamentoInfo = "💵 *Pagamento:* Dinheiro (não precisa de troco)";
      }
    }

    // Save order to database
    try {
      await createOrder.mutateAsync({
        nome_cliente: form.nome.trim(),
        telefone: form.telefone.trim(),
        endereco: form.endereco.trim(),
        observacao: `${form.observacao.trim() || ""}\n\n${pagamentoInfo}`.trim(),
        detalhes_pedido: listaProdutos,
        total,
      });
    } catch (err) {
      console.error("Error saving order:", err);
    }

    const mensagem = `*Pedido ${settings?.nome_loja || "Açaí Express"}*

*Cliente:* ${form.nome.trim()}
*Telefone:* ${form.telefone.trim()}

*Pedido:*
${listaProdutos}

*Total: R$ ${total.toFixed(2).replace(".", ",")}*

${pagamentoInfo}

*Endereço:*
${form.endereco.trim()}

*Observação:*
${form.observacao.trim() || "Nenhuma"}`;

    const encoded = encodeURIComponent(mensagem);
    const phone = settings?.telefone_whatsapp || "5511999999999";
    const whatsappUrl = `https://wa.me/${phone}?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
    toast.success("Pedido enviado! Verifique o WhatsApp.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center gap-4">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-heading text-lg uppercase">FINALIZAR PEDIDO</h1>
        </div>
      </header>

      <main className="container py-6 max-w-lg">
        <div className="mb-6 space-y-2">
          <h2 className="font-heading text-sm uppercase tracking-wider">RESUMO DO PEDIDO</h2>
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center py-2 border-b-2 border-border">
              <span className="font-body text-sm">{item.quantity}x {item.product.nome}</span>
              <span className="font-heading text-sm">
                R$ {(item.product.preco * item.quantity).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <span className="font-heading uppercase text-sm">TOTAL</span>
            <span className="font-heading text-xl">R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormBlock label="NOME" name="nome" value={form.nome} onChange={handleChange} required />
          <FormBlock label="TELEFONE" name="telefone" value={form.telefone} onChange={handleChange} required />
          <FormBlock label="ENDEREÇO" name="endereco" value={form.endereco} onChange={handleChange} required />
          
          {/* Payment Method */}
          <div className="border-2 border-border bg-card p-4">
            <label className="font-heading text-xs uppercase tracking-wider block mb-3">
              FORMA DE PAGAMENTO <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-border hover:border-accent transition-colors">
                <input
                  type="radio"
                  name="formaPagamento"
                  value="pix"
                  checked={form.formaPagamento === "pix"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body text-sm">💳 PIX</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-border hover:border-accent transition-colors">
                <input
                  type="radio"
                  name="formaPagamento"
                  value="cartao"
                  checked={form.formaPagamento === "cartao"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body text-sm">💳 Cartão (Débito/Crédito)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-border hover:border-accent transition-colors">
                <input
                  type="radio"
                  name="formaPagamento"
                  value="dinheiro"
                  checked={form.formaPagamento === "dinheiro"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body text-sm">💵 Dinheiro</span>
              </label>
            </div>
          </div>

          {/* Change for Cash */}
          {form.formaPagamento === "dinheiro" && (
            <div className="border-2 border-border bg-card p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.precisaTroco}
                  onChange={(e) => setForm({ ...form, precisaTroco: e.target.checked, valorTroco: "" })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-heading text-xs uppercase tracking-wider">
                  PRECISA DE TROCO?
                </span>
              </label>
              
              {form.precisaTroco && (
                <div>
                  <label className="font-heading text-xs uppercase tracking-wider block mb-2">
                    TROCO PARA QUANTO? <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="valorTroco"
                    value={form.valorTroco}
                    onChange={handleChange}
                    placeholder="Ex: 50,00"
                    className="w-full bg-transparent font-body text-sm outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors duration-100 text-foreground"
                    required
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="border-2 border-border bg-card p-4">
            <label className="font-heading text-xs uppercase tracking-wider block mb-2">OBSERVAÇÃO</label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="w-full bg-transparent font-body text-sm outline-none resize-none h-20 text-foreground"
              placeholder="Ex: sem banana, com leite condensado..."
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={createOrder.isPending}>
            {createOrder.isPending ? "ENVIANDO..." : "ENVIAR PEDIDO VIA WHATSAPP"}
          </Button>
        </form>
      </main>
    </div>
  );
}

function FormBlock({ label, name, value, onChange, required }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div className="border-2 border-border bg-card p-4">
      <label className="font-heading text-xs uppercase tracking-wider block mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type="text" name={name} value={value} onChange={onChange} required={required}
        className="w-full bg-transparent font-body text-sm outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors duration-100 text-foreground"
      />
    </div>
  );
}
