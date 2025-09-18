import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import heroBg from "@/assets/faeterj-hero-bg.jpg";

// Validação de e-mail institucional
const INSTITUTIONAL_EMAIL_DOMAIN = "@aluno.faeterj-prc.faetec.rj.gov.br";

const alternativeFormSchema = z.object({
  email: z.string()
    .email("E-mail inválido")
    .refine(email => email.endsWith(INSTITUTIONAL_EMAIL_DOMAIN), 
      `E-mail deve ser do domínio institucional ${INSTITUTIONAL_EMAIL_DOMAIN}`),
  cpf: z.string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido"),
});

type AlternativeFormData = z.infer<typeof alternativeFormSchema>;

export default function LoginPage() {
  const [showAlternativeForm, setShowAlternativeForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AlternativeFormData>({
    resolver: zodResolver(alternativeFormSchema),
  });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage("");
    
    // Simulação da validação do Google OAuth
    // Em produção, isso seria feito com a API do Google
    setTimeout(() => {
      const mockEmail = "exemplo@gmail.com"; // Simular e-mail não institucional
      
      if (!mockEmail.endsWith(INSTITUTIONAL_EMAIL_DOMAIN)) {
        setErrorMessage(
          `Acesso negado! Utilize apenas e-mails institucionais com o domínio ${INSTITUTIONAL_EMAIL_DOMAIN}`
        );
      } else {
        setSuccessMessage("Login realizado com sucesso!");
      }
      setIsLoading(false);
    }, 2000);
  };

  const onSubmitAlternativeForm = async (data: AlternativeFormData) => {
    if (!recaptchaValue) {
      setErrorMessage("Por favor, complete o reCAPTCHA");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Simular envio dos dados para validação
      console.log("Dados enviados:", { ...data, recaptcha: recaptchaValue });
      
      // Simular resposta do backend
      setTimeout(() => {
        setSuccessMessage(
          "Dados enviados com sucesso! Verifique seu e-mail para o código de validação."
        );
        reset();
        setRecaptchaValue(null);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setErrorMessage("Erro ao processar dados. Tente novamente.");
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(213, 94%, 68%) 0%, hsl(213, 94%, 68%, 0.9) 50%, hsl(215, 25%, 27%, 0.95) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-strong">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Portal do Aluno FAETERJ
          </h1>
          <p className="text-muted-foreground">
            Acesse seu portal acadêmico institucional
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-md shadow-strong border-0">
        <CardContent className="p-8">
          {/* Messages */}
          {errorMessage && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive font-medium">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-6 border-green-500/50 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 font-medium">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {!showAlternativeForm ? (
            /* Google Login */
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Acesso Institucional
                </h2>
                <p className="text-sm text-muted-foreground">
                  Entre com sua conta Google institucional
                </p>
              </div>

              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-primary hover:bg-primary-hover transition-smooth shadow-medium text-primary-foreground font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Entrar com Google
                  </div>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowAlternativeForm(true)}
                className="w-full h-12 border-border hover:bg-secondary transition-smooth"
              >
                <User className="w-4 h-4 mr-2" />
                Sou um novo aluno
              </Button>
            </div>
          ) : (
            /* Alternative Form */
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Cadastro de Novo Aluno
                </h2>
                <p className="text-sm text-muted-foreground">
                  Preencha com seus dados de matrícula
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmitAlternativeForm)} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-mail de matrícula *
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.nome@aluno.faeterj-prc.faetec.rj.gov.br"
                      className="pl-10 h-11 border-border focus:ring-2 focus:ring-primary/20 transition-smooth"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-foreground">
                    CPF *
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="pl-10 h-11 border-border focus:ring-2 focus:ring-primary/20 transition-smooth"
                      {...register("cpf")}
                      onChange={(e) => {
                        e.target.value = formatCPF(e.target.value);
                      }}
                    />
                  </div>
                  {errors.cpf && (
                    <p className="text-destructive text-sm mt-1">{errors.cpf.message}</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Site key de teste
                    onChange={setRecaptchaValue}
                    onExpired={() => setRecaptchaValue(null)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAlternativeForm(false);
                      setErrorMessage("");
                      setSuccessMessage("");
                      reset();
                    }}
                    className="flex-1 h-11 border-border hover:bg-secondary transition-smooth"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !recaptchaValue}
                    className="flex-1 h-11 bg-gradient-primary hover:bg-primary-hover transition-smooth shadow-medium text-primary-foreground font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      "Solicitar Acesso"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 FAETERJ - Faculdade de Educação Tecnológica do Rio de Janeiro
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Dúvidas? Entre em contato com o suporte técnico
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}