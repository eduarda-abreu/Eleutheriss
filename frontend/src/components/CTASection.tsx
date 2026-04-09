import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 gradient-hero">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Comece sua jornada rumo à{" "}
            <span className="text-gradient-gold">liberdade financeira</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Junte-se a milhares de mulheres que já estão transformando sua relação com o dinheiro. 
            A Eleutheriss é 100% gratuita e feita com amor para você.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-base" asChild>
              <Link to="/cadastro">
                Criar Minha Conta Grátis
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="wine" size="lg" className="text-base">
              Explorar Cursos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
