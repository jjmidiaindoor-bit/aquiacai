interface CategoryNavProps {
  categories: { id: string; nome: string }[];
  activeCategory: string | null;
  onCategoryClick: (id: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  return (
    <nav className="sticky top-16 z-40 bg-background border-b-2 border-border">
      <div className="container flex gap-0 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={`px-6 py-3 font-heading text-xs uppercase tracking-wider whitespace-nowrap border-b-4 transition-all duration-100 ${
              activeCategory === cat.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>
    </nav>
  );
}
