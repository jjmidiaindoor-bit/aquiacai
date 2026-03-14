import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useSettings, useCreateOrder } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const BAIRROS = [
  "Várzea Grande",
  "Cidade Dr. Jose Euclides Ferreira Gomes Junior",
  "Cohab II",
  "Coração de Jesus",
  "Derby Clube",
  "Cj Cohab Dois",
  "Campo dos Velhos",
  "Dom José",
  "Domingos Olímpio",
  "Novo Recanto",
  "Cj Sto Antonio",
  "Sinhá Sabóia",
  "Bairro Padre Ibiapina",
  "Vila União",
  "Residencial Meruoca",
  "Recanto 1",
  "Recanto 2",
  "Terrenos Novos",
  "Dom José 1",
  "Dom José 2",
  "Boa Viziança 1",
  "Loteamento Boa Vista Conviver",
  "Bairro Sinhá Sabóia",
  "Cohab 1",
  "Cohab 2",
  "Cohab 3",
  "Cidade Gerardo Cristino de Menezes (Alto da Rolinha, Parque Sto Antônio)",
  "Bairro Cidade Gerardo Cristino De Menezes",
  "Alto Da Rolinha",
  "Caiçara",
  "Parque Boa Vista",
  "Condomínio Moradas",
  "Condomínio Granville Residence",
  "Alto Grande",
  "Br 222",
  "Sinhá Sabóia",
  "Padre Ibiapina",
  "Nova Caiçara",
  "Cidade Pedro Mendes Carneiro",
  "Das Nações",
  "Cidade Gerardo Cristino de Menezes",
  "Parque Silvana",
  "Derby",
  "Antônio Carlos Belchior",
  "Expectativa",
  "Cohab I",
  "Gerardo Cristino",
].filter((v, i, a) => a.indexOf(v) === i).sort();

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const createOrder = useCreateOrder();
  const [bairroOpen, setBairroOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    tipoEntrega: "",
    bairro: "",
    rua: "",
    observacao: "",
    formaPagamento: "",
    precisaTroco: false,
    valorTroco: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.telefone.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!form.tipoEntrega) {
      toast.error("Selecione o tipo de entrega.");
      return;
    }
    if (form.tipoEntrega === "entrega" && !form.bairro) {
      toast.error("Selecione o bairro.");
      return;
    }
    if (form.tipoEntrega === "entrega" && !form.rua.trim()) {
      toast.error("Informe a rua e número.");
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
      .map((i) => `${i.quantity}x ${i.product.nome} - R$ ${(i.product.preco * i.quantity).toFixed(2).replace(".", ",")}`)
      .join("\n");

    let pagamentoInfo = "";
    if (form.formaPagamento === "pix") pagamentoInfo = "💳 *Pagamento:* PIX";
    else if (form.formaPagamento === "cartao") pagamentoInfo = "💳 *Pagamento:* Cartão";
    else if (form.formaPagamento === "dinheiro") {
      pagamentoInfo = form.precisaTroco
        ? `💵 *Pagamento:* Dinheiro\n💰 *Troco para:* R$ ${form.valorTroco}`
        : "💵 *Pagamento:* Dinheiro (não precisa de troco)";
    }

    const enderecoCompleto = form.tipoEntrega === "entrega"
      ? `${form.rua.trim()} - ${form.bairro}`
      : "RETIRADA NO LOCAL";

    let entregaInfo = "";
    if (form.tipoEntrega === "entrega") {
      entregaInfo = `🚚 *Entrega:*\n${form.rua.trim()}\n📍 Bairro: ${form.bairro}`;
    } else {
      entregaInfo = `🏪 *Retirada no local*\n${settings?.endereco || ""}`;
    }

    try {
      await createOrder.mutateAsync({
        nome_cliente: form.nome.trim(),
        telefone: form.telefone.trim(),
        endereco: enderecoCompleto,
        observacao: `Tipo: ${form.tipoEntrega === "entrega" ? "ENTREGA" : "RETIRADA"}\n${form.observacao.trim() || ""}\n\n${pagamentoInfo}`.trim(),
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

${entregaInfo}

*Observação:*
${form.observacao.trim() || "Nenhuma"}`;

    const encoded = encodeURIComponent(mensagem);
    const phone = settings?.telefone_whatsapp || "5511999999999";
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
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
        {/* Order Summary */}
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

          {/* Delivery Type */}
          <div className="border-2 border-border bg-card p-4">
            <label className="font-heading text-xs uppercase tracking-wider block mb-3">
              TIPO DE ENTREGA <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: "entrega", label: "🚚 Entrega no endereço" },
                { value: "retirada", label: "🏪 Retirar no local" },
              ].map((opt) => (
                <label key={opt.value} className={`flex items-center gap-3 cursor-pointer p-3 border-2 transition-colors ${form.tipoEntrega === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}>
                  <input type="radio" name="tipoEntrega" value={opt.value} checked={form.tipoEntrega === opt.value} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="font-body text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery address fields */}
          {form.tipoEntrega === "entrega" && (
            <>
              {/* Bairro selector */}
              <div className="border-2 border-border bg-card p-4">
                <label className="font-heading text-xs uppercase tracking-wider block mb-2">
                  BAIRRO <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setBairroOpen(!bairroOpen)}
                    className={`w-full flex items-center justify-between border-b-2 pb-1 text-left font-body text-sm transition-colors ${form.bairro ? "text-foreground border-accent" : "text-muted-foreground border-border"}`}
                  >
                    <span>{form.bairro || "Selecione o bairro..."}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${bairroOpen ? "rotate-180" : ""}`} />
                  </button>

                  {bairroOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border-2 border-border max-h-64 overflow-y-auto shadow-lg">
                      {BAIRROS.map((bairro) => (
                        <button
                          key={bairro}
                          type="button"
                          onClick={() => { setForm({ ...form, bairro }); setBairroOpen(false); }}
                          className={`w-full text-left px-4 py-3 font-body text-sm border-b border-border/50 hover:bg-primary/10 transition-colors ${form.bairro === bairro ? "bg-primary/10 text-primary font-medium" : ""}`}
                        >
                          {bairro}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rua e número */}
              <FormBlock label="RUA E NÚMERO" name="rua" value={form.rua} onChange={handleChange} required placeholder="Ex: Rua das Flores, 123" />
            </>
          )}

          {/* Store address for pickup */}
          {form.tipoEntrega === "retirada" && settings?.endereco && (
            <div className="border-2 border-primary/30 bg-primary/5 p-4">
              <p className="font-heading text-xs uppercase tracking-wider mb-1">🏪 ENDEREÇO PARA RETIRADA</p>
              <p className="font-body text-sm">{settings.endereco}</p>
            </div>
          )}

          {/* Payment Method */}
          <div className="border-2 border-border bg-card p-4">
            <label className="font-heading text-xs uppercase tracking-wider block mb-3">
              FORMA DE PAGAMENTO <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: "pix", label: "💳 PIX" },
                { value: "cartao", label: "💳 Cartão (Débito/Crédito)" },
                { value: "dinheiro", label: "💵 Dinheiro" },
              ].map((opt) => (
                <label key={opt.value} className={`flex items-center gap-3 cursor-pointer p-3 border-2 transition-colors ${form.formaPagamento === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}>
                  <input type="radio" name="formaPagamento" value={opt.value} checked={form.formaPagamento === opt.value} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="font-body text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Change for Cash */}
          {form.formaPagamento === "dinheiro" && (
            <div className="border-2 border-border bg-card p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.precisaTroco} onChange={(e) => setForm({ ...form, precisaTroco: e.target.checked, valorTroco: "" })} className="w-4 h-4 accent-primary" />
                <span className="font-heading text-xs uppercase tracking-wider">PRECISA DE TROCO?</span>
              </label>
              {form.precisaTroco && (
                <div>
                  <label className="font-heading text-xs uppercase tracking-wider block mb-2">
                    TROCO PARA QUANTO? <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text" name="valorTroco" value={form.valorTroco} onChange={handleChange}
                    placeholder="Ex: 50,00"
                    className="w-full bg-transparent font-body text-sm outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors text-foreground"
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="border-2 border-border bg-card p-4">
            <label className="font-heading text-xs uppercase tracking-wider block mb-2">OBSERVAÇÃO</label>
            <textarea
              name="observacao" value={form.observacao} onChange={handleChange}
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

function FormBlock({ label, name, value, onChange, required, placeholder }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; placeholder?: string;
}) {
  return (
    <div className="border-2 border-border bg-card p-4">
      <label className="font-heading text-xs uppercase tracking-wider block mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type="text" name={name} value={value} onChange={onChange} required={required}
        placeholder={placeholder}
        className="w-full bg-transparent font-body text-sm outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors duration-100 text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const createOrder = useCreateOrder();
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    tipoEntrega: "", // "entrega" ou "retirada"
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

    if (!form.nome.trim() || !form.telefone.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!form.tipoEntrega) {
      toast.error("Selecione o tipo de entrega.");
      return;
    }

    if (form.tipoEntrega === "entrega" && !form.endereco.trim()) {
      toast.error("Informe o endereço para entrega.");
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

    // Prepare delivery info
    let entregaInfo = "";
    if (form.tipoEntrega === "entrega") {
      entregaInfo = `🚚 *Entrega no endereço:*\n${form.endereco.trim()}`;
    } else {
      entregaInfo = `🏪 *Retirada no local*\n${settings?.endereco || "Aguardando confirmação do endereço"}`;
    }

    // Save order to database
    try {
      await createOrder.mutateAsync({
        nome_cliente: form.nome.trim(),
        telefone: form.telefone.trim(),
        endereco: form.tipoEntrega === "entrega" ? form.endereco.trim() : "RETIRADA NO LOCAL",
        observacao: `Tipo: ${form.tipoEntrega === "entrega" ? "ENTREGA" : "RETIRADA"}\n${form.observacao.trim() || ""}\n\n${pagamentoInfo}`.trim(),
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

${entregaInfo}

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
          
          {/* Delivery Type */}
          <div className="border-2 border-border bg-card p-4">
            <label className="font-heading text-xs uppercase tracking-wider block mb-3">
              TIPO DE ENTREGA <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-border hover:border-accent transition-colors">
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="entrega"
                  checked={form.tipoEntrega === "entrega"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body text-sm">🚚 Entrega no endereço</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-border hover:border-accent transition-colors">
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="retirada"
                  checked={form.tipoEntrega === "retirada"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body text-sm">🏪 Retirar no local</span>
              </label>
            </div>
          </div>

          {/* Address - only show if delivery */}
          {form.tipoEntrega === "entrega" && (
            <FormBlock 
              label="ENDEREÇO PARA ENTREGA" 
              name="endereco" 
              value={form.endereco} 
              onChange={handleChange} 
              required 
            />
          )}

          {/* Store address info for pickup */}
          {form.tipoEntrega === "retirada" && settings?.endereco && (
            <div className="border-2 border-border bg-card p-4">
              <label className="font-heading text-xs uppercase tracking-wider block mb-2">
                🏪 ENDEREÇO PARA RETIRADA
              </label>
              <p className="font-body text-sm text-muted-foreground">
                {settings.endereco}
              </p>
            </div>
          )}
          
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
