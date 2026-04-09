import { Camera, PieChart, BookOpen, Shield, TrendingUp, Users } from "lucide-react";
import receiptScan from "@/assets/receipt-scan.png";

const features = [
  {
    icon: Camera,
    title: "Leitura Automática de Comprovantes",
    description: "Tire uma foto do seu comprovante e nós extraímos automaticamente os dados para o seu fluxo de caixa.",
  },
  {
    icon: PieChart,
    title: "Fluxo de Caixa Inteligente",
    description: "Visualize suas receitas e despesas em gráficos claros e intuitivos, atualizados em tempo real.",
  },
  {
    icon: BookOpen,
    title: "Cursos de Educação Financeira",
    description: "Aprenda sobre planejamento, reserva de emergência, investimentos e muito mais.",
  },
  {
    icon: Shield,
    title: "Reserva de Emergência",
    description: "Ferramentas e orientações para construir sua reserva de emergência com segurança.",
  },
  {
    icon: TrendingUp,
    title: "Guia de Investimentos",
    description: "Conteúdos acessíveis sobre como começar a investir, mesmo com pouco dinheiro.",
  },
  {
    icon: Users,
    title: "Comunidade Feminina",
    description: "Conecte-se com outras mulheres que estão construindo sua independência financeira.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="funcionalidades" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Funcionalidades</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground">
            Tudo que você precisa para sua{" "}
            <span className="text-gradient-gold">liberdade financeira</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Uma plataforma completa que combina gestão financeira automatizada com educação de qualidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Escaneie seus comprovantes e pronto!
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Com apenas uma foto, nossa inteligência artificial reconhece os dados do comprovante 
                e registra automaticamente no seu fluxo de caixa. Sem digitação, sem complicação.
              </p>
              <ul className="space-y-3">
                {["Reconhecimento automático por IA", "Categorização inteligente", "Histórico completo"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <img
                src={receiptScan}
                alt="Scanner de comprovantes"
                loading="lazy"
                width={500}
                height={400}
                className="w-full max-w-sm drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
