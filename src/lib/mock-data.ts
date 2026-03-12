import { Product } from "@/lib/types";

export const MOCK_CATEGORIES = [
  { id: "1", nome: "AÇAÍS" },
  { id: "2", nome: "CREMES" },
  { id: "3", nome: "ADICIONAIS" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    nome: "Açaí Tradicional 300ml",
    descricao: "Açaí puro batido na hora, cremoso e gelado.",
    preco: 14.90,
    foto_url: "",
    categoria_id: "1",
    categoria_nome: "AÇAÍS",
  },
  {
    id: "2",
    nome: "Açaí Tradicional 500ml",
    descricao: "Açaí puro em porção generosa para matar a vontade.",
    preco: 19.90,
    foto_url: "",
    categoria_id: "1",
    categoria_nome: "AÇAÍS",
  },
  {
    id: "3",
    nome: "Açaí Tradicional 700ml",
    descricao: "A maior porção do nosso açaí puro e cremoso.",
    preco: 25.90,
    foto_url: "",
    categoria_id: "1",
    categoria_nome: "AÇAÍS",
  },
  {
    id: "4",
    nome: "Creme de Cupuaçu 300ml",
    descricao: "Creme de cupuaçu natural, doce e refrescante.",
    preco: 16.90,
    foto_url: "",
    categoria_id: "2",
    categoria_nome: "CREMES",
  },
  {
    id: "5",
    nome: "Creme de Morango 300ml",
    descricao: "Creme de morango feito com frutas frescas.",
    preco: 15.90,
    foto_url: "",
    categoria_id: "2",
    categoria_nome: "CREMES",
  },
  {
    id: "6",
    nome: "Granola",
    descricao: "Granola crocante artesanal.",
    preco: 3.00,
    foto_url: "",
    categoria_id: "3",
    categoria_nome: "ADICIONAIS",
  },
  {
    id: "7",
    nome: "Leite em Pó",
    descricao: "Leite em pó Ninho para complementar.",
    preco: 3.50,
    foto_url: "",
    categoria_id: "3",
    categoria_nome: "ADICIONAIS",
  },
  {
    id: "8",
    nome: "Banana",
    descricao: "Banana fatiada fresca.",
    preco: 2.50,
    foto_url: "",
    categoria_id: "3",
    categoria_nome: "ADICIONAIS",
  },
];

export const MOCK_SETTINGS = {
  nome_loja: "Açaí Express",
  telefone_whatsapp: "5511999999999",
  endereco: "Rua do Açaí, 123 - Centro",
  logo_url: "",
};
