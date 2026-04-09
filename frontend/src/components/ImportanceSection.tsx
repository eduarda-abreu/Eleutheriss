import womenFinance from "@/assets/women-finance.png";

const ImportanceSection = () => {
  return (
    <section id="importancia" className="py-24 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <img
              src={womenFinance}
              alt="Mulheres unidas pela educação financeira"
              loading="lazy"
              width={800}
              height={600}
              className="w-full max-w-lg drop-shadow-xl"
            />
          </div>

          <div className="space-y-6">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Por que importa</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              A importância da{" "}
              <span className="text-gradient-gold">educação financeira feminina</span>
            </h2>

            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                A independência financeira é um dos pilares mais importantes da autonomia feminina. 
                Quando uma mulher domina suas finanças, ela não apenas transforma sua própria vida, 
                mas também inspira gerações.
              </p>
              <p>
                Infelizmente, muitas mulheres ainda enfrentam barreiras para acessar educação financeira 
                de qualidade. A desigualdade salarial, a sobrecarga com trabalho doméstico e a falta de 
                representatividade no mercado financeiro criam obstáculos reais.
              </p>
              <p>
                A <strong className="text-foreground">Eleutheriss</strong> nasceu para mudar essa realidade. 
                Acreditamos que toda mulher merece ter as ferramentas e o conhecimento necessários para 
                construir um futuro financeiro sólido e independente.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-2xl font-bold text-primary">62%</p>
                <p className="text-sm text-muted-foreground">das mulheres não têm reserva de emergência</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-2xl font-bold text-primary">78%</p>
                <p className="text-sm text-muted-foreground">querem aprender mais sobre finanças</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportanceSection;
