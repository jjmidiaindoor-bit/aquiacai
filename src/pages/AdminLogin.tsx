import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { data: settings } = useSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error("Email ou senha incorretos.");
    } else {
      navigate("/admin");
      toast.success("Login realizado!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card p-8 border-2 border-border">
        <div className="flex flex-col items-center mb-2">
          {settings?.logo_url && (
            <img 
              src={settings.logo_url} 
              alt={settings.nome_loja || "Logo"} 
              className="h-16 w-16 object-contain mb-3"
            />
          )}
          <h1 className="font-heading text-2xl uppercase text-center">
            {settings?.nome_loja || "AÇAÍ EXPRESS"}
          </h1>
        </div>
        <p className="text-center text-muted-foreground text-sm mb-8 font-body">Painel Administrativo</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="border-2 border-border p-4">
            <label className="font-heading text-xs uppercase block mb-2">EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent font-body text-sm outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors duration-100" required />
          </div>
          <div className="border-2 border-border p-4">
            <label className="font-heading text-xs uppercase block mb-2">SENHA</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent font-body text-sm outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors duration-100" required />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </form>
      </div>
    </div>
  );
}
