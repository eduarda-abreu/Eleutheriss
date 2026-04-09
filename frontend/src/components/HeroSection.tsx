import { Button } from "@/components/ui/button";
import heroWoman from "@/assets/hero-woman.png";
import goldCoinsBg from "@/assets/rain_coins.png";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-16">
      {/* Gold coins background with gradient fade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={goldCoinsBg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-contain opacity-30"
          style={{
            objectPosition: "center center",
            maskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 88%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 88%)",
          }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-[hsl(38_35%_96%)] pointer-events-none" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>100% Gratuita • Feita para mulheres</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Sua liberdade financeira começa{" "}
              <span className="text-gradient-gold">aqui</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Gerencie suas finanças automaticamente com fotos de comprovantes, 
              aprenda sobre investimentos e construa sua independência financeira 
              com a Eleutheriss.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-base" asChild>
                <Link to="/cadastro">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base">
                Conhecer a Plataforma
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">50k+</p>
                <p className="text-sm text-muted-foreground">Mulheres ativas</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">R$ 2M+</p>
                <p className="text-sm text-muted-foreground">Economizados</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.9★</p>
                <p className="text-sm text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 gradient-gold rounded-full opacity-20 blur-2xl animate-float" />
              <img
                src={heroWoman}
                alt="Mulher confiante com gráficos financeiros"
                width={800}
                height={800}
                className="relative z-10 w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
