-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Categorias
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage categories" ON public.categorias FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update categories" ON public.categorias FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete categories" ON public.categorias FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10, 2) NOT NULL DEFAULT 0,
  foto_url TEXT,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.produtos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage products" ON public.produtos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON public.produtos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete products" ON public.produtos FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pedidos
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT,
  observacao TEXT,
  detalhes_pedido TEXT NOT NULL,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders" ON public.pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view orders" ON public.pedidos FOR SELECT TO authenticated USING (true);

-- Configuracoes
CREATE TABLE public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_loja TEXT NOT NULL DEFAULT 'Açaí Express',
  telefone_whatsapp TEXT NOT NULL DEFAULT '',
  endereco TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON public.configuracoes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update settings" ON public.configuracoes FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.configuracoes (nome_loja, telefone_whatsapp, endereco)
VALUES ('Açaí Express', '5511999999999', 'Rua do Açaí, 123 - Centro');

-- Insert default categories
INSERT INTO public.categorias (nome) VALUES ('AÇAÍS'), ('CREMES'), ('ADICIONAIS');