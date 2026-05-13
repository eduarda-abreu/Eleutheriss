import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingDown,
  Lightbulb,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Sidebar from "@/components/Sidebar";

// ── Estilos reutilizáveis ──────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%",
  height: "46px",
  padding: "0 14px 0 38px",
  border: "1.5px solid #D9D0BE",
  borderRadius: "10px",
  background: "#FDFAF5",
  fontSize: "14px",
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: "6px",
};

const errorStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#8B2246",
  marginTop: "4px",
};

// ── Tipos ──────────────────────────────────────────────────────────────────

interface FormErrors {
  value?:       string;
  description?: string;
  date?:        string;
}

interface Income {
  id:           number;
  value:        number;
  description:  string;
  date:         string;
  is_recurrent: boolean;
}

// ── Componente ─────────────────────────────────────────────────────────────

const RegistroRenda = () => {
  const navigate = useNavigate();

  const [value,          setValue]         = useState("");
  const [description,    setDescription]   = useState("");
  const [date,           setDate]          = useState(new Date().toISOString().split("T")[0]);
  const [isRecurrent,    setIsRecurrent]   = useState(false);
  const [errors,         setErrors]        = useState<FormErrors>({});
  const [loading,        setLoading]       = useState(false);
  const [apiError,       setApiError]      = useState("");
  const [recentIncomes,  setRecentIncomes] = useState<Income[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ── Buscar rendas recentes ──────────────────────────────────────────────

  useEffect(() => {
    const fetchRecentIncomes = async () => {
      setLoadingHistory(true);
      try {
        const baseUrl  = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/rendas/`);
        if (response.ok) {
          const data = await response.json();
          const sorted = [...data]
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 3);
          setRecentIncomes(sorted);
        }
      } catch {
        // Silencioso — histórico é opcional
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchRecentIncomes();
  }, []);

  // ── Dicas ───────────────────────────────────────────────────────────────

  const tips = [
    { icon: Lightbulb, text: "Mantenha um registro consistente para melhor controle financeiro." },
    { icon: Clock,     text: "Rendas recorrentes ajudam a projetar seu fluxo de caixa." },
    { icon: TrendingDown, text: "Combine com suas despesas para ter uma visão completa." },
  ];

  // ── Validação ───────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const numericValue = parseFloat(value.replace(",", "."));

    if (!value.trim()) {
      newErrors.value = "Valor é obrigatório.";
    } else if (isNaN(numericValue) || numericValue <= 0) {
      newErrors.value = "O valor deve ser maior que zero.";
    }

    if (!description.trim()) {
      newErrors.description = "Descrição é obrigatória.";
    } else if (description.length > 255) {
      newErrors.description = "Descrição deve ter no máximo 255 caracteres.";
    }

    if (!date) newErrors.date = "Data é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Envio ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        value:        parseFloat(value.replace(",", ".")),
        description:  description.trim(),
        date,
        is_recurrent: isRecurrent,
      };

      const baseUrl  = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/rendas/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        setApiError(erro.detail || "Erro ao registrar renda.");
        return;
      }

      toast.success("Renda registrada com sucesso! 🎉");

      const newIncome: Income = {
        id:           Date.now(),
        value:        parseFloat(value.replace(",", ".")),
        description:  description.trim(),
        date,
        is_recurrent: isRecurrent,
      };
      setRecentIncomes((prev) => [newIncome, ...prev.slice(0, 2)]);

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch {
      setApiError("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers de foco ─────────────────────────────────────────────────────

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "#C89B30");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = errors.value ? "#8B2246" : "#D9D0BE");

  // ── Formatadores ────────────────────────────────────────────────────────

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F5F0E4",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Sidebar reutilizável ── */}
      <Sidebar />

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: "32px 32px 48px", overflowY: "auto" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              Registrar Renda 💰
            </h1>
            <p style={{ fontSize: 13, color: "#C89B30", fontWeight: 500, marginTop: 4 }}>
              Adicione uma nova entrada de renda manualmente
            </p>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#C89B30",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#1a1a1a",
              fontSize: 15,
            }}
          >
            U
          </div>
        </div>

        {/* Grid: formulário + info lateral */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 24,
            alignItems: "start",
          }}
        >

          {/* ── Card formulário ── */}
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
              padding: "36px 40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DollarSign size={22} color="#1a1a1a" />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    margin: 0,
                  }}
                >
                  Nova Renda
                </p>
                <p style={{ fontSize: 12, color: "#9a8f7e", margin: "2px 0 0" }}>
                  Preencha os dados abaixo
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Valor */}
              <div>
                <label style={labelStyle}>
                  Valor <span style={{ color: "#8B2246" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <DollarSign
                    size={15}
                    color="#9a8f7e"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0,00"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setErrors((err) => ({ ...err, value: undefined }));
                    }}
                    style={{
                      ...inputBase,
                      borderColor: errors.value ? "#8B2246" : "#D9D0BE",
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                {errors.value && <p style={errorStyle}>{errors.value}</p>}
              </div>

              {/* Descrição */}
              <div>
                <label style={labelStyle}>
                  Descrição <span style={{ color: "#8B2246" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <FileText
                    size={15}
                    color="#9a8f7e"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Ex: Salário, Freelance, Investimentos…"
                    value={description}
                    maxLength={255}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((err) => ({ ...err, description: undefined }));
                    }}
                    style={{
                      ...inputBase,
                      borderColor: errors.description ? "#8B2246" : "#D9D0BE",
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                {errors.description && (
                  <p style={errorStyle}>{errors.description}</p>
                )}
              </div>

              {/* Data */}
              <div>
                <label style={labelStyle}>
                  Data <span style={{ color: "#8B2246" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Calendar
                    size={15}
                    color="#9a8f7e"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setErrors((err) => ({ ...err, date: undefined }));
                    }}
                    style={{
                      ...inputBase,
                      borderColor: errors.date ? "#8B2246" : "#D9D0BE",
                      colorScheme: "light",
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                {errors.date && <p style={errorStyle}>{errors.date}</p>}
              </div>

              <div style={{ height: 1, background: "#F0EAD8", margin: "4px 0" }} />

              {/* Toggle recorrência */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#F5F0E4",
                  borderRadius: 12,
                  padding: "14px 18px",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                    Renda recorrente mensal
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9a8f7e" }}>
                    Marque se essa renda se repete todo mês
                  </p>
                </div>
                <Switch
                  checked={isRecurrent}
                  onCheckedChange={setIsRecurrent}
                  style={
                    { "--primary": isRecurrent ? "#C89B30" : undefined } as React.CSSProperties
                  }
                />
              </div>

              {/* Erro da API */}
              {apiError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#FDE8EE",
                    border: "1px solid #f5b8ca",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <AlertCircle size={16} color="#8B2246" style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 13, color: "#8B2246" }}>{apiError}</p>
                </div>
              )}

              {/* Ações */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                  marginTop: 4,
                }}
              >
                <button
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F5F0E4",
                    border: "1.5px solid #D9D0BE",
                    borderRadius: 100,
                    padding: "11px 22px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: loading
                      ? "#D9D0BE"
                      : "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
                    border: "none",
                    borderRadius: 100,
                    padding: "11px 28px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "background 0.2s, transform 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {loading ? (
                    <>
                      <RefreshCw
                        size={14}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Registrando…
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      Registrar Renda
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Sidebar informativa ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Últimas rendas */}
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    margin: 0,
                  }}
                >
                  Últimas Rendas
                </h3>
                <button
                  onClick={() => navigate("/dashboard")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "none",
                    border: "none",
                    fontSize: 12,
                    color: "#C89B30",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Ver todas <ArrowRight size={12} />
                </button>
              </div>

              {loadingHistory ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 0",
                  }}
                >
                  <RefreshCw
                    size={18}
                    color="#9a8f7e"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                </div>
              ) : recentIncomes.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {recentIncomes.map((income) => (
                    <div
                      key={income.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        background: "#FDFAF5",
                        borderRadius: 12,
                        border: "1px solid #F0EAD8",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background:
                              "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TrendingDown size={16} color="#1a1a1a" />
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#1a1a1a",
                            }}
                          >
                            {income.description}
                          </p>
                          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9a8f7e" }}>
                            {formatDate(income.date)}
                            {income.is_recurrent && (
                              <span
                                style={{
                                  marginLeft: 6,
                                  color: "#C89B30",
                                  fontWeight: 600,
                                }}
                              >
                                • Recorrente
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32" }}
                      >
                        {formatCurrency(income.value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: 13, color: "#9a8f7e", margin: 0 }}>
                    Nenhuma renda registrada ainda.
                  </p>
                  <p style={{ fontSize: 11, color: "#9a8f7e", margin: "4px 0 0" }}>
                    Registre sua primeira renda acima!
                  </p>
                </div>
              )}
            </div>

            {/* Dicas */}
            <div
              style={{
                background: "linear-gradient(135deg, #1A1A1A 0%, #2a2a2a 100%)",
                borderRadius: 18,
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#F5F0E4",
                  margin: "0 0 16px",
                }}
              >
                💡 Dicas do Dia
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                  >
                    <tip.icon
                      size={16}
                      color="#C89B30"
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#B8B0A0",
                        lineHeight: 1.5,
                      }}
                    >
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo rápido */}
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 16px",
                }}
              >
                📊 Resumo do Mês
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#9a8f7e" }}>Total de rendas</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>
                    {recentIncomes.length}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#9a8f7e" }}>Valor total</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2E7D32" }}>
                    {formatCurrency(
                      recentIncomes.reduce((acc, inc) => acc + inc.value, 0)
                    )}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#9a8f7e" }}>Recorrentes</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#C89B30" }}>
                    {recentIncomes.filter((i) => i.is_recurrent).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RegistroRenda;
