import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  useGetRutaDocenteQuery,
  useGuardarValidacionRutaMutation,
} from "../../redux/services/rutasAprendizaje/rutasAprendizajeApi";
import { Loader } from "@components";
import CreateResourceModal from "./components/CreateResourceModal";
import PublishConfirmModal from "./components/PublishConfirmModal";

// Icons
import {
  HiArrowLeft,
  HiOutlineCheck,
  HiPlus,
  HiOutlineTrash,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlinePencilAlt,
  HiSparkles,
} from "react-icons/hi";
import { BiTimeFive, BiSolidFlagCheckered } from "react-icons/bi";
import {
  FaGraduationCap,
  FaBookOpen,
  FaVideo,
  FaPuzzlePiece,
  FaMagic,
} from "react-icons/fa";

// Visual configurations by resource type
const typeConfig = {
  video: {
    label: "Video",
    icon: FaVideo,
    bgLight: "bg-rose-50",
    textCol: "text-rose-600",
    borderCol: "border-rose-200",
    accentBar: "bg-rose-500",
  },
  libro: {
    label: "Libro / Lectura",
    icon: FaBookOpen,
    bgLight: "bg-amber-50",
    textCol: "text-amber-600",
    borderCol: "border-amber-200",
    accentBar: "bg-amber-500",
  },
  curso: {
    label: "Curso Completo",
    icon: FaGraduationCap,
    bgLight: "bg-indigo-50",
    textCol: "text-indigo-600",
    borderCol: "border-indigo-200",
    accentBar: "bg-indigo-500",
  },
  practica: {
    label: "Taller Práctico",
    icon: FaPuzzlePiece,
    bgLight: "bg-emerald-50",
    textCol: "text-emerald-600",
    borderCol: "border-emerald-200",
    accentBar: "bg-emerald-500",
  },
};

const formatDuration = (mins) => {
  const mVal = Number(mins) || 0;
  const h = Math.floor(mVal / 60);
  const m = mVal % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const RutaBuilderPage = () => {
  const { idDocente } = useParams();
  const [searchParams] = useSearchParams();
  const periodoParam = searchParams.get("periodo");
  const navigate = useNavigate();

  // RTK Query
  const { data, isLoading, isError, error } = useGetRutaDocenteQuery({
    idDocente,
    periodo: periodoParam,
  });
  const [guardarValidacion, { isLoading: isSaving }] =
    useGuardarValidacionRutaMutation();

  // Local builder states
  const [pathTitle, setPathTitle] = useState("Ruta: Innovación Pedagógica con IA");
  const [viewMode, setViewMode] = useState("flow"); // 'flow' | 'timeline' (LEGO)
  const [catalog, setCatalog] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedResourceId, setDraggedResourceId] = useState(null);
  const [isDropActive, setIsDropActive] = useState(false);

  // Modals & Feedback
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync initial backend data
  useEffect(() => {
    if (data?.respuesta) {
      const resp = data.respuesta;
      const initialCatalog = resp.catalogo_recursos || [];
      const initialPath = resp.learning_path || [];

      setCatalog(initialCatalog);
      setLearningPath(initialPath);

      if (resp.info_docente?.nombre) {
        setPathTitle(`Ruta Formativa: ${resp.info_docente.nombre}`);
      }
    }
  }, [data]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Drag & Drop / Builder Actions
  const handleAddResource = (resourceId) => {
    const res = catalog.find((r) => r.id === resourceId);
    if (!res) return;

    const newNode = {
      instanceId: `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      resourceId: res.id,
      requirement: "Obligatorio",
      note: "",
      orden: learningPath.length + 1,
      titulo: res.title,
      formato: res.type,
      duracionMin: Number(res.durationMin) || 30,
      descripcion: res.description || "",
    };

    setLearningPath((prev) => [...prev, newNode]);
    showToast(`"${res.title}" añadido a la ruta`);
  };

  const handleQuickAddSuggested = () => {
    const nextSuggested =
      catalog.find((res) => !learningPath.some((n) => n.resourceId === res.id)) ||
      catalog[0];
    if (nextSuggested) {
      handleAddResource(nextSuggested.id);
    }
  };

  const handleMoveNode = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= learningPath.length) return;
    const updated = [...learningPath];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLearningPath(updated);
  };

  const handleRemoveNode = (instanceId) => {
    setLearningPath((prev) => prev.filter((n) => n.instanceId !== instanceId));
    showToast("Bloque retirado de la ruta");
  };

  const handleClearPath = () => {
    setLearningPath([]);
    showToast("Lienzo vaciado");
  };

  const handleLoadDemo = () => {
    if (catalog.length === 0) return;
    const demoItems = catalog.slice(0, 4).map((res, idx) => ({
      instanceId: `demo-node-${idx + 1}-${Date.now()}`,
      resourceId: res.id,
      requirement: idx === 3 ? "Entregable" : idx === 1 ? "Opcional" : "Obligatorio",
      note:
        idx === 0
          ? "Conceptos iniciales recomendados."
          : idx === 3
          ? "Entrega práctica evaluable."
          : "",
      orden: idx + 1,
      titulo: res.title,
      formato: res.type,
      duracionMin: Number(res.durationMin) || 30,
      descripcion: res.description || "",
    }));
    setLearningPath(demoItems);
    showToast("Demo cargada en el lienzo");
  };

  const handleUpdateRequirement = (instanceId, requirement) => {
    setLearningPath((prev) =>
      prev.map((n) => (n.instanceId === instanceId ? { ...n, requirement } : n))
    );
  };

  const handleUpdateNote = (instanceId, note) => {
    setLearningPath((prev) =>
      prev.map((n) => (n.instanceId === instanceId ? { ...n, note } : n))
    );
  };

  const handleCreateNewResource = (newResource) => {
    setCatalog((prev) => [newResource, ...prev]);
    const newNode = {
      instanceId: `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      resourceId: newResource.id,
      requirement: "Obligatorio",
      note: "Recurso ad-hoc curado por el experto.",
      orden: learningPath.length + 1,
      titulo: newResource.title,
      formato: newResource.type,
      duracionMin: Number(newResource.durationMin) || 45,
      descripcion: newResource.description,
    };
    setLearningPath((prev) => [...prev, newNode]);
    setIsCreateModalOpen(false);
    showToast(`Nuevo recurso "${newResource.title}" creado e insertado`);
  };

  const handleConfirmSave = async ({ observaciones, esBorrador }) => {
    setSaveErrorMessage(null);
    try {
      await guardarValidacion({
        idDocente,
        payload: {
          periodo: periodoParam || data?.respuesta?.periodo,
          titulo_ruta: pathTitle.trim() || "Ruta de Innovación Pedagógica",
          learning_path: learningPath,
          catalogo_recursos: catalog,
          observaciones: observaciones?.trim() || "",
          es_borrador: Boolean(esBorrador),
        },
      }).unwrap();

      setIsPublishModalOpen(false);
      navigate("/rutas-aprendizaje");
    } catch (err) {
      const msg =
        err?.data?.error ||
        err?.error ||
        "Error al guardar la validación de la ruta. Verifique la conexión con el servidor.";
      setSaveErrorMessage(msg);
    }
  };

  // Metrics calculation
  const totalMinutos = learningPath.reduce((acc, node) => {
    const res = catalog.find((r) => r.id === node.resourceId);
    const mins = Number(node.duracionMin || res?.durationMin) || 30;
    return acc + mins;
  }, 0);

  const docenteNombre = data?.respuesta?.info_docente?.nombre || "Docente";
  const facultadNombre = data?.respuesta?.facultad || "Universidad de Cuenca";
  const periodoActual = periodoParam || data?.respuesta?.periodo || "Actual";

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 shadow-md text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
          ⚠️
        </div>
        <h2 className="text-base font-bold text-slate-800">
          No se pudo cargar la ruta
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          {error?.data?.error || "Error al consultar la ruta del docente."}
        </p>
        <button
          onClick={() => navigate("/rutas-aprendizaje")}
          className="px-4 py-2 bg-primary_color_1 text-white text-xs font-semibold rounded-xl"
        >
          Volver a Pendientes
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden text-slate-800 relative">
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animated-connection {
          stroke-dasharray: 6, 6;
          animation: dash 1s linear infinite;
        }
      `}</style>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* ─── BARRA SUPERIOR (HEADER) ─── */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/rutas-aprendizaje")}
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition"
            title="Volver a pendientes"
          >
            <HiArrowLeft className="text-xl" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pathTitle}
                onChange={(e) => setPathTitle(e.target.value)}
                className="font-bold text-base md:text-lg text-slate-900 bg-transparent hover:bg-slate-50 px-2 py-0.5 rounded focus:ring-2 focus:ring-primary_color_1 outline-none max-w-sm md:max-w-md truncate"
                placeholder="Título de la ruta..."
              />
              <HiOutlinePencilAlt className="text-slate-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-500">
              Docente:{" "}
              <strong className="text-slate-700">{docenteNombre}</strong> •{" "}
              {facultadNombre} • Período {periodoActual}
            </p>
          </div>
        </div>

        {/* Conmutador de Vista */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("flow")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "flow"
                ? "bg-white text-primary_color_1 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🔗</span> Nodos Conectados
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === "timeline"
                ? "bg-white text-primary_color_1 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🧱</span> Bloques LEGO
          </button>
        </div>

        {/* Métricas y Acciones de la Ruta */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Bloques</span>
              <span className="font-bold text-slate-800">
                {learningPath.length}{" "}
                {learningPath.length === 1 ? "recurso" : "recursos"}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px]">Dedicación</span>
              <span className="font-bold text-slate-800">
                {formatDuration(totalMinutos)}
              </span>
            </div>
          </div>

          <button
            onClick={handleLoadDemo}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
            title="Cargar bloques de demostración"
          >
            <FaMagic className="text-indigo-500 text-xs" /> Demo
          </button>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            disabled={learningPath.length === 0 || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
          >
            <HiOutlineCheck className="text-base" /> Validar y Guardar
          </button>
        </div>
      </header>

      {/* ─── CUERPO PRINCIPAL (2 COLUMNAS) ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL IZQUIERDO: CATÁLOGO DE RECURSOS */}
        <aside className="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-xs uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <HiSparkles className="text-amber-500 text-sm" /> Recursos
                Recomendados
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <HiPlus className="text-xs" /> Nuevo Nodo
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-2.5">
              Arrastra un bloque al lienzo o haz clic en <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-[10px] font-mono">+</kbd> para unirlo.
            </p>

            {/* Buscador de recursos */}
            <input
              type="text"
              placeholder="Buscar video, libro, curso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary_color_1 focus:bg-white outline-none mb-2 text-slate-800"
            />

            {/* Chips de filtro */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "Todos" },
                { id: "video", label: "Videos" },
                { id: "libro", label: "Libros" },
                { id: "curso", label: "Cursos" },
                { id: "practica", label: "Prácticas" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                    filterType === t.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Recursos Arrastrables */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {catalog
              .filter((item) => {
                const matchesType =
                  filterType === "all" || item.type === filterType;
                const matchesSearch =
                  item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  item.author?.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesType && matchesSearch;
              })
              .map((res) => {
                const cfg = typeConfig[res.type] || typeConfig.curso;
                const Icon = cfg.icon;
                const isAdded = learningPath.some(
                  (n) => n.resourceId === res.id
                );

                return (
                  <div
                    key={res.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedResourceId(res.id);
                      e.dataTransfer.setData("text/plain", res.id);
                    }}
                    onDragEnd={() => setDraggedResourceId(null)}
                    className={`bg-white rounded-2xl p-3.5 border transition-all cursor-grab active:cursor-grabbing hover:shadow-md ${
                      isAdded
                        ? "border-slate-200 bg-slate-50/70 opacity-80"
                        : "border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${cfg.bgLight} ${cfg.textCol}`}
                      >
                        <Icon className="text-xs" /> {cfg.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isAdded ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✓ En ruta
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">
                            {res.match || "Recomendado"}
                          </span>
                        )}
                        <button
                          onClick={() => handleAddResource(res.id)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-600 transition"
                          title="Añadir a la ruta"
                        >
                          <HiPlus className="text-xs" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs text-slate-800 leading-snug mb-1">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                      {res.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="truncate max-w-[160px] font-medium">
                        {res.author}
                      </span>
                      <span className="font-semibold text-slate-600 flex items-center gap-1 shrink-0">
                        <BiTimeFive /> {formatDuration(res.durationMin)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </aside>

        {/* PANEL DERECHO: LIENZO (CANVAS) DE CONSTRUCCIÓN */}
        <main
          style={{
            backgroundColor: "#f8fafc",
            backgroundImage: "radial-gradient(#cbd5e1 1.25px, transparent 1.25px)",
            backgroundSize: "24px 24px",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDropActive(true);
          }}
          onDragLeave={() => setIsDropActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDropActive(false);
            const resId =
              e.dataTransfer.getData("text/plain") || draggedResourceId;
            if (resId) handleAddResource(resId);
          }}
          className="flex-1 relative overflow-y-auto flex flex-col items-center p-6 md:p-8"
        >
          {/* Barra informativa de ayuda */}
          <div className="w-full max-w-2xl mb-4 bg-white/95 backdrop-blur border border-slate-200/90 rounded-2xl p-3.5 shadow-sm flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                🖐️
              </span>
              <span>
                <strong>Lienzo Interactivo:</strong> Arrastra recursos aquí para
                encadenarlos, cambia su orden con las flechas o define si son
                obligatorios.
              </span>
            </div>
            <button
              onClick={handleClearPath}
              className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-medium transition shrink-0 ml-2"
            >
              Limpiar lienzo
            </button>
          </div>

          {/* Nodo de Inicio */}
          <div className="flex flex-col items-center">
            <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-sm">
              <BiSolidFlagCheckered className="text-amber-400 text-sm" /> Inicio
              de la Ruta Docente
            </div>
            <div className="w-0.5 h-6 bg-slate-300" />
          </div>

          {/* Bloques de la Ruta */}
          <div className="w-full max-w-2xl flex flex-col items-center space-y-1">
            {learningPath.length === 0 ? (
              <div className="p-8 text-center bg-white/90 rounded-2xl border border-dashed border-slate-300 max-w-md my-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-700">
                  El lienzo se encuentra vacío
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Arrastra recursos desde el catálogo izquierdo o presiona el
                  botón &quot;+&quot; para agregar bloques a la ruta.
                </p>
              </div>
            ) : (
              learningPath.map((node, index) => {
                const res = catalog.find((r) => r.id === node.resourceId);
                const formato = node.formato || res?.type || "curso";
                const cfg = typeConfig[formato] || typeConfig.curso;
                const Icon = cfg.icon;
                const isLego = viewMode === "timeline";

                const nodeTitle = node.titulo || res?.title || `Paso ${index + 1}`;
                const nodeDesc = node.descripcion || res?.description || "";
                const nodeDuration = node.duracionMin || res?.durationMin || 30;

                return (
                  <div
                    key={node.instanceId}
                    className="w-full flex flex-col items-center"
                  >
                    <div
                      className={`w-full bg-white rounded-2xl border transition-all relative overflow-hidden ${
                        isLego
                          ? "border-2 border-slate-300 shadow-sm"
                          : "border-slate-200/90 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {/* Barra lateral de color */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-2 ${cfg.accentBar}`}
                      />

                      {/* Muesca LEGO superior si está en modo Bloques */}
                      {isLego && (
                        <div className="mx-auto w-12 h-2 bg-slate-200 rounded-b-md" />
                      )}

                      <div className="p-4 pl-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${cfg.bgLight} ${cfg.textCol}`}
                            >
                              <Icon className="text-xs" /> {cfg.label}
                            </span>

                            {/* Selector de Requisito */}
                            <select
                              value={node.requirement || "Obligatorio"}
                              onChange={(e) =>
                                handleUpdateRequirement(
                                  node.instanceId,
                                  e.target.value
                                )
                              }
                              className="text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-lg px-2 py-1 border-0 focus:ring-2 focus:ring-primary_color_1 cursor-pointer"
                            >
                              <option value="Obligatorio">📌 Obligatorio</option>
                              <option value="Opcional">
                                💡 Opcional / Refuerzo
                              </option>
                              <option value="Entregable">
                                🏆 Evaluación / Reto
                              </option>
                            </select>
                          </div>

                          {/* Controles para mover y borrar */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveNode(index, -1)}
                              disabled={index === 0}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-20 transition"
                              title="Subir posición"
                            >
                              <HiOutlineChevronUp className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleMoveNode(index, 1)}
                              disabled={index === learningPath.length - 1}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-20 transition"
                              title="Bajar posición"
                            >
                              <HiOutlineChevronDown className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleRemoveNode(node.instanceId)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                              title="Desconectar bloque"
                            >
                              <HiOutlineTrash className="text-sm" />
                            </button>
                          </div>
                        </div>

                        {/* Título y Horas */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-sm text-slate-900">
                              {nodeTitle}
                            </h3>
                            {nodeDesc && (
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {nodeDesc}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1">
                            <BiTimeFive className="text-indigo-600" />
                            {formatDuration(nodeDuration)}
                          </span>
                        </div>

                        {/* Nota Pedagógica */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                            Nota pedagógica:
                          </span>
                          <input
                            type="text"
                            placeholder="Agrega una instrucción para el docente sobre este bloque..."
                            value={node.note || ""}
                            onChange={(e) =>
                              handleUpdateNote(node.instanceId, e.target.value)
                            }
                            className="w-full text-xs text-slate-700 bg-transparent focus:bg-slate-50 px-2 py-0.5 rounded outline-none border-b border-transparent focus:border-slate-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Conector entre Bloques */}
                    {index < learningPath.length - 1 &&
                      (isLego ? (
                        <div className="h-3 w-10 bg-indigo-500/20 border-x-2 border-indigo-400 flex items-center justify-center my-0.5">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center my-1">
                          <svg width="24" height="38" className="overflow-visible">
                            <line
                              x1="12"
                              y1="0"
                              x2="12"
                              y2="38"
                              stroke="#94a3b8"
                              strokeWidth="2"
                              className="animated-connection"
                            />
                          </svg>
                          <div className="absolute top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-semibold text-indigo-600 shadow-sm">
                            Siguiente paso ↓
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })
            )}
          </div>

          {/* Zona de Drop al final */}
          <div
            onClick={handleQuickAddSuggested}
            className={`w-full max-w-xl mt-3 border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all bg-white/70 backdrop-blur-sm group cursor-pointer ${
              isDropActive
                ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
                : "border-slate-300 hover:border-indigo-400"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <HiPlus className="text-base" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Suelta un bloque aquí para unirlo al final de la ruta
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              O haz clic aquí para insertar el siguiente recurso recomendado
            </p>
          </div>

          {/* Meta Final */}
          <div className="flex flex-col items-center mt-3 mb-10">
            <div className="w-0.5 h-6 bg-slate-300" />
            <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary_color_1 to-indigo-800 text-white text-xs font-bold flex items-center gap-2.5 shadow-md">
              <FaGraduationCap className="text-amber-300 text-base" /> Meta
              alcanzada: Competencia Adquirida
            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: CREAR NUEVO NODO / RECURSO */}
      {isCreateModalOpen && (
        <CreateResourceModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateNewResource}
        />
      )}

      {/* MODAL 2: CONFIRMAR Y GUARDAR VALIDACIÓN */}
      {isPublishModalOpen && (
        <PublishConfirmModal
          totalBlocks={learningPath.length}
          totalDuration={formatDuration(totalMinutos)}
          docente={docenteNombre}
          isSaving={isSaving}
          errorMessage={saveErrorMessage}
          onClose={() => setIsPublishModalOpen(false)}
          onConfirm={handleConfirmSave}
        />
      )}
    </div>
  );
};

export default RutaBuilderPage;
