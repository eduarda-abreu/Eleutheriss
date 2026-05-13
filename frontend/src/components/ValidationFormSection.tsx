import { ClipboardList, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  "Anônimo",
  "Uso acadêmico",
  "~5 minutos",
  "LGPD aplicada",
  "Dados protegidos",
];

const FORM_URL = "https://docs.google.com/forms/d/e/SEU_FORM_ID_AQUI/viewform";

const ValidationFormSection = () => {
  return (
    <section id="feedback" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">

          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Participe da{" "}
              <span className="text-gradient-gold">Validação</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Responda ao formulário e ajude a equipe a entender se o Eleutheriss
              resolve um problema real para você. Leva menos de 5 minutos.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {badge}
              </span>
            ))}
          </div>

          <Button
            variant="wine"
            size="lg"
            className="text-base rounded-full px-10"
            asChild
          >
            <a href={FORM_URL} target="_blank" rel="noopener noreferrer">
              Responder ao Formulário
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </Button>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Seus dados são utilizados exclusivamente para fins de pesquisa acadêmica.
            <br />
            Regras de anonimato são aplicadas. FACENS — Engenharia de Software, 7°
            Semestre, 2026.
          </p>

        </div>
      </div>
    </section>
  );
};

export default ValidationFormSection;
