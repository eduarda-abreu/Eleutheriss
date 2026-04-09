import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import fundoBg from "@/assets/fundo.png";
import logoIcon from "@/assets/$.png";

const Cadastro = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:8000/auth/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: name,
                email: email,
                senha: password,
                confirmar_senha: confirmPassword,
            }),
        });

        const data = await response.json();

        if (response.status === 201) {
            // Se o cadastro der certo, da essa 
            alert("Conta criada com sucesso! Faça login para continuar.");
            // redireciona para o login
            window.location.href = "/login";

        } else if (response.status === 409) {
            // Erro de email cadastrado, envia esse alerta
            alert("Este e-mail já está cadastrado!");

        } else {
            // Outro erro
            alert("Erro ao criar conta. Verifique os dados e tente novamente.");
        }

    } catch (error) {
        alert("Erro de conexão. Verifique se o servidor está rodando.");
    }
};

  const inputBase: React.CSSProperties = {
    width: "100%",
    height: "46px",
    paddingLeft: "38px",
    paddingRight: "14px",
    border: "1.5px solid #D9D0BE",
    borderRadius: "10px",
    background: "#FDFAF5",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const inputWithEye: React.CSSProperties = { ...inputBase, paddingRight: "42px" };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    width: 16,
    height: 16,
    color: "#9a8f7e",
  };

  const eyeBtn: React.CSSProperties = {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9a8f7e",
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#C89B30";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#D9D0BE";
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
      {/* Overlay escuro */}
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
          width: "60%",
          maxWidth: "460px",
          margin: "30px 16px",
          background: "#F5F0E4",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          padding: "20px 36px 28px 36px",
        }}
      >
        {/* Cabeçalho */}
        <div style={{ marginBottom: "24px" }}>
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
            Criar nova conta
          </h1>
          <p style={{ fontSize: "13px", color: "#8B2246", fontWeight: 500, margin: 0 }}>
            Por favor, insira seus dados.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Nome completo */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>
              Nome completo
            </label>
            <div style={{ position: "relative" }}>
              <User style={iconStyle} />
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>
              E-mail
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={iconStyle} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputWithEye}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Confirmar senha */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>
              Confirmar senha
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={iconStyle} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputWithEye}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeBtn}>
                {showConfirmPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Termos */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              style={{ accentColor: "#C89B30", width: 15, height: 15, marginTop: 2, cursor: "pointer", flexShrink: 0 }}
            />
            <label htmlFor="terms" style={{ fontSize: "12px", color: "#6b6253", cursor: "pointer", lineHeight: 1.5, margin: 0 }}>
              Concordo com os{" "}
              <a href="#" style={{ color: "#8B2246", fontWeight: 600, textDecoration: "none" }}>Termos de Uso</a>
              {" "}e{" "}
              <a href="#" style={{ color: "#8B2246", fontWeight: 600, textDecoration: "none" }}>Política de Privacidade</a>
            </label>
          </div>

          {/* Botão */}
          <button
            type="submit"
            style={{
              width: "100%",
              height: "46px",
              background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
              border: "none",
              borderRadius: "100px",
              fontSize: "15px",
              fontWeight: 700,
              color: "#1a1a1a",
              cursor: "pointer",
              letterSpacing: "0.02em",
              fontFamily: "inherit",
              marginTop: "2px",
            }}
          >
            Criar Conta
          </button>
        </form>

        {/* Link login */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b6253", marginTop: "18px", marginBottom: 0 }}>
          Já possui uma conta?{" "}
          <Link to="/login" style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}>
            Entrar
          </Link>
        </p>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          <img src={logoIcon} alt="Eleutheriss" style={{ width: 44, height: 44, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
