import { useState, useRef } from "react";
import { CustomerHeader } from "@/components/CustomerHeader";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { CategoryNav } from "@/components/CategoryNav";
import { useProducts, useCategories, useSettings } from "@/hooks/use-supabase";
import heroImg from "@/assets/acai-hero.jpg";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: settings } = useSettings();

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "auto" });
    }
  };

  const productsByCategory = (categories || []).map((cat) => ({
    ...cat,
    products: (products || []).filter((p) => p.categoria_id === cat.id),
  }));

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader onCartOpen={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden bg-primary">
        <img
          src={heroImg}
          alt={settings?.nome_loja || "Açaí Express"}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative flex h-full flex-col items-center justify-center text-primary-foreground p-4">
          <h2 className="font-heading text-3xl md:text-5xl uppercase tracking-wider text-center">
            {settings?.nome_loja || "AÇAÍ EXPRESS"}
          </h2>
          <p className="mt-2 font-body text-sm md:text-base text-primary-foreground/80 text-center">
            O melhor açaí da cidade, direto pra você.
          </p>
        </div>
      </section>

      {!loadingCategories && categories && (
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Products by category */}
      <main className="container py-6 space-y-10">
        {loadingProducts || loadingCategories ? (
          <div className="text-center py-20">
            <p className="font-heading text-sm uppercase text-muted-foreground">CARREGANDO...</p>
          </div>
        ) : productsByCategory.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-sm uppercase text-muted-foreground">NENHUM PRODUTO CADASTRADO</p>
          </div>
        ) : (
          productsByCategory.map((cat) =>
            cat.products.length > 0 ? (
              <section
                key={cat.id}
                ref={(el) => {
                  sectionRefs.current[cat.id] = el;
                }}
                className="scroll-mt-32"
              >
                <h2 className="font-heading text-xl uppercase tracking-wider mb-4 border-b-4 border-primary pb-2 inline-block">
                  {cat.nome}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cat.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        nome: product.nome,
                        descricao: product.descricao || "",
                        preco: Number(product.preco),
                        foto_url: product.foto_url || "",
                        categoria_id: product.categoria_id || "",
                      }}
                    />
                  ))}
                </div>
              </section>
            ) : null
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {/* Nome da Loja */}
            <div>
              <p className="font-heading text-lg uppercase mb-2">{settings?.nome_loja || "AÇAÍ EXPRESS"}</p>
              <p className="font-body text-xs text-primary-foreground/60">
                O melhor açaí da cidade
              </p>
            </div>

            {/* Endereço */}
            {settings?.endereco && (
              <div>
                <p className="font-heading text-xs uppercase mb-2 text-primary-foreground/80">Endereço</p>
                <p className="font-body text-sm text-primary-foreground/90">
                  {settings.endereco}
                </p>
              </div>
            )}

            {/* Contato */}
            {settings?.telefone_whatsapp && (
              <div>
                <p className="font-heading text-xs uppercase mb-2 text-primary-foreground/80">Contato</p>
                <a 
                  href={`https://wa.me/${settings.telefone_whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {settings.telefone_whatsapp}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-primary-foreground/20 text-center">
            <p className="font-body text-xs text-primary-foreground/60">
              © 2026 Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;
