import { useState, useRef } from "react";
import { CustomerHeader } from "@/components/CustomerHeader";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { CategoryNav } from "@/components/CategoryNav";
import { useProducts, useCategories } from "@/hooks/use-supabase";
import heroImg from "@/assets/acai-hero.jpg";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();

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
          alt="Açaí Express"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative flex h-full flex-col items-center justify-center text-primary-foreground p-4">
          <h2 className="font-heading text-3xl md:text-5xl uppercase tracking-wider text-center">
            AÇAÍ EXPRESS
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
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container text-center">
          <p className="font-heading text-sm uppercase">AÇAÍ EXPRESS</p>
          <p className="font-body text-xs text-primary-foreground/60 mt-1">
            © 2026 Todos os direitos reservados
          </p>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;
