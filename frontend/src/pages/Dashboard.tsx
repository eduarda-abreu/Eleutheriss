import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, LogOut, ChevronLeft, AlertCircle,
  GraduationCap, TrendingUp, Wallet, Settings, Menu, X,
  TrendingDown, BadgeDollarSign, Scale,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import logoIcon from "@/assets/logo-branco.png";

// ── Tipos ──────────────────────────────────────────────────────────────────

interface CategorySummary {
  category: string;
  total: number;
}

interface DashboardData {
  total_receitas: number;
  total_despesas: number;
  saldo: number;
  categorias: CategorySummary[];
}

// ── Constantes ────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "#C89B30", "#8B2246", "#76BF62", "#4A90D9",
  "#E8843D", "#9B59B6", "#1ABC9C", "#E74C3C",
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

const getCurrentMonth = () => {
  const m = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return m.charAt(0).toUpperCase() + m.slice(1);
};

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── Componente principal ──────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${baseUrl}/dashboard/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }

        if (!response.ok) throw new Error("Falha ao buscar dados da API");

        const json = await response.json();
        setData({
          total_receitas: Number(json.total_receitas) || 0,
          total_despesas: Number(json.total_despesas) || 0,
          saldo: Number(json.saldo) || 0,
          categorias: (json.categorias ?? []).map((c: CategorySummary) => ({
            ...c,
            total: Number(c.total),
          })),
        });
      } catch (err) {
        console.error(err);
        setFetchError("Não foi possível carregar os dados. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const navItems = [
    { icon: LayoutDashboard, label: "Painel",       active: true,  soon: false, action: () => {} },
    { icon: GraduationCap,  label: "Cursos",        active: false, soon: true,  action: () => {} },
    { icon: TrendingUp,     label: "Investimentos", active: false, soon: true,  action: () => {} },
    { icon: Wallet,         label: "Renda",         active: false, soon: false, action: () => navigate("/registro-renda") },
    { icon: Settings,       label: "Configurações", active: false, soon: true,  action: () => {} },
  ];

  const sidebarW = collapsed ? 64 : 188;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", gap: 16, background: "#F5F0E4" }}>
        <svg viewBox="0 0 72 72" style={{ width: 48, height: 48, animation: "spin 1s linear infinite" }}>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          <circle cx="36" cy="36" r="30" fill="none" stroke="#F0EAD8" strokeWidth="6" />
          <circle cx="36" cy="36" r="30" fill="none" stroke="#C89B30" strokeWidth="6" strokeLinecap="round" strokeDasharray="80 110" />
        </svg>
        <span style={{ color: "#9a8f7e", fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Carregando seu painel...</span>
      </div>
    );
  }

  const chartData = (data?.categorias ?? []).map((c) => ({
    name: c.category,
    value: c.total,
  }));

  const userName = localStorage.getItem("user_name") || "Usuária";

  // ── Sidebar (desktop) ───────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "0 0 0 16px" : "0 16px", marginBottom: 32, overflow: "hidden", whiteSpace: "nowrap" }}>
        <img src={logoIcon} alt="logo" style={{ width: 32, height: 32, flexShrink: 0 }} />
        {!collapsed && (
          <span style={{ color: "#F5F0E4", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>
            Eleutheriss
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 8px" }}>
        {navItems.map(({ icon: Icon, label, active, soon, action }) => (
          <div
            key={label}
            onClick={!soon ? action : undefined}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: active ? "#C89B30" : "transparent", cursor: soon ? "default" : "pointer", overflow: "hidden", whiteSpace: "nowrap", transition: "background 0.2s" }}
            onMouseEnter={(e) => { if (!active && !soon) (e.currentTarget as HTMLElement).style.background = "#2a2a2a"; }}
            onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <Icon size={18} color={active ? "#1A1A1A" : "#9a8f7e"} style={{ flexShrink: 0 }} />
            {!collapsed && (
              <>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#1A1A1A" : "#9a8f7e" }}>{label}</span>
                {soon && (
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 600, background: "#2a2a2a", color: "#9a8f7e", borderRadius: 4, padding: "2px 5px", letterSpacing: "0.04em" }}>
                    Em breve
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap" }}
          onClick={() => setCollapsed((c) => !c)}
        >
          <ChevronLeft size={18} color="#9a8f7e" style={{ flexShrink: 0, transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
          {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Recolher</span>}
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap" }}
          onClick={() => { localStorage.removeItem("access_token"); localStorage.removeItem("user_name"); navigate("/login"); }}
        >
          <LogOut size={18} color="#9a8f7e" style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Sair</span>}
        </div>
      </div>
    </>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E4", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar desktop ── */}
      {!isMobile && (
        <aside style={{ width: sidebarW, minHeight: "100vh", background: "#1A1A1A", display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <SidebarContent />
        </aside>
      )}

      {/* ── Mobile menu overlay ── */}
      {isMobile && mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <aside style={{ width: 220, background: "#1A1A1A", display: "flex", flexDirection: "column", padding: "20px 0", height: "100vh", overflow: "hidden" }}>
            <SidebarContent />
          </aside>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.4)" }} onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ── Conteúdo principal ── */}
      <main style={{ flex: 1, padding: isMobile ? "16px" : "32px", minWidth: 0 }}>

        {/* Header mobile */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <Menu size={22} color="#1A1A1A" />
            </button>
            <img src={logoIcon} alt="logo" style={{ width: 28, height: 28, filter: "invert(1)" }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>Eleutheriss</span>
            {mobileMenuOpen && (
              <button onClick={() => setMobileMenuOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} color="#1A1A1A" />
              </button>
            )}
          </div>
        )}

        {/* Saudação */}
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 20 : 26, margin: 0 }}>
            {getGreeting()}, {userName} ✨
          </h1>
          <p style={{ color: "#C89B30", fontSize: 13, margin: "4px 0 0" }}>
            Resumo financeiro de {getCurrentMonth()}
          </p>
        </header>

        {/* Erro */}
        {fetchError && (
          <div role="alert" style={{ display: "flex", alignItems: "center", gap: 10, background: "#FDE8EE", border: "1px solid #f5b8ca", borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
            <AlertCircle size={16} color="#8B2246" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#8B2246" }}>{fetchError}</span>
          </div>
        )}

        {/* ── Cards KPI ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}>
          <KpiCard
            icon={<BadgeDollarSign size={20} color="#76BF62" />}
            label="Total Receitas"
            value={fmt(data?.total_receitas ?? 0)}
            accent="#76BF62"
            sub="↑ Entradas do mês"
          />
          <KpiCard
            icon={<TrendingDown size={20} color="#8B2246" />}
            label="Total Despesas"
            value={fmt(data?.total_despesas ?? 0)}
            accent="#8B2246"
            sub="↓ Saídas do mês"
          />
          <KpiCard
            icon={<Scale size={20} color="#C89B30" />}
            label="Saldo do Mês"
            value={fmt(data?.saldo ?? 0)}
            accent={(data?.saldo ?? 0) >= 0 ? "#C89B30" : "#8B2246"}
            sub={(data?.saldo ?? 0) >= 0 ? "Saldo positivo" : "Saldo negativo"}
          />
        </div>

        {/* ── Gráfico de categorias ── */}
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", padding: "24px" }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, margin: 0 }}>
              Gastos por Categoria
            </h2>
            <p style={{ color: "#9a8f7e", fontSize: 12, margin: "4px 0 0" }}>
              Distribuição dos gastos do mês corrente
            </p>
          </div>

          {chartData.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 12 }}>
              <TrendingDown size={40} color="#F0EAD8" />
              <p style={{ color: "#9a8f7e", fontSize: 14, textAlign: "center", margin: 0 }}>
                Nenhum gasto registrado este mês.<br />
                <span
                  onClick={() => navigate("/envio-comprovante")}
                  style={{ color: "#C89B30", cursor: "pointer", textDecoration: "underline" }}
                >
                  Registrar um comprovante
                </span>
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 24,
              alignItems: "center",
            }}>
              {/* Pizza */}
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [fmt(value), "Total"]}
                    contentStyle={{ borderRadius: 8, fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legenda manual */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {chartData.map((item, i) => {
                  const pct = data!.total_despesas > 0
                    ? ((item.value / data!.total_despesas) * 100).toFixed(1)
                    : "0";
                  return (
                    <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: 12, color: "#9a8f7e", marginLeft: 8, whiteSpace: "nowrap" }}>
                            {pct}%
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#9a8f7e" }}>{fmt(item.value)}</div>
                        {/* barra de progresso */}
                        <div style={{ height: 4, background: "#F0EAD8", borderRadius: 2, marginTop: 4 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length], borderRadius: 2, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botão nova entrada */}
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => navigate("/envio-comprovante")}
              style={{ background: "#C89B30", border: "none", padding: "10px 20px", borderRadius: 100, fontWeight: 700, cursor: "pointer", fontSize: 13, color: "#1A1A1A" }}
            >
              + Nova Entrada
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// ── KpiCard ───────────────────────────────────────────────────────────────

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  sub: string;
}

const KpiCard = ({ icon, label, value, accent, sub }: KpiCardProps) => (
  <div style={{ background: "#fff", padding: "20px", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ background: `${accent}18`, borderRadius: 8, padding: 6, display: "flex" }}>{icon}</div>
      <span style={{ fontSize: 12, color: "#9a8f7e", fontWeight: 500 }}>{label}</span>
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, color: accent, fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
      {value}
    </div>
    <div style={{ fontSize: 11, color: "#9a8f7e" }}>{sub}</div>
  </div>
);

export default Dashboard;
