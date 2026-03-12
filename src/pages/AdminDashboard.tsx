import { Package, Tag, ClipboardList, TrendingUp } from "lucide-react";
import { useProducts, useCategories, useOrders } from "@/hooks/use-supabase";

export default function AdminDashboard() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const { data: orders } = useOrders();

  const todayOrders = (orders || []).filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);

  const stats = [
    { label: "PRODUTOS", value: products?.length || 0, icon: Package },
    { label: "CATEGORIAS", value: categories?.length || 0, icon: Tag },
    { label: "PEDIDOS HOJE", value: todayOrders.length, icon: ClipboardList },
    { label: "FATURAMENTO HOJE", value: `R$ ${todayRevenue.toFixed(2).replace(".", ",")}`, icon: TrendingUp },
  ];

  return (
    <div>
      <h2 className="font-heading text-xl uppercase mb-6">DASHBOARD</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border-2 border-border p-6 flex flex-col gap-2">
            <stat.icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-heading text-2xl">{stat.value}</span>
            <span className="font-heading text-xs uppercase text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
