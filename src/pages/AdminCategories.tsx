import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCategories, useSaveCategory, useDeleteCategory } from "@/hooks/use-supabase";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const saveCategory = useSaveCategory();
  const deleteCategory = useDeleteCategory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");

  const resetForm = () => { setNome(""); setEditingId(null); setShowForm(false); };

  const handleEdit = (c: { id: string; nome: string }) => {
    setNome(c.nome); setEditingId(c.id); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { toast.error("Preencha o nome."); return; }
    try {
      await saveCategory.mutateAsync({ id: editingId || undefined, nome: nome.trim().toUpperCase() });
      toast.success(editingId ? "Categoria atualizada!" : "Categoria adicionada!");
      resetForm();
    } catch { toast.error("Erro ao salvar."); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Categoria excluída!");
    } catch { toast.error("Erro ao excluir."); }
  };

  if (isLoading) return <p className="font-heading text-sm uppercase text-muted-foreground">CARREGANDO...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl uppercase">CATEGORIAS</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4" /> NOVA</Button>
      </div>

      {showForm && (
        <div className="bg-card border-2 border-border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-sm uppercase">{editingId ? "EDITAR CATEGORIA" : "NOVA CATEGORIA"}</h3>
            <button onClick={resetForm}><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={handleSave} className="flex gap-4">
            <div className="flex-1 border-2 border-border p-3">
              <label className="font-heading text-xs uppercase block mb-1">NOME</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)}
                className="w-full bg-transparent font-body text-sm outline-none" required />
            </div>
            <Button type="submit" disabled={saveCategory.isPending}>SALVAR</Button>
          </form>
        </div>
      )}

      <div className="border-2 border-border">
        {(categories || []).map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4 border-b-2 border-border last:border-b-0">
            <span className="font-heading text-sm uppercase">{c.nome}</span>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(c)} className="p-1 hover:text-accent"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(c.id)} className="p-1 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
