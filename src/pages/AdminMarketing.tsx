import { useState } from "react";
import { useOrders } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Send, Upload, Users, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminMarketing() {
  const { data: pedidos, isLoading } = useOrders();
  const [mensagem, setMensagem] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Get unique customers
  const clientes = pedidos
    ? Array.from(
        new Map(
          pedidos.map((p) => [
            p.telefone,
            { nome: p.nome_cliente, telefone: p.telefone },
          ])
        ).values()
      )
    : [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 5MB.");
        return;
      }

      setImagemFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnviarMassa = async () => {
    if (!mensagem.trim()) {
      toast.error("Digite uma mensagem");
      return;
    }

    if (clientes.length === 0) {
      toast.error("Nenhum cliente encontrado");
      return;
    }

    const confirmar = window.confirm(
      `Deseja enviar esta mensagem para ${clientes.length} cliente(s)?\n\nIsso abrirá uma aba do WhatsApp para cada cliente.`
    );

    if (!confirmar) return;

    setEnviando(true);

    try {
      let mensagemFinal = mensagem.trim();

      // If there's an image URL, add it to the message
      if (imagemUrl.trim()) {
        mensagemFinal = `${mensagemFinal}\n\n📸 Imagem: ${imagemUrl.trim()}`;
      }

      // Note: WhatsApp Web API doesn't support sending images directly
      // We can only send the image URL in the message
      // For actual image sending, you'd need WhatsApp Business API

      let enviados = 0;
      let falhas = 0;

      for (const cliente of clientes) {
        try {
          const mensagemPersonalizada = `Olá *${cliente.nome}*! 👋\n\n${mensagemFinal}`;
          const encoded = encodeURIComponent(mensagemPersonalizada);
          const telefone = cliente.telefone.replace(/\D/g, "");
          const whatsappUrl = `https://wa.me/${telefone}?text=${encoded}`;

          // Open in new tab with a small delay to avoid blocking
          await new Promise((resolve) => setTimeout(resolve, 1000));
          window.open(whatsappUrl, "_blank");
          enviados++;
        } catch (error) {
          console.error(`Erro ao enviar para ${cliente.nome}:`, error);
          falhas++;
        }
      }

      toast.success(
        `${enviados} mensagem(ns) preparada(s)! ${falhas > 0 ? `${falhas} falha(s).` : ""}`
      );
    } catch (error) {
      toast.error("Erro ao enviar mensagens");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  const handleEnviarTeste = () => {
    if (!mensagem.trim()) {
      toast.error("Digite uma mensagem");
      return;
    }

    let mensagemFinal = mensagem.trim();

    if (imagemUrl.trim()) {
      mensagemFinal = `${mensagemFinal}\n\n📸 Imagem: ${imagemUrl.trim()}`;
    }

    const mensagemTeste = `*[TESTE]* Olá *Cliente Exemplo*! 👋\n\n${mensagemFinal}`;
    const encoded = encodeURIComponent(mensagemTeste);
    const whatsappUrl = `https://wa.me/?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Mensagem de teste aberta no WhatsApp");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-heading text-sm uppercase text-muted-foreground">
          CARREGANDO...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl uppercase">MARKETING</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Envie ofertas e promoções para seus clientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="font-heading text-3xl">{clientes.length}</p>
              <p className="text-sm text-muted-foreground">Clientes Únicos</p>
            </div>
          </div>
        </div>

        <div className="border-2 border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Send className="h-8 w-8 text-primary" />
            <div>
              <p className="font-heading text-3xl">{pedidos?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Composer */}
      <div className="border-2 border-border bg-card p-6 space-y-4">
        <h2 className="font-heading text-lg uppercase">CRIAR MENSAGEM</h2>

        <div>
          <label className="font-heading text-xs uppercase block mb-2">
            MENSAGEM DA OFERTA
          </label>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full bg-background border-2 border-border p-4 font-body text-sm outline-none resize-none h-40 focus:border-accent transition-colors"
            placeholder="Ex: 🍇 PROMOÇÃO ESPECIAL! 🍇&#10;&#10;Açaí 500ml por apenas R$ 15,00!&#10;Válido até domingo.&#10;&#10;Peça já pelo nosso site! 🚀"
          />
          <p className="text-xs text-muted-foreground mt-1">
            A mensagem será personalizada com o nome de cada cliente
          </p>
        </div>

        <div>
          <label className="font-heading text-xs uppercase block mb-2">
            IMAGEM DA OFERTA (OPCIONAL)
          </label>

          <div className="space-y-3">
            {/* Image URL Input */}
            <div>
              <input
                type="text"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                className="w-full bg-background border-2 border-border p-3 font-body text-sm outline-none focus:border-accent transition-colors"
                placeholder="Cole a URL da imagem aqui (ex: https://exemplo.com/imagem.jpg)"
              />
            </div>

            {/* Or Upload */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-xs text-muted-foreground uppercase">OU</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <div>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border p-6 cursor-pointer hover:border-accent transition-colors">
                <Upload className="h-5 w-5" />
                <span className="font-heading text-xs uppercase">
                  {imagemFile ? imagemFile.name : "FAZER UPLOAD DE IMAGEM"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Máximo 5MB. Após upload, você precisará hospedar a imagem online.
              </p>
            </div>

            {/* Preview */}
            {(previewUrl || imagemUrl) && (
              <div className="border-2 border-border p-4">
                <p className="font-heading text-xs uppercase mb-2">PREVIEW</p>
                <img
                  src={previewUrl || imagemUrl}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 object-contain"
                  onError={() => {
                    toast.error("Erro ao carregar imagem");
                    setImagemUrl("");
                    setPreviewUrl("");
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 text-yellow-800 text-xs">
            <p className="font-heading uppercase mb-1">⚠️ IMPORTANTE:</p>
            <p>
              O WhatsApp Web não permite envio direto de imagens. A URL da imagem
              será incluída na mensagem. Para envio real de imagens, é necessário
              usar WhatsApp Business API.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleEnviarTeste}
            variant="outline"
            className="gap-2"
            disabled={!mensagem.trim()}
          >
            <Send className="h-4 w-4" />
            ENVIAR TESTE
          </Button>

          <Button
            onClick={handleEnviarMassa}
            className="gap-2 flex-1"
            disabled={!mensagem.trim() || enviando || clientes.length === 0}
          >
            <Send className="h-4 w-4" />
            {enviando
              ? "ENVIANDO..."
              : `ENVIAR PARA ${clientes.length} CLIENTE(S)`}
          </Button>
        </div>
      </div>

      {/* Customer List */}
      <div className="border-2 border-border bg-card p-6">
        <h2 className="font-heading text-lg uppercase mb-4">
          LISTA DE CLIENTES ({clientes.length})
        </h2>

        {clientes.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">
            Nenhum cliente encontrado. Aguarde os primeiros pedidos.
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clientes.map((cliente, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-2 border-border hover:border-accent transition-colors"
              >
                <div>
                  <p className="font-heading text-sm uppercase">{cliente.nome}</p>
                  <p className="text-xs text-muted-foreground">{cliente.telefone}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const msg = mensagem.trim() || "Olá! Temos novidades para você!";
                    const encoded = encodeURIComponent(
                      `Olá *${cliente.nome}*! 👋\n\n${msg}`
                    );
                    const telefone = cliente.telefone.replace(/\D/g, "");
                    window.open(`https://wa.me/${telefone}?text=${encoded}`, "_blank");
                  }}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
