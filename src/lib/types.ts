export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  foto_url: string;
  categoria_id: string;
  categoria_nome?: string;
}

export interface Category {
  id: string;
  nome: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderData {
  nome_cliente: string;
  telefone: string;
  endereco: string;
  observacao: string;
  detalhes_pedido: string;
  total: number;
  data: string;
}

export interface StoreSettings {
  nome_loja: string;
  telefone_whatsapp: string;
  endereco: string;
  logo_url: string;
}
