import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, nome }: { id?: string; nome: string }) => {
      if (id) {
        const { error } = await supabase.from("categorias").update({ nome }).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categorias").insert({ nome });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categorias"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categorias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categorias"] }),
  });
}

// Products
export function useProducts() {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("*, categorias(nome)")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      nome,
      descricao,
      preco,
      foto_url,
      categoria_id,
    }: {
      id?: string;
      nome: string;
      descricao?: string;
      preco: number;
      foto_url?: string;
      categoria_id?: string;
    }) => {
      const payload = { nome, descricao, preco, foto_url, categoria_id };
      if (id) {
        const { error } = await supabase.from("produtos").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("produtos").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produtos"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produtos"] }),
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (order: {
      nome_cliente: string;
      telefone: string;
      endereco?: string;
      observacao?: string;
      detalhes_pedido: string;
      total: number;
    }) => {
      const { error } = await supabase.from("pedidos").insert(order);
      if (error) throw error;
    },
  });
}

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ["configuracoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...values
    }: {
      id: string;
      nome_loja?: string;
      telefone_whatsapp?: string;
      endereco?: string;
      logo_url?: string;
    }) => {
      const { error } = await supabase.from("configuracoes").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["configuracoes"] }),
  });
}
