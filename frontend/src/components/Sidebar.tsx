import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import logoIcon from "@/assets/logo-branco.png";

// ── Tipos ──────────────────────────────────────────────────────────────────

type NavItem = {
  icon: React.ElementType;
  label: string;
  soon: boolean;
  path?: string;
};

// ── Itens de navegação (fonte única de verdade) ────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Painel",       soon: false, path: "/dashboard" },
  { icon: GraduationCap,  label: "Cursos",        soon: true  },
  { icon: TrendingUp,     label: "Investimentos", soon: true  },
  { icon: Wallet,         label: "Renda",         soon: false, path: "/registro-renda" },
  { icon: Settings,       label: "Configurações", soon: true  },
];


// ── Componente ─────────────────────────────────────────────────────────────

const Sidebar = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarW = collapsed ? 64 : 188;

  return (
    <aside
      style={{
        width: sidebarW,
        minHeight: "100vh",
        background: "#1A1A1A",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        transition: "width 0.3s ease",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "0 0 0 16px" : "0 16px",
          marginBottom: 32,
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <img
          src={logoIcon}
          alt="logo"
          style={{ width: 32, height: 32, flexShrink: 0 }}
        />
        {!collapsed && (
          <span
            style={{
              color: "#F5F0E4",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Eleutheriss
          </span>
        )}
      </div>

      {/* ── Navegação ── */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "0 8px",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = !item.soon && location.pathname === item.path;

          return (
            <div
              key={item.label}
              onClick={() => {
                if (!item.soon && item.path) navigate(item.path);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: active ? "#C89B30" : "transparent",
                cursor: item.soon ? "default" : "pointer",
                overflow: "hidden",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!active && !item.soon)
                  e.currentTarget.style.background = "#2a2a2a";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <item.icon
                size={18}
                color={active ? "#1A1A1A" : "#9a8f7e"}
                style={{ flexShrink: 0 }}
              />
              {!collapsed && (
                <>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#1A1A1A" : "#9a8f7e",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.soon && (
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
          );
        })}
      </nav>

      {/* ── Rodapé ── */}
      <div
        style={{
          padding: "0 8px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Recolher */}
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
            style={{
              flexShrink: 0,
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          />
          {!collapsed && (
            <span style={{ fontSize: 13, color: "#9a8f7e" }}>Recolher</span>
          )}
        </div>

        {/* Sair */}
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
          onClick={() => navigate("/login")}
        >
          <LogOut size={18} color="#9a8f7e" style={{ flexShrink: 0 }} />
          {!collapsed && (
            <span style={{ fontSize: 13, color: "#9a8f7e" }}>Sair</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
