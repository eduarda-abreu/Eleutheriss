import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import fundoBg from "@/assets/fundo.png";
import logoIcon from "@/assets/$.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${fundoBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Overlay escuro para não competir com o card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(20, 18, 14, 0.45)",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "420px",
          margin: "0 16px",
          background: "#F5F0E4",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          padding: "40px 36px 32px 36px",
        }}
      >
        {/* Cabeçalho */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "28px",
              color: "#1a1a1a",
              margin: 0,
              marginBottom: "6px",
              lineHeight: 1.2,
            }}
          >
            Bem-Vinda de volta!
          </h1>
          <p style={{ fontSize: "13px", color: "#8B2246", fontWeight: 500, margin: 0 }}>
            Bem-vinda de volta! Por favor, insira seus dados.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* E-mail */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>
              E-mail
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9a8f7e" }} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", height: "46px", paddingLeft: "38px", paddingRight: "14px",
                  border: "1.5px solid #D9D0BE", borderRadius: "10px", background: "#FDFAF5",
                  fontSize: "14px", color: "#1a1a1a", outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9a8f7e" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%", height: "46px", paddingLeft: "38px", paddingRight: "42px",
                  border: "1.5px solid #D9D0BE", borderRadius: "10px", background: "#FDFAF5",
                  fontSize: "14px", color: "#1a1a1a", outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9a8f7e", padding: 0, display: "flex" }}
              >
                {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Re-lembre / Esqueci */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#C89B30", width: 15, height: 15, cursor: "pointer" }}
              />
              <span style={{ fontSize: "13px", color: "#6b6253" }}>Re-lembre</span>
            </label>
            <a href="#" style={{ fontSize: "13px", color: "#8B2246", fontWeight: 500, textDecoration: "none" }}>
              Esqueci a senha
            </a>
          </div>

          {/* Botão */}
          <button
            type="submit"
            style={{
              width: "100%", height: "46px",
              background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
              border: "none", borderRadius: "100px",
              fontSize: "15px", fontWeight: 700, color: "#1a1a1a",
              cursor: "pointer", letterSpacing: "0.02em",
              fontFamily: "inherit",
            }}
          >
            Entrar
          </button>
        </form>

        {/* Link cadastro */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b6253", marginTop: "20px", marginBottom: 0 }}>
          Ainda não possui uma conta?{" "}
          <Link to="/cadastro" style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}>
            Cadastre-se
          </Link>
        </p>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "18px" }}>
          <img src={logoIcon} alt="Eleutheriss" style={{ width: 44, height: 44, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
};

export default Login;
