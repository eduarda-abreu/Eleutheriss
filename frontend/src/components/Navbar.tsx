import { useState } from "react";
import logo from "@/assets/$.png";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Início", href: "#inicio" },
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Importância", href: "#importancia" },
    { label: "Educação", href: "#educacao" },
    { label: "Dados", href: "#dados" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-display text-2xl font-bold text-gradient-gold">
          <img src={logo} alt="Logo Eleutheriss" className="h-8 w-8 object-contain" />
          Eleutheriss
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" className="mt-2 w-full" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
