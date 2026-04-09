import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-gradient-gold">Eleutheriss</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma gratuita de gestão e educação financeira feita para mulheres.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Fluxo de Caixa</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Scanner de Comprovantes</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Relatórios</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Educação</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Cursos</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Comunidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Conta</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Entrar</Link></li>
              <li><Link to="/cadastro" className="hover:text-foreground transition-colors">Criar Conta</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Eleutheriss. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> para mulheres
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
