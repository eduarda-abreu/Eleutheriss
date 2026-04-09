const stats = [
  {
    value: "46%",
    label: "das mulheres brasileiras são as principais responsáveis pelo orçamento familiar",
    source: "SPC Brasil",
  },
  {
    value: "58%",
    label: "das mulheres nunca fizeram nenhum tipo de investimento financeiro",
    source: "Anbima",
  },
  {
    value: "22%",
    label: "é a diferença salarial média entre homens e mulheres no Brasil",
    source: "IBGE",
  },
  {
    value: "71%",
    label: "das mulheres afirmam que a falta de dinheiro é fonte de estresse constante",
    source: "Pesquisa Serasa",
  },
  {
    value: "3x",
    label: "mais tempo dedicado a trabalho doméstico não remunerado comparado aos homens",
    source: "IBGE/PNAD",
  },
  {
    value: "67%",
    label: "das mulheres endividadas dizem que nunca receberam orientação financeira",
    source: "CNC",
  },
];

const StatsSection = () => {
  return (
    <section id="dados" className="py-24 gradient-wine text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-gold-glow uppercase tracking-wider">Os Números</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">
            A realidade financeira das mulheres no Brasil
          </h2>
          <p className="mt-4 text-secondary-foreground/80 text-lg">
            Dados que mostram por que a educação financeira feminina é urgente e necessária.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-secondary-foreground/5 border border-secondary-foreground/10 backdrop-blur-sm hover:bg-secondary-foreground/10 transition-colors"
            >
              <p className="text-4xl font-bold text-gold-glow mb-3">{stat.value}</p>
              <p className="text-secondary-foreground/90 leading-relaxed mb-3">{stat.label}</p>
              <p className="text-xs text-secondary-foreground/50">Fonte: {stat.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
