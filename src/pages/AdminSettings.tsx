import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSettings, useUpdateSettings } from "@/hooks/use-supabase";
import { toast } from "sonner";

export default function AdminSettings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState({ nome_loja: "", telefone_whatsapp: "", endereco: "", logo_url: "" });

  useEffect(() => {
    if (settings) {
      setForm({
        nome_loja: settings.nome_loja || "",
        telefone_whatsapp: settings.telefone_whatsapp || "",
        endereco: settings.endereco || "",
        logo_url: settings.logo_url || "",
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await updateSettings.mutateAsync({ id: settings.id, ...form });
      toast.success("Configurações salvas!");
    } catch { toast.error("Erro ao salvar."); }
  };

  if (isLoading) return <p className="font-heading text-sm uppercase text-muted-foreground">CARREGANDO...</p>;

  return (
    <div>
      <h2 className="font-heading text-xl uppercase mb-6">CONFIGURAÇÕES</h2>
      <div className="bg-card border-2 border-border p-6 max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          {[
            { label: "NOME DA LOJA", name: "nome_loja" },
            { label: "TELEFONE WHATSAPP", name: "telefone_whatsapp" },
            { label: "ENDEREÇO", name: "endereco" },
            { label: "URL DO LOGO", name: "logo_url" },
          ].map((field) => (
            <div key={field.name} className="border-2 border-border p-4">
              <label className="font-heading text-xs uppercase block mb-2">{field.label}</label>
              <input name={field.name} value={(form as any)[field.name]} onChange={handleChange}
                className="w-full bg-transparent font-body text-sm outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors duration-100" />
            </div>
          ))}
          <Button type="submit" size="lg" className="w-full" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? "SALVANDO..." : "SALVAR CONFIGURAÇÕES"}
          </Button>
        </form>
      </div>
    </div>
  );
}
