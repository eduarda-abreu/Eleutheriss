import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Send,
  Tag,
  DollarSign,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

// ── Tipos ──────────────────────────────────────────────────────────────────

type ProcessStatus = "idle" | "preview" | "processing" | "result" | "error";

interface ResultadoComprovante {
  valor: string;
  categoria_sugerida: string;
}

// ── Constantes ─────────────────────────────────────────────────────────────

const CATEGORIAS = [
  "Alimentação",
  "Transporte",
  "Educação",
  "Saúde",
  "Lazer",
  "Moradia",
  "Vestuário",
  "Outros",
];

const inputBase: React.CSSProperties = {
  width: "100%",
  height: "46px",
  padding: "0 14px",
  border: "1.5px solid #D9D0BE",
  borderRadius: "10px",
  background: "#FDFAF5",
  fontSize: "14px",
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: "6px",
};

// ── Componente ─────────────────────────────────────────────────────────────

const EnvioComprovante = () => {
  const navigate    = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status,             setStatus]             = useState<ProcessStatus>("idle");
  const [previewUrl,         setPreviewUrl]         = useState<string | null>(null);
  const [selectedFile,       setSelectedFile]       = useState<File | null>(null);
  const [resultado,          setResultado]          = useState<ResultadoComprovante | null>(null);
  const [valorCorrigido,     setValorCorrigido]     = useState("");
  const [categoriaCorrigida, setCategoriaCorrigida] = useState("");
  const [erroMsg,            setErroMsg]            = useState("");

  // ── Seleção de arquivo ──────────────────────────────────────────────────

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
    setErroMsg("");
    setStatus("preview");
  };

  // ── Envio para a API ────────────────────────────────────────────────────

  const handleEnviar = async () => {
    if (!selectedFile) return;
    setStatus("processing");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const baseUrl  = import.meta.env.VITE_API_URL;
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
        valor:              `R$ ${data.transaction.value}`,
        categoria_sugerida: data.transaction.category,
      };

      setResultado(resultadoApi);
      setValorCorrigido(resultadoApi.valor);
      setCategoriaCorrigida(resultadoApi.categoria_sugerida);
      setStatus("result");
    } catch {
      setErroMsg("Erro de conexão. Verifique se o servidor está rodando.");
      setStatus("error");
    }
  };

  // ── Confirmação e salvamento ────────────────────────────────────────────

  const handleConfirmar = async () => {
    try {
      const valorNumerico = valorCorrigido
        .replace("R$", "")
        .replace(".", "")
        .replace(",", ".")
        .trim();

      const baseUrl  = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value:       parseFloat(valorNumerico),
          category:    categoriaCorrigida,
          description: selectedFile?.name || "",
          type:        "expense",
        }),
      });

      if (!response.ok) {
        const erro = await response.json();
        setErroMsg(erro.detail || "Erro ao salvar.");
        setStatus("error");
        return;
      }

      alert("Comprovante salvo com sucesso!");
      navigate("/dashboard");
    } catch {
      setErroMsg("Erro de conexão. Verifique se o servidor está rodando.");
      setStatus("error");
    }
  };

  // ── Reiniciar ───────────────────────────────────────────────────────────

  const handleNovo = () => {
    setStatus("idle");
    setPreviewUrl(null);
    setSelectedFile(null);
    setResultado(null);
    setValorCorrigido("");
    setCategoriaCorrigida("");
    setErroMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
              Enviar Comprovante 📄
            </h1>
            <p style={{ fontSize: 13, color: "#C89B30", fontWeight: 500, marginTop: 4 }}>
              Fotografe ou selecione o comprovante do seu gasto
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

        {/* Card central */}
        <div
          style={{
            maxWidth: 640,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {/* ── idle ── */}
          {status === "idle" && (
            <div
              style={{
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "#F5F0E4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera size={42} color="#C89B30" />
              </div>

              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    margin: 0,
                  }}
                >
                  Nenhum comprovante selecionado
                </p>
                <p style={{ fontSize: 13, color: "#9a8f7e", marginTop: 8 }}>
                  Use a câmera do seu dispositivo ou escolha uma imagem da galeria
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute("capture", "environment");
                      fileInputRef.current.click();
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
                    border: "none",
                    borderRadius: 100,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Camera size={16} /> Usar Câmera
                </button>

                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.removeAttribute("capture");
                      fileInputRef.current.click();
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F5F0E4",
                    border: "1.5px solid #D9D0BE",
                    borderRadius: 100,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <ImageIcon size={16} /> Escolher da Galeria
                </button>
              </div>
            </div>
          )}

          {/* ── preview ── */}
          {status === "preview" && previewUrl && (
            <div
              style={{
                padding: "32px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
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
                  Confirmar imagem
                </p>
                <p style={{ fontSize: 13, color: "#9a8f7e", marginTop: 4 }}>
                  Verifique se o comprovante está legível antes de enviar
                </p>
              </div>

              <div
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "2px solid #F0EAD8",
                  background: "#FDFAF5",
                  maxHeight: 340,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview do comprovante"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 340,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              <p style={{ fontSize: 12, color: "#9a8f7e", margin: 0, textAlign: "center" }}>
                📎 {selectedFile?.name}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={handleNovo}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F5F0E4",
                    border: "1.5px solid #D9D0BE",
                    borderRadius: 100,
                    padding: "12px 22px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <RotateCcw size={15} /> Trocar imagem
                </button>

                <button
                  onClick={handleEnviar}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
                    border: "none",
                    borderRadius: 100,
                    padding: "12px 28px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Send size={15} /> Processar comprovante
                </button>
              </div>
            </div>
          )}

          {/* ── processing ── */}
          {status === "processing" && (
            <div
              style={{
                padding: "64px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
              }}
            >
              <div style={{ position: "relative", width: 72, height: 72 }}>
                <svg
                  viewBox="0 0 72 72"
                  style={{ width: 72, height: 72, animation: "spin 1s linear infinite" }}
                >
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#F0EAD8" strokeWidth="6" />
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none" stroke="#C89B30" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="80 110"
                  />
                </svg>
              </div>

              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    margin: 0,
                  }}
                >
                  Analisando comprovante…
                </p>
                <p style={{ fontSize: 13, color: "#9a8f7e", marginTop: 8 }}>
                  Aguarde, isso leva menos de 5 segundos
                </p>
              </div>

              <div
                style={{
                  width: "100%",
                  maxWidth: 320,
                  background: "#F0EAD8",
                  borderRadius: 100,
                  height: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #C89B30, #E8BE45)",
                    borderRadius: 100,
                    animation: "progress 2s ease-out forwards",
                  }}
                />
                <style>{`@keyframes progress { from { width: 0%; } to { width: 90%; } }`}</style>
              </div>
            </div>
          )}

          {/* ── result ── */}
          {status === "result" && resultado && (
            <div
              style={{
                padding: "32px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle size={26} color="#76BF62" />
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
                    Comprovante processado!
                  </p>
                  <p style={{ fontSize: 13, color: "#9a8f7e", margin: "2px 0 0" }}>
                    Confira os dados e corrija se necessário
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {previewUrl && (
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      flexShrink: 0,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "2px solid #F0EAD8",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="comprovante"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}

                <div
                  style={{
                    flex: 1,
                    minWidth: 200,
                    background: "#F5F0E4",
                    borderRadius: 12,
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#9a8f7e",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Dados extraídos
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <DollarSign size={14} color="#C89B30" />
                    <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>
                      Valor: <strong>{resultado.valor}</strong>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Tag size={14} color="#C89B30" />
                    <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>
                      Categoria sugerida: <strong>{resultado.categoria_sugerida}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: "#F0EAD8" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
                  Corrija se necessário
                </p>

                <div>
                  <label style={labelStyle}>Valor</label>
                  <div style={{ position: "relative" }}>
                    <DollarSign
                      size={15}
                      color="#9a8f7e"
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <input
                      type="text"
                      value={valorCorrigido}
                      onChange={(e) => setValorCorrigido(e.target.value)}
                      placeholder="R$ 0,00"
                      style={{ ...inputBase, paddingLeft: 36 }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = "#D9D0BE")}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Categoria</label>
                  <div style={{ position: "relative" }}>
                    <Tag
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
                    <select
                      value={categoriaCorrigida}
                      onChange={(e) => setCategoriaCorrigida(e.target.value)}
                      style={{ ...inputBase, paddingLeft: 36, appearance: "none", cursor: "pointer" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B30")}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = "#D9D0BE")}
                    >
                      {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={handleNovo}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F5F0E4",
                    border: "1.5px solid #D9D0BE",
                    borderRadius: 100,
                    padding: "11px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <RotateCcw size={14} /> Novo comprovante
                </button>

                <button
                  onClick={handleConfirmar}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
                    border: "none",
                    borderRadius: 100,
                    padding: "11px 26px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <CheckCircle size={14} /> Confirmar e salvar
                </button>
              </div>
            </div>
          )}

          {/* ── error ── */}
          {status === "error" && (
            <div
              style={{
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <AlertCircle size={48} color="#8B2246" />
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    margin: 0,
                  }}
                >
                  Algo deu errado
                </p>
                <p style={{ fontSize: 13, color: "#8B2246", marginTop: 6 }}>
                  {erroMsg || "Tente novamente."}
                </p>
              </div>
              <button
                onClick={handleNovo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #C89B30 0%, #E8BE45 100%)",
                  border: "none",
                  borderRadius: 100,
                  padding: "12px 28px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
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
