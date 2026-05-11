import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, TrendingUp, Wallet, Settings,
  LogOut, ChevronLeft, Plus, ArrowUpRight, ArrowDownRight,
  BookOpen, Target, Clock, ArrowRight
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

  // Carrega os dados reais da usuária
  useEffect(() => {
    const saved = localStorage.getItem("user_transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Cálculos Dinâmicos
  const totalGastos = transactions
    .filter(t => t.type === "Gasto")
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const totalEconomizado = transactions
    .filter(t => t.type === "Economia")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoMes = totalEconomizado - totalGastos;

  const sidebarW = collapsed ? 64 : 188;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E4", fontFamily: "'Inter', sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarW, background: "#1A1A1A", display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s ease", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 32 }}>
          <img src={logoIcon} style={{ width: 32 }} alt="logo" />
          {!collapsed && <span style={{ color: "#F5F0E4", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Eleutheriss</span>}
        </div>
        <nav style={{ flex: 1, padding: "0 8px" }}>
          <div style={{ background: "#C89B30", padding: "10px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <LayoutDashboard size={18} color="#1A1A1A" />
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 700 }}>Painel</span>}
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
          <StatCard label="Total Gastos" value={`R$ ${totalGastos.toFixed(2)}`} color="#8B2246" up={false} />
          <StatCard label="Total Economia" value={`R$ ${totalEconomizado.toFixed(2)}`} color="#76BF62" up={true} />
          <StatCard label="Saldo Livre" value={`R$ ${saldoMes.toFixed(2)}`} color="#C89B30" up={saldoMes >= 0} />
          <StatCard label="Meta de Abril" value="65%" color="#1a1a1a" up={null} />
        </div>

        {/* TABELA DE MOVIMENTAÇÕES */}
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>Movimentações Recentes</span>
            <button 
              onClick={() => navigate("/envio-comprovante")}
              style={{ background: "#C89B30", border: "none", padding: "8px 16px", borderRadius: 100, fontWeight: 700, cursor: "pointer" }}
            >
              + Nova Entrada
            </button>
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

const StatCard = ({ label, value, color, up }: any) => (
  <div style={{ background: "#fff", padding: "20px", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
    <div style={{ fontSize: 12, color: "#9a8f7e" }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: "'Playfair Display', serif", margin: "8px 0" }}>{value}</div>
    {up !== null && <div style={{ fontSize: 11, color: up ? "#76BF62" : "#8B2246" }}>{up ? "↑ Em alta" : "↓ Saída"}</div>}
  </div>
);

export default Dashboard;