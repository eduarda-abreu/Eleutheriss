import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import fundoBg from "@/assets/fundo.png";
import logoIcon from "@/assets/$.png";

const AlterarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const inputBase: React.CSSProperties = {
    width: "100%", height: "46px", paddingLeft: "38px", paddingRight: "14px",
    border: "1.5px solid #D9D0BE", borderRadius: "10px", background: "#FDFAF5",
    fontSize: "14px", color: "#1a1a1a", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setSucesso(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setErro(data.detail || "Erro ao alterar senha.");
      }
    } catch {
      setErro("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundImage: `url(${fundoBg})`, backgroundSize: "cover", backgroundPosition: "center",
      backgroundColor: "#1a1a1a", position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20,18,14,0.45)" }} />

      <div style={{
        position: "relative", zIndex: 10, width: "100%", maxWidth: "420px",
        margin: "0 16px", background: "#F5F0E4", borderRadius: "20px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)", padding: "40px 36px 32px 36px",
      }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "28px", color: "#1a1a1a", margin: 0, marginBottom: "6px" }}>
            Alterar senha
          </h1>
          <p style={{ fontSize: "13px", color: "#8B2246", fontWeight: 500, margin: 0 }}>
            Informe seu email e a nova senha.
          </p>
        </div>

        {sucesso ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: "15px", color: "#76BF62", fontWeight: 700 }}>✅ Senha alterada com sucesso!</p>
            <p style={{ fontSize: "13px", color: "#9a8f7e", marginTop: 8 }}>Redirecionando para o login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>E-mail</label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9a8f7e" }} />
                <input type="email" placeholder="seu@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>Nova senha</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9a8f7e" }} />
                <input type="password" placeholder="••••••••" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} required style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>Confirmar nova senha</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9a8f7e" }} />
                <input type="password" placeholder="••••••••" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")} />
              </div>
            </div>

            {erro && <p style={{ fontSize: "13px", color: "#8B2246", fontWeight: 500, margin: 0 }}>{erro}</p>}

            <button type="submit" disabled={loading} style={{
              width: "100%", height: "46px",
              background: loading ? "#D9D0BE" : "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
              border: "none", borderRadius: "100px", fontSize: "15px", fontWeight: 700,
              color: "#1a1a1a", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}>
              {loading ? "Alterando..." : "Alterar Senha"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b6253", marginTop: "20px", marginBottom: 0 }}>
          Lembrou a senha?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer" }}>
            Entrar
          </span>
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "18px" }}>
          <img src={logoIcon} alt="Eleutheriss" style={{ width: 44, height: 44, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
};

export default AlterarSenha;