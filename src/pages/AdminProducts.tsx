import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCategories, useSaveProduct, useDeleteProduct, useProducts } from "@/hooks/use-supabase";
import { Plus, Pencil, Trash2, X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const saveProduct = useSaveProduct();
  const deleteProduct = useDeleteProduct();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nome: "", descricao: "", preco: "", foto_url: "", categoria_id: "",
  });

  const resetForm = () => {
    setForm({ nome: "", descricao: "", preco: "", foto_url: "", categoria_id: categories?.[0]?.id || "" });
    setEditingId(null);
    setShowForm(false);
    setPreviewUrl(null);
  };

  const handleEdit = (p: any) => {
    setForm({
      nome: p.nome, descricao: p.descricao || "", preco: String(p.preco),
      foto_url: p.foto_url || "", categoria_id: p.categoria_id || "",
    });
    setEditingId(p.id);
    setShowForm(true);
    setPreviewUrl(p.foto_url || null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem deve ter no máximo 5MB.");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `produtos/${fileName}`;

    const { error } = await supabase.storage.from("produtos").upload(filePath, file);

    if (error) {
      toast.error("Erro ao enviar imagem.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("produtos").getPublicUrl(filePath);
    setForm((prev) => ({ ...prev, foto_url: urlData.publicUrl }));
    setPreviewUrl(urlData.publicUrl);
    setUploading(false);
    toast.success("Imagem enviada!");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.preco) { toast.error("Preencha nome e preço."); return; }
    try {
      await saveProduct.mutateAsync({
        id: editingId || undefined,
        nome: form.nome, descricao: form.descricao, preco: parseFloat(form.preco),
        foto_url: form.foto_url || undefined, categoria_id: form.categoria_id || undefined,
      });
      toast.success(editingId ? "Produto atualizado!" : "Produto adicionado!");
      resetForm();
    } catch { toast.error("Erro ao salvar produto."); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produto excluído!");
    } catch { toast.error("Erro ao excluir."); }
  };

  if (isLoading) return <p className="font-heading text-sm uppercase text-muted-foreground">CARREGANDO...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl uppercase">PRODUTOS</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4" /> NOVO</Button>
      </div>

      {showForm && (
        <div className="bg-card border-2 border-border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-sm uppercase">{editingId ? "EDITAR PRODUTO" : "NOVO PRODUTO"}</h3>
            <button onClick={resetForm}><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-border p-3">
              <label className="font-heading text-xs uppercase block mb-1">NOME</label>
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full bg-transparent font-body text-sm outline-none" required />
            </div>
            <div className="border-2 border-border p-3">
              <label className="font-heading text-xs uppercase block mb-1">PREÇO</label>
              <input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })}
                className="w-full bg-transparent font-body text-sm outline-none" required />
            </div>
            <div className="border-2 border-border p-3 md:col-span-2">
              <label className="font-heading text-xs uppercase block mb-1">DESCRIÇÃO</label>
              <input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full bg-transparent font-body text-sm outline-none" />
            </div>
            <div className="border-2 border-border p-3">
              <label className="font-heading text-xs uppercase block mb-1">CATEGORIA</label>
              <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                className="w-full bg-transparent font-body text-sm outline-none">
                <option value="">Sem categoria</option>
                {(categories || []).map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="border-2 border-border p-3">
              <label className="font-heading text-xs uppercase block mb-2">FOTO DO PRODUTO</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <div className="relative w-16 h-16 border-2 border-border rounded overflow-hidden flex-shrink-0">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreviewUrl(null); setForm((prev) => ({ ...prev, foto_url: "" })); }}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 border-2 border-dashed border-border rounded flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="font-heading text-xs uppercase"
                >
                  {uploading ? (
                    "ENVIANDO..."
                  ) : (
                    <><Upload className="h-3 w-3 mr-1" /> ENVIAR FOTO</>
                  )}
                </Button>
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={saveProduct.isPending || uploading}>
                {editingId ? "SALVAR ALTERAÇÕES" : "ADICIONAR PRODUTO"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="border-2 border-border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-heading text-xs uppercase w-12">FOTO</th>
              <th className="text-left p-3 font-heading text-xs uppercase">NOME</th>
              <th className="text-left p-3 font-heading text-xs uppercase hidden md:table-cell">CATEGORIA</th>
              <th className="text-right p-3 font-heading text-xs uppercase">PREÇO</th>
              <th className="text-right p-3 font-heading text-xs uppercase">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.id} className="border-t-2 border-border">
                <td className="p-3">
                  {p.foto_url ? (
                    <img src={p.foto_url} alt={p.nome} className="w-10 h-10 object-cover rounded border border-border" />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded border border-border flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="p-3 font-body text-sm">{p.nome}</td>
                <td className="p-3 font-body text-sm text-muted-foreground hidden md:table-cell">
                  {(p as any).categorias?.nome || "—"}
                </td>
                <td className="p-3 font-heading text-sm text-right">
                  R$ {Number(p.preco).toFixed(2).replace(".", ",")}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-1 hover:text-accent"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
