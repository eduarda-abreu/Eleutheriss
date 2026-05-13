import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, LogOut, ChevronLeft
} from "lucide-react";
// Certifique-se de que o caminho do logo está correto no seu projeto
import logoIcon from "@/assets/logo-branco.png";

// Tipos
interface Transaction {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "Gasto" | "Economia";
}

interface SummaryData {
  totalGastos: number;
  totalEconomizado: number;
  saldoMes: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  up: boolean | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado agrupado para os resumos vindos da API
  const [summary, setSummary] = useState<SummaryData>({
    totalGastos: 0,
    totalEconomizado: 0,
    saldoMes: 0
  });

  // Carrega os dados reais da usuária
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // CORREÇÃO: Usando a variável de ambiente para funcionar na Vercel e no Local
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/dashboard/resumo`);

        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API");
        }

        const data = await response.json();

        // Atualizando os estados corretamente com base no payload da API
        setSummary({
          totalGastos: data.total_gastos || 0,
          totalEconomizado: data.total_renda || 0,
          saldoMes: data.saldo || 0
        });
        
        setTransactions(data.movimentacoes || []);

      } catch (error) {
        console.error("Erro ao buscar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const sidebarW = collapsed ? 64 : 188;

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Carregando dashboard...</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E4", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── SIDEBAR ── */}
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
        
        {/* CORREÇÃO: Agrupamento do Rodapé da Sidebar (Recolher e Sair) com tags arrumadas */}
        <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          
          {/* Botão Recolher */}
          <div 
            onClick={() => setCollapsed(!collapsed)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", cursor: "pointer", borderRadius: 10 }}
          >
            <ChevronLeft 
              size={18} color="#9a8f7e" 
              style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
            />
            {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Recolher</span>}
          </div>

          {/* Botão Sair */}
          <div 
            onClick={() => navigate("/login")}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", cursor: "pointer", borderRadius: 10 }}
          >
            <LogOut size={18} color="#9a8f7e" />
            {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Sair</span>}
          </div>

        </div>
      </aside>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main style={{ flex: 1, padding: "32px" }}>
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Bom dia, Usuária ✨</h1>
          <p style={{ color: "#C89B30", fontSize: 13 }}>Seu progresso financeiro atualizado</p>
        </header>

        {/* CARDS DE KPI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Gastos" value={`R$ ${summary.totalGastos.toFixed(2)}`} color="#8B2246" up={false} />
          <StatCard label="Total Economia" value={`R$ ${summary.totalEconomizado.toFixed(2)}`} color="#76BF62" up={true} />
          <StatCard label="Saldo Livre" value={`R$ ${summary.saldoMes.toFixed(2)}`} color="#C89B30" up={summary.saldoMes >= 0} />
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

// Componente tipado corretamente
const StatCard = ({ label, value, color, up }: StatCardProps) => (
  <div style={{ background: "#fff", padding: "20px", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
    <div style={{ fontSize: 12, color: "#9a8f7e" }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: "'Playfair Display', serif", margin: "8px 0" }}>{value}</div>
    {up !== null && <div style={{ fontSize: 11, color: up ? "#76BF62" : "#8B2246" }}>{up ? "↑ Em alta" : "↓ Saída"}</div>}
  </div>
);

export default Dashboard;