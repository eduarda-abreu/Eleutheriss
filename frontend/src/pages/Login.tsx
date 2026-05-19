import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, RefreshCw } from "lucide-react";
import fundoBg from "@/assets/fundo.png";
import logoIcon from "@/assets/$.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_name", data.name || "Usuária");
        navigate("/dashboard");
      } else if (response.status === 401) {
        setError("E-mail ou senha incorretos. Verifique e tente novamente.");
      } else {
        setError("Erro ao fazer login. Verifique os dados e tente novamente.");
      }
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", backgroundImage: `url(${fundoBg})`,
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      backgroundColor: "#1a1a1a",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20, 18, 14, 0.45)" }} />

      <div style={{
        position: "relative", zIndex: 10, width: "100%", maxWidth: "420px",
        margin: "0 16px", background: "#F5F0E4", borderRadius: "20px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)", padding: "40px 36px 32px 36px",
      }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "28px",
            color: "#1a1a1a", margin: 0, marginBottom: "6px", lineHeight: 1.2,
          }}>
            Bem-Vinda de volta!
          </h1>
          <p style={{ fontSize: "13px", color: "#8B2246", fontWeight: 500, margin: 0 }}>
            Por favor, insira seus dados.
          </p>
        </div>

        {error && (
          <div role="alert" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#FDE8EE", border: "1px solid #f5b8ca",
            borderRadius: 10, padding: "12px 16px", marginBottom: 8,
          }}>
            <AlertCircle style={{ width: 16, height: 16, color: "#8B2246", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#8B2246" }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* E-mail */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>
              E-mail
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9a8f7e" }} />
              <input
                type="email" placeholder="seu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required
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
                type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required
                style={{
                  width: "100%", height: "46px", paddingLeft: "38px", paddingRight: "42px",
                  border: "1.5px solid #D9D0BE", borderRadius: "10px", background: "#FDFAF5",
                  fontSize: "14px", color: "#1a1a1a", outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9a8f7e", padding: 0, display: "flex" }}>
                {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Lembrar de mim / Esqueci */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#C89B30", width: 15, height: 15, cursor: "pointer" }} />
              <span style={{ fontSize: "13px", color: "#6b6253" }}>Lembrar de mim</span>
            </label>
            <Link
              to="/alterar-senha"
              style={{ fontSize: "13px", color: "#8B2246", fontWeight: 500, textDecoration: "none" }}
            >
              Esqueci a senha
            </Link>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", height: "46px",
              background: loading ? "#D9D0BE" : "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
              border: "none", borderRadius: "100px", fontSize: "15px", fontWeight: 700,
              color: "#1a1a1a", cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.2s",
            }}
          >
            {loading ? (
              <>
                <RefreshCw style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                Entrando…
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </>
            ) : "Entrar"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b6253", marginTop: "20px", marginBottom: 0 }}>
          Ainda não possui uma conta?{" "}
          <Link to="/cadastro" style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}>
            Cadastre-se
          </Link>
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "18px" }}>
          <img src={logoIcon} alt="Eleutheriss" style={{ width: 44, height: 44, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
};

export default Login;