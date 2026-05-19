import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, TrendingUp, Wallet, Settings,
  LogOut, ChevronLeft, Camera, ImageIcon, CheckCircle, AlertCircle,
  RotateCcw, Send, Tag, DollarSign,
} from "lucide-react";
import logoIcon from "@/assets/logo-branco.png";
import { toast } from "sonner";

type ProcessStatus = "idle" | "preview" | "processing" | "result" | "error";

interface ResultadoComprovante {
  valor: string;
  categoria_sugerida: string;
  tipo_sugerido: string;
}

const CATEGORIAS = [
  "Alimentação", "Transporte", "Educação", "Saúde",
  "Lazer", "Moradia", "Vestuário", "Outros",
];

const inputBase: React.CSSProperties = {
  width: "100%", height: "46px", padding: "0 14px",
  border: "1.5px solid #D9D0BE", borderRadius: "10px",
  background: "#FDFAF5", fontSize: "14px", color: "#1a1a1a",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "13px", fontWeight: 600,
  color: "#1a1a1a", marginBottom: "6px",
};

const EnvioComprovante = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ResultadoComprovante | null>(null);
  const [valorCorrigido, setValorCorrigido] = useState("");
  const [categoriaCorrigida, setCategoriaCorrigida] = useState("");
  const [tipoCorrigido, setTipoCorrigido] = useState("expense"); // ← novo
  const [erroMsg, setErroMsg] = useState("");

  const sidebarW = collapsed ? 64 : 188;

  const navItems = [
    { icon: LayoutDashboard, label: "Painel", active: false, soon: false, action: () => navigate("/dashboard") },
    { icon: GraduationCap, label: "Cursos", active: false, soon: true, action: () => {} },
    { icon: TrendingUp, label: "Investimentos", active: false, soon: true, action: () => {} },
    { icon: Wallet, label: "Renda", active: false, soon: true, action: () => {} },
    { icon: Settings, label: "Configurações", active: false, soon: true, action: () => {} },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErroMsg("Selecione um arquivo de imagem válido (JPG, PNG, HEIC…).");
      setStatus("error");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultado(null);
    setValorCorrigido("");
    setCategoriaCorrigida("");
    setTipoCorrigido("expense");
    setErroMsg("");
    setStatus("preview");
  };

  const handleEnviar = async () => {
    if (!selectedFile) return;
    setStatus("processing");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/transactions/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const erro = await response.json();
        setErroMsg(erro.detail || "Erro ao processar o comprovante.");
        setStatus("error");
        return;
      }

      const data = await response.json();

      const resultadoApi: ResultadoComprovante = {
        valor: `R$ ${data.transaction.value}`,
        categoria_sugerida: data.transaction.category,
        tipo_sugerido: data.transaction.type || "expense",
      };

      setResultado(resultadoApi);
      setValorCorrigido(resultadoApi.valor);
      setCategoriaCorrigida(resultadoApi.categoria_sugerida);
      setTipoCorrigido(resultadoApi.tipo_sugerido); // ← seta o tipo da IA
      setStatus("result");

    } catch {
      setErroMsg("Erro de conexão. Verifique se o servidor está rodando.");
      setStatus("error");
    }
  };

  const handleConfirmar = async () => {
    try {
      // Corrige o valor — remove R$, não remove ponto decimal
      const valorNumerico = valorCorrigido
        .replace("R$", "")
        .replace(",", ".")
        .trim();

      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: parseFloat(valorNumerico),
          category: categoriaCorrigida,
          description: selectedFile?.name || "",
          type: tipoCorrigido, // ← usa o tipo corrigido
        }),
      });

      if (!response.ok) {
        const erro = await response.json();
        setErroMsg(erro.detail || "Erro ao salvar.");
        setStatus("error");
        return;
      }

      toast.success("Comprovante salvo com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch {
      setErroMsg("Erro de conexão. Verifique se o servidor está rodando.");
      setStatus("error");
    }
  };

  const handleNovo = () => {
    setStatus("idle");
    setPreviewUrl(null);
    setSelectedFile(null);
    setResultado(null);
    setValorCorrigido("");
    setCategoriaCorrigida("");
    setTipoCorrigido("expense");
    setErroMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E4", fontFamily: "'Inter', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarW, minHeight: "100vh", background: "#1A1A1A",
        display: "flex", flexDirection: "column", padding: "20px 0",
        transition: "width 0.3s ease", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
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
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Enviar Comprovante 📄</h1>
            <p style={{ fontSize: 13, color: "#C89B30", fontWeight: 500, marginTop: 4 }}>Fotografe ou selecione o comprovante do seu gasto</p>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#C89B30", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#1a1a1a", fontSize: 15 }}>U</div>
        </div>

        <div style={{ maxWidth: 640, background: "#fff", borderRadius: 18, boxShadow: "0 2px 24px rgba(0,0,0,0.07)", overflow: "hidden" }}>

          {/* IDLE */}
          {status === "idle" && (
            <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#F5F0E4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={42} color="#C89B30" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Nenhum comprovante selecionado</p>
                <p style={{ fontSize: 13, color: "#9a8f7e", marginTop: 8 }}>Use a câmera do seu dispositivo ou escolha uma imagem da galeria</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFileChange} />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => { if (fileInputRef.current) { fileInputRef.current.setAttribute("capture", "environment"); fileInputRef.current.click(); } }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)", border: "none", borderRadius: 100, padding: "12px 24px", fontSize: 14, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
                  <Camera size={16} /> Usar Câmera
                </button>
                <button onClick={() => { if (fileInputRef.current) { fileInputRef.current.removeAttribute("capture"); fileInputRef.current.click(); } }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F0E4", border: "1.5px solid #D9D0BE", borderRadius: 100, padding: "12px 24px", fontSize: 14, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
                  <ImageIcon size={16} /> Escolher da Galeria
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW */}
          {status === "preview" && previewUrl && (
            <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Confirmar imagem</p>
                <p style={{ fontSize: 13, color: "#9a8f7e", marginTop: 4 }}>Verifique se o comprovante está legível antes de enviar</p>
              </div>
              <div style={{ borderRadius: 14, overflow: "hidden", border: "2px solid #F0EAD8", background: "#FDFAF5", maxHeight: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: 340, objectFit: "contain", display: "block" }} />
              </div>
              <p style={{ fontSize: 12, color: "#9a8f7e", margin: 0, textAlign: "center" }}>📎 {selectedFile?.name}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={handleNovo} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F0E4", border: "1.5px solid #D9D0BE", borderRadius: 100, padding: "12px 22px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
                  <RotateCcw size={15} /> Trocar imagem
                </button>
                <button onClick={handleEnviar} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)", border: "none", borderRadius: 100, padding: "12px 28px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
                  <Send size={15} /> Processar comprovante
                </button>
              </div>
            </div>
          )}

          {/* PROCESSING */}
          {status === "processing" && (
            <div style={{ padding: "64px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
              <svg viewBox="0 0 72 72" style={{ width: 72, height: 72, animation: "spin 1s linear infinite" }}>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                <circle cx="36" cy="36" r="30" fill="none" stroke="#F0EAD8" strokeWidth="6" />
                <circle cx="36" cy="36" r="30" fill="none" stroke="#C89B30" strokeWidth="6" strokeLinecap="round" strokeDasharray="80 110" />
              </svg>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Analisando comprovante…</p>
                <p style={{ fontSize: 13, color: "#9a8f7e", marginTop: 8 }}>Aguarde, isso leva menos de 5 segundos</p>
              </div>
              <div style={{ width: "100%", maxWidth: 320, background: "#F0EAD8", borderRadius: 100, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #C89B30, #E8BE45)", borderRadius: 100, animation: "progress 2s ease-out forwards" }} />
                <style>{`@keyframes progress { from { width: 0%; } to { width: 90%; } }`}</style>
              </div>
            </div>
          )}

          {/* RESULT */}
          {status === "result" && resultado && (
            <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle size={26} color="#76BF62" />
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Comprovante processado!</p>
                  <p style={{ fontSize: 13, color: "#9a8f7e", margin: 0, marginTop: 2 }}>Confira os dados e corrija se necessário</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {previewUrl && (
                  <div style={{ width: 110, height: 110, flexShrink: 0, borderRadius: 12, overflow: "hidden", border: "2px solid #F0EAD8" }}>
                    <img src={previewUrl} alt="comprovante" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 200, background: "#F5F0E4", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9a8f7e", letterSpacing: "0.06em", textTransform: "uppercase" }}>Dados extraídos</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <DollarSign size={14} color="#C89B30" />
                    <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>Valor: <strong>{resultado.valor}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Tag size={14} color="#C89B30" />
                    <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>Categoria: <strong>{resultado.categoria_sugerida}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>
                      Tipo: <strong style={{ color: resultado.tipo_sugerido === "income" ? "#76BF62" : "#8B2246" }}>
                        {resultado.tipo_sugerido === "income" ? "💰 Receita" : "💸 Gasto"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: "#F0EAD8" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Corrija se necessário</p>

                {/* Valor */}
                <div>
                  <label style={labelStyle}>Valor</label>
                  <div style={{ position: "relative" }}>
                    <DollarSign size={15} color="#9a8f7e" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" value={valorCorrigido} onChange={(e) => setValorCorrigido(e.target.value)} placeholder="R$ 0,00"
                      style={{ ...inputBase, paddingLeft: 36 }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")} />
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label style={labelStyle}>Categoria</label>
                  <div style={{ position: "relative" }}>
                    <Tag size={15} color="#9a8f7e" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <select value={categoriaCorrigida} onChange={(e) => setCategoriaCorrigida(e.target.value)}
                      style={{ ...inputBase, paddingLeft: 36, appearance: "none", cursor: "pointer" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#D9D0BE")}>
                      {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tipo — campo novo */}
                <div>
                  <label style={labelStyle}>Tipo</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setTipoCorrigido("expense")} style={{
                      flex: 1, height: "46px",
                      background: tipoCorrigido === "expense" ? "#8B2246" : "#F5F0E4",
                      border: `1.5px solid ${tipoCorrigido === "expense" ? "#8B2246" : "#D9D0BE"}`,
                      borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                      color: tipoCorrigido === "expense" ? "#fff" : "#1a1a1a",
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      💸 Gasto
                    </button>
                    <button onClick={() => setTipoCorrigido("income")} style={{
                      flex: 1, height: "46px",
                      background: tipoCorrigido === "income" ? "#76BF62" : "#F5F0E4",
                      border: `1.5px solid ${tipoCorrigido === "income" ? "#76BF62" : "#D9D0BE"}`,
                      borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                      color: tipoCorrigido === "income" ? "#fff" : "#1a1a1a",
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      💰 Receita
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button onClick={handleNovo} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F0E4", border: "1.5px solid #D9D0BE", borderRadius: 100, padding: "11px 20px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
                  <RotateCcw size={14} /> Novo comprovante
                </button>
                <button onClick={handleConfirmar} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)", border: "none", borderRadius: 100, padding: "11px 26px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
                  <CheckCircle size={14} /> Confirmar e salvar
                </button>
              </div>
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <AlertCircle size={48} color="#8B2246" />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Algo deu errado</p>
                <p style={{ fontSize: 13, color: "#8B2246", marginTop: 6 }}>{erroMsg || "Tente novamente."}</p>
              </div>
              <button onClick={handleNovo} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)", border: "none", borderRadius: 100, padding: "12px 28px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "inherit" }}>
                <RotateCcw size={14} /> Tentar novamente
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default EnvioComprovante;