import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Dashboard() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se usuário está autenticado
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = "/";
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };

    getUser();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          window.location.href = "/";
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Portal do Aluno</h1>
              <p className="text-sm text-muted-foreground">FAETERJ</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Bem-vindo ao Portal do Aluno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Olá, <span className="font-medium text-foreground">{user?.email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Você está conectado ao Portal do Aluno da FAETERJ.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Notas e Frequência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Consulte suas notas e frequência em todas as disciplinas.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Horários</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Visualize seus horários de aula e cronograma acadêmico.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Acesse e baixe seus documentos acadêmicos.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Leia comunicados e mensagens da coordenação.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Consulte boletos e situação financeira.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Suporte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Entre em contato com o suporte técnico.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}