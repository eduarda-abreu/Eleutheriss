import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Target,
  Clock,
  ArrowRight,
  Camera,
} from "lucide-react";
import logoIcon from "@/assets/logo-branco.png";

// Tipos
interface Transaction {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "Gasto" | "Economia";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const navItems = [
    { icon: LayoutDashboard, label: "Painel",       active: true,  soon: false, action: () => {} },
    { icon: GraduationCap,  label: "Cursos",        active: false, soon: true,  action: () => {} },
    { icon: TrendingUp,     label: "Investimentos", active: false, soon: true,  action: () => {} },
    { icon: Wallet,         label: "Renda",         active: false, soon: false, action: () => navigate("/registro-renda") },
    { icon: Settings,       label: "Configurações", active: false, soon: true,  action: () => {} },
  ];

  const sidebarW = collapsed ? 64 : 188;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E4", fontFamily: "'Inter', sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarW, background: "#1A1A1A", display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s ease", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 32 }}>
          <img src={logoIcon} style={{ width: 32 }} alt="logo" />
          {!collapsed && <span style={{ color: "#F5F0E4", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Eleutheriss</span>}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 8px" }}>
          {navItems.map(({ icon: Icon, label, active, soon, action }) => (
            <div
              key={label}
              onClick={!soon ? action : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: active ? "#C89B30" : "transparent",
                cursor: soon ? "default" : "pointer",
                overflow: "hidden",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!active && !soon) (e.currentTarget.style.background = "#2a2a2a");
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget.style.background = "transparent");
              }}
            >
              <Icon size={18} color={active ? "#1A1A1A" : "#9a8f7e"} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#1A1A1A" : "#9a8f7e" }}>
                    {label}
                  </span>
                  {soon && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 9,
                        fontWeight: 600,
                        background: "#2a2a2a",
                        color: "#9a8f7e",
                        borderRadius: 4,
                        padding: "2px 5px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Em breve
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              cursor: "pointer",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            onClick={() => setCollapsed((c) => !c)}
          >
            <ChevronLeft
              size={18}
              color="#9a8f7e"
              style={{ flexShrink: 0, transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
            />
            {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Recolher</span>}
          </div>
        </nav>
        <div style={{ padding: "0 8px" }} onClick={() => navigate("/login")}>
           <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", cursor: "pointer" }}>
            <LogOut size={18} color="#9a8f7e" />
            {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Sair</span>}
           </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ flex: 1, padding: "32px" }}>
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Bom dia, Usuária ✨</h1>
          <p style={{ color: "#C89B30", fontSize: 13 }}>Seu progresso financeiro atualizado</p>
        </header>

        {/* CARDS DE KPI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Gastos",      value: "R$ 515",   delta: "+12% vs mês passado", up: false, icon: "🛒", color: "#8B2246"  },
            { label: "Total Economizado", value: "R$ 1.300", delta: "+8% vs mês passado",  up: true,  icon: "💰", color: "#76BF62"  },
            { label: "Saldo do Mês",      value: "R$ 785",   delta: "Positivo!",            up: true,  icon: "$",  color: "#C89B30"  },
            { label: "Meta Mensal",       value: "65%",       delta: "R$ 1.300 / R$ 2.000", up: null,  icon: "🎯", color: "#C89B30"  },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 12, color: "#9a8f7e", fontWeight: 500 }}>{card.label}</span>
                {card.up === true && <ArrowUpRight size={14} color="#76BF62" />}
                {card.up === false && <ArrowDownRight size={14} color="#8B2246" />}
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: card.color,
                  margin: "6px 0 4px",
                }}
              >
                {card.value}
              </div>
              <div style={{ fontSize: 11, color: "#9a8f7e" }}>{card.delta}</div>
            </div>
          ))}
        </div>

        {/* ── Ações Rápidas de Renda ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Registrar Renda Manual */}
          <div
            onClick={() => navigate("/registro-renda")}
            style={{
              background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
              borderRadius: 14,
              padding: "20px 24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 2px 12px rgba(200,155,48,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(200,155,48,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(200,155,48,0.25)";
            }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(26,26,26,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <Plus size={22} color="#1a1a1a" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Registrar Renda</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(26,26,26,0.65)" }}>
                Adicione uma entrada manualmente
              </p>
            </div>
            <ArrowRight size={18} color="#1a1a1a" style={{ marginLeft: "auto", opacity: 0.5 }} />
          </div>

          {/* Enviar Comprovante (foto) */}
          <div
            onClick={() => navigate("/envio-comprovante")}
            style={{
              background: "#fff",
              border: "1.5px solid #E0D9C8",
              borderRadius: 14,
              padding: "20px 24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
            }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#F5F0E4",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <Camera size={20} color="#C89B30" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Enviar Comprovante</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9a8f7e" }}>
                Fotografe ou anexe um arquivo
              </p>
            </div>
            <ArrowRight size={18} color="#9a8f7e" style={{ marginLeft: "auto" }} />
          </div>
        </div>

        {/* ── Middle row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>

          {/* Meta de Economia */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Meta de Economia</span>
              <Target size={16} color="#C89B30" />
            </div>
            {/* progress bar */}
            <div style={{ background: "#F0EAD8", borderRadius: 100, height: 8, marginBottom: 8 }}>
              <div style={{ width: "65%", background: "linear-gradient(90deg,#C89B30,#E8BE45)", borderRadius: 100, height: "100%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9a8f7e", marginBottom: 10 }}>
              <span>R$ 1.300</span>
              <span>R$ 2.000</span>
            </div>
            <p style={{ fontSize: 12, color: "#C89B30", fontWeight: 600, margin: 0 }}>Faltam R$ 700 para sua meta</p>
          </div>

          {/* Último Curso */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Último Curso Assistido</span>
              <BookOpen size={16} color="#C89B30" />
            </div>
            <div style={{ background: "#F5F0E4", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>Finanças para Mulheres</p>
              <p style={{ margin: "2px 0 10px", fontSize: 11, color: "#9a8f7e" }}>Módulo 3: Investimentos Básicos</p>
              {/* progress */}
              <div style={{ background: "#E0D9C8", borderRadius: 100, height: 6, marginBottom: 8 }}>
                <div style={{ width: "65%", background: "linear-gradient(90deg,#8B2246,#C0397A)", borderRadius: 100, height: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9a8f7e" }}>
                <span>65% concluído</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Clock size={10} /> 2h restantes
                </span>
              </div>
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#C89B30",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 0,
              }}
            >
              Continuar assistindo <ArrowRight size={13} />
            </button>
          </div>

          {/* Gastos por Categoria */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Gastos por Categoria</span>
            </div>
            {[
              { label: "Alimentação", value: "R$ 320", pct: 62 },
              { label: "Educação", value: "R$ 150", pct: 29 },
              { label: "Transporte", value: "R$ 45", pct: 9 },
            ].map((cat) => (
              <div key={cat.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#1a1a1a", fontWeight: 500 }}>{cat.label}</span>
                  <span style={{ color: "#9a8f7e" }}>{cat.value}</span>
                </div>
                <div style={{ background: "#F0EAD8", borderRadius: 100, height: 6 }}>
                  <div
                    style={{
                      width: `${cat.pct}%`,
                      background: categoryColors[cat.label] || "#C89B30",
                      borderRadius: 100,
                      height: "100%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Movimentações ── */}
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {/* header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px 16px",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>Movimentações</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => navigate("/registro-renda")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#F5F0E4",
                  color: "#1a1a1a",
                  border: "1.5px solid #D9D0BE",
                  borderRadius: 100,
                  padding: "8px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Plus size={14} /> Registrar Renda
              </button>
              <button
                onClick={() => navigate("/envio-comprovante")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#C89B30",
                  color: "#1a1a1a",
                  border: "none",
                  borderRadius: 100,
                  padding: "8px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Camera size={14} /> Enviar Comprovante
              </button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#1A1A1A", color: "#C89B30" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left" }}>Data</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Descrição</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Valor</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#9a8f7e" }}>Nenhuma transação encontrada.</td></tr>
              ) : (
                transactions.map((tx, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F0EAD8" }}>
                    <td style={{ padding: "12px" }}>{tx.date}</td>
                    <td style={{ padding: "12px" }}>{tx.description}</td>
                    <td style={{ padding: "12px", fontWeight: 700, color: tx.amount < 0 ? "#8B2246" : "#76BF62" }}>
                      R$ {Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: "12px" }}>{tx.type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
