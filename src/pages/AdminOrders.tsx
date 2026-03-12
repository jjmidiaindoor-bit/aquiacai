import { useOrders } from "@/hooks/use-supabase";

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <p className="font-heading text-sm uppercase text-muted-foreground">CARREGANDO...</p>;

  return (
    <div>
      <h2 className="font-heading text-xl uppercase mb-6">PEDIDOS</h2>
      <div className="border-2 border-border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-heading text-xs uppercase">CLIENTE</th>
              <th className="text-left p-3 font-heading text-xs uppercase hidden md:table-cell">TELEFONE</th>
              <th className="text-left p-3 font-heading text-xs uppercase hidden lg:table-cell">PEDIDO</th>
              <th className="text-right p-3 font-heading text-xs uppercase">TOTAL</th>
              <th className="text-right p-3 font-heading text-xs uppercase hidden md:table-cell">DATA</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground font-body text-sm">Nenhum pedido ainda.</td></tr>
            ) : (
              (orders || []).map((order) => (
                <tr key={order.id} className="border-t-2 border-border">
                  <td className="p-3 font-body text-sm">{order.nome_cliente}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground hidden md:table-cell">{order.telefone}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground hidden lg:table-cell whitespace-pre-line">{order.detalhes_pedido}</td>
                  <td className="p-3 font-heading text-sm text-right">R$ {Number(order.total).toFixed(2).replace(".", ",")}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground text-right hidden md:table-cell">
                    {new Date(order.created_at).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
