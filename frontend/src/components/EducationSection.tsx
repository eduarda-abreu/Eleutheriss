import { Button } from "@/components/ui/button";
import educationWoman from "@/assets/education-woman.png";
import { Clock, Star, Award } from "lucide-react";

const courses = [
  {
    title: "Planejamento Financeiro Pessoal",
    description: "Aprenda a organizar sua vida financeira do zero, com métodos práticos e simples.",
    duration: "6 módulos",
    level: "Iniciante",
    rating: "4.9",
  },
  {
    title: "Reserva de Emergência",
    description: "Como construir e manter uma reserva que te protege em momentos de imprevistos.",
    duration: "4 módulos",
    level: "Iniciante",
    rating: "4.8",
  },
  {
    title: "Introdução aos Investimentos",
    description: "Desmistificando o mundo dos investimentos para mulheres que querem começar.",
    duration: "8 módulos",
    level: "Intermediário",
    rating: "4.9",
  },
  {
    title: "Controle de Dívidas",
    description: "Estratégias comprovadas para sair das dívidas e retomar o controle financeiro.",
    duration: "5 módulos",
    level: "Iniciante",
    rating: "4.7",
  },
];

const EducationSection = () => {
  return (
    <section id="educacao" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Educação Financeira</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground">
              Aprenda no seu ritmo com{" "}
              <span className="text-gradient-gold">cursos gratuitos</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Conteúdos criados por especialistas, pensados especialmente para a realidade das mulheres brasileiras. 
              Do básico ao avançado, sem complicação.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={educationWoman}
              alt="Mulher estudando educação financeira"
              loading="lazy"
              width={700}
              height={600}
              className="w-full max-w-sm drop-shadow-xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent text-accent-foreground whitespace-nowrap">
                  {course.level}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary" />
                  {course.rating}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg" className="text-base">
            <Award className="w-5 h-5 mr-2" />
            Ver Todos os Cursos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
