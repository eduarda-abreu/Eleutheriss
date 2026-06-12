import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, TrendingUp, Wallet, Settings,
  LogOut, ChevronLeft, Target, Plus, Trash2, Pencil, X,
  CheckCircle, AlertCircle, Calendar, DollarSign, FileText,
} from "lucide-react";
import { toast } from "sonner";
import logoIcon from "@/assets/logo-branco.png";

interface Goal {
  id: string;
  title: string;
  target_value: number;
  monthly_value: number;
  deadline: string | null;
}

interface GoalProgress {
  id: string;
  title: string;
  target_value: number;
  saved_value: number;
  percent: number;
  remaining: number;
  on_track: boolean;
  status: string;
}

const inputBase: React.CSSProperties = {
  width: "100%", height: "46px", padding: "0 14px 0 38px",
  border: "1.5px solid #D9D0BE", borderRadius: "10px",
  background: "#FDFAF5", fontSize: "14px", color: "#1a1a1a",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "13px", fontWeight: 600,
  color: "#1a1a1a", marginBottom: "6px",
};

const Metas = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // formulário
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [monthlyValue, setMonthlyValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  const sidebarW = collapsed ? 64 : 188;
  const baseUrl = import.meta.env.VITE_API_URL;

  const navItems = [
    { icon: LayoutDashboard, label: "Painel",       active: false, soon: false, action: () => navigate("/dashboard") },
    { icon: GraduationCap,  label: "Cursos",        active: false, soon: true,  action: () => {} },
    { icon: TrendingUp,     label: "Investimentos", active: false, soon: true,  action: () => {} },
    { icon: Wallet,         label: "Renda",         active: false, soon: false, action: () => navigate("/registro-renda") },
    { icon: Target,         label: "Metas",         active: true,  soon: false, action: () => {} },
    { icon: Settings,       label: "Configurações", active: false, soon: true,  action: () => {} },
  ];

  // ── carrega progresso + dispara toast (SM-46) ──
  const fetchProgress = async () => {
    try {
      const res = await fetch(`${baseUrl}/goals/progress`);
      if (!res.ok) throw new Error("Falha ao buscar progresso");
      const data: GoalProgress[] = await res.json();

      // SM-46 — notificação ao atingir 50% e 100%
      data.forEach((g) => {
        if (g.percent >= 100) {
          toast.success(`🎉 Parabéns! Você atingiu a meta "${g.title}"!`);
        } else if (g.percent >= 50) {
          toast(`💪 Você já passou da metade da meta "${g.title}"!`);
        }
      });

      setProgress(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setTargetValue("");
    setMonthlyValue("");
    setDeadline("");
    setShowForm(false);
  };

  // ── criar ou editar (SM-44 / SM-43) ──
  const handleSave = async () => {
    if (!title.trim() || !targetValue || !monthlyValue) {
      toast.error("Preencha título, valor-alvo e valor mensal.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        target_value: parseFloat(targetValue.replace(",", ".")),
        monthly_value: parseFloat(monthlyValue.replace(",", ".")),
        deadline: deadline || null,
      };

      const url = editingId ? `${baseUrl}/goals/${editingId}` : `${baseUrl}/goals/`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error("Erro ao salvar a meta.");
        return;
      }

      toast.success(editingId ? "Meta atualizada!" : "Meta criada com sucesso! 🎯");
      resetForm();
      setLoading(true);
      fetchProgress();
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  // ── carregar meta no form para editar ──
  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`${baseUrl}/goals/`);
      const goals: Goal[] = await res.json();
      const g = goals.find((x) => x.id === id);
      if (!g) return;
      setEditingId(g.id);
      setTitle(g.title);
      setTargetValue(String(g.target_value));
      setMonthlyValue(String(g.monthly_value));
      setDeadline(g.deadline || "");
      setShowForm(true);
    } catch {
      toast.error("Não foi possível carregar a meta.");
    }
  };

  // ── excluir (SM-43) ──
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return;
    try {
      const res = await fetch(`${baseUrl}/goals/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Erro ao excluir.");
        return;
      }
      toast.success("Meta excluída.");
      setLoading(true);
      fetchProgress();
    } catch {
      toast.error("Erro de conexão.");
    }
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E4", fontFamily: "'Inter', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: sidebarW, minHeight: "100vh", background: "#1A1A1A", display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "0 0 0 16px" : "0 16px", marginBottom: 32, overflow: "hidden", whiteSpace: "nowrap" }}>
          <img src={logoIcon} alt="logo" style={{ width: 32, height: 32, flexShrink: 0 }} />
          {!collapsed && <span style={{ color: "#F5F0E4", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>Eleutheriss</span>}
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 8px" }}>
          {navItems.map(({ icon: Icon, label, active, soon, action }) => (
            <div key={label} onClick={!soon ? action : undefined}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: active ? "#C89B30" : "transparent", cursor: soon ? "default" : "pointer", overflow: "hidden", whiteSpace: "nowrap", transition: "background 0.2s" }}
              onMouseEnter={(e) => { if (!active && !soon) e.currentTarget.style.background = "#2a2a2a"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={18} color={active ? "#1A1A1A" : "#9a8f7e"} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#1A1A1A" : "#9a8f7e" }}>{label}</span>
                  {soon && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 600, background: "#2a2a2a", color: "#9a8f7e", borderRadius: 4, padding: "2px 5px" }}>Em breve</span>}
                </>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer" }} onClick={() => setCollapsed((c) => !c)}>
            <ChevronLeft size={18} color="#9a8f7e" style={{ flexShrink: 0, transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
            {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Recolher</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
            onClick={() => { localStorage.removeItem("access_token"); localStorage.removeItem("user_name"); navigate("/login"); }}>
            <LogOut size={18} color="#9a8f7e" style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: 13, color: "#9a8f7e" }}>Sair</span>}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "32px 32px 48px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Minhas Metas 🎯</h1>
            <p style={{ fontSize: 13, color: "#C89B30", fontWeight: 500, marginTop: 4 }}>Defina objetivos e acompanhe seu progresso</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)", border: "none", borderRadius: 100, padding: "11px 22px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
            <Plus size={16} /> Nova Meta
          </button>
        </div>

        {/* FORM (cadastro/edição) */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "28px 32px", marginBottom: 24, maxWidth: 640 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                {editingId ? "Editar Meta" : "Nova Meta"}
              </p>
              <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", color: "#9a8f7e" }}><X size={20} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Título da meta</label>
                <div style={{ position: "relative" }}>
                  <FileText size={15} color="#9a8f7e" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Reserva de emergência" style={inputBase} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Valor-alvo</label>
                  <div style={{ position: "relative" }}>
                    <DollarSign size={15} color="#9a8f7e" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="3000" style={inputBase} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Guardar por mês</label>
                  <div style={{ position: "relative" }}>
                    <DollarSign size={15} color="#9a8f7e" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="number" value={monthlyValue} onChange={(e) => setMonthlyValue(e.target.value)} placeholder="500" style={inputBase} />
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Data alvo (opcional)</label>
                <div style={{ position: "relative" }}>
                  <Calendar size={15} color="#9a8f7e" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ ...inputBase, colorScheme: "light" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button onClick={resetForm} style={{ background: "#F5F0E4", border: "1.5px solid #D9D0BE", borderRadius: 100, padding: "11px 22px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: saving ? "#D9D0BE" : "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)", border: "none", borderRadius: 100, padding: "11px 26px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  <CheckCircle size={14} /> {saving ? "Salvando…" : "Salvar Meta"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LISTA COM PROGRESSO (SM-47 / SM-53) */}
        {loading ? (
          <p style={{ color: "#9a8f7e", fontSize: 14 }}>Carregando metas…</p>
        ) : progress.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "48px", textAlign: "center", maxWidth: 640 }}>
            <Target size={42} color="#C89B30" style={{ marginBottom: 12 }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Nenhuma meta ainda</p>
            <p style={{ fontSize: 13, color: "#9a8f7e", marginTop: 6 }}>Clique em "Nova Meta" para começar a planejar seu objetivo.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
            {progress.map((g) => {
              const barColor = g.percent >= 100 ? "#76BF62" : g.on_track ? "#C89B30" : "#8B2246";
              const statusBg = g.status === "concluída" ? "#EAF6EE" : g.on_track ? "#FBF3E0" : "#FDECEA";
              const statusColor = g.status === "concluída" ? "#2E7D32" : g.on_track ? "#C89B30" : "#8B2246";
              return (
                <div key={g.id} style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "24px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{g.title}</p>
                      <span style={{ display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: statusBg, color: statusColor }}>
                        {g.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleEdit(g.id)} style={{ background: "#F5F0E4", border: "1.5px solid #D9D0BE", borderRadius: 8, padding: 8, cursor: "pointer", color: "#1a1a1a" }}><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(g.id)} style={{ background: "#FDECEA", border: "1.5px solid #f5b8ca", borderRadius: 8, padding: 8, cursor: "pointer", color: "#8B2246" }}><Trash2 size={14} /></button>
                    </div>
                  </div>

                  {/* barra de progresso */}
                  <div style={{ background: "#F0EAD8", borderRadius: 100, height: 12, overflow: "hidden", marginBottom: 10 }}>
                    <div style={{ width: `${Math.min(g.percent, 100)}%`, height: "100%", background: barColor, borderRadius: 100, transition: "width 0.4s ease" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#1a1a1a", fontWeight: 700 }}>{g.percent}%</span>
                    <span style={{ color: "#9a8f7e" }}>
                      {fmt(g.saved_value)} de {fmt(g.target_value)} · faltam {fmt(g.remaining)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Metas;