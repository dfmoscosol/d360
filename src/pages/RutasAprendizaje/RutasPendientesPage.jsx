import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetRutasPendientesQuery,
  useGetFiltrosRutasQuery,
} from "../../redux/services/rutasAprendizaje/rutasAprendizajeApi";
import { Loader } from "@components";
import Select from "react-select";
import { MdSearch, MdAltRoute, MdPendingActions } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const RutasPendientesPage = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [facultad, setFacultad] = useState({
    value: "Todas",
    label: "Todas las Facultades",
  });
  const [periodo, setPeriodo] = useState({
    value: "Todos",
    label: "Todos los Períodos",
  });
  const [page, setPage] = useState(1);

  // RTK Queries
  const { data: filtrosData } = useGetFiltrosRutasQuery();
  const { data, isLoading, isFetching } = useGetRutasPendientesQuery({
    busqueda,
    facultad: facultad.value,
    periodo: periodo.value,
    page,
    per_page: 10,
  });

  const opcionesFacultades = [
    { value: "Todas", label: "Todas las Facultades" },
    ...(filtrosData?.facultades || []).map((f) => ({ value: f, label: f })),
  ];

  const opcionesPeriodos = [
    { value: "Todos", label: "Todos los Períodos" },
    ...(filtrosData?.periodos || []).map((p) => ({
      value: p,
      label: `Período ${p}`,
    })),
  ];

  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary_gray_5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary_text_1 flex items-center gap-2">
            <MdAltRoute className="text-primary_color_1 text-3xl" />
            Validación de Rutas Docentes
          </h1>
          <p className="text-sm text-primary_gray_3 mt-1">
            Revisión y curaduría pedagógica de itinerarios formativos generados por IA (EduVoz360).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <MdPendingActions className="text-amber-600 text-base" />
            {totalItems} {totalItems === 1 ? "Ruta Pendiente" : "Rutas Pendientes"} de Validación
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-primary_gray_5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buscador Docente */}
        <div className="relative">
          <label className="text-xs font-medium text-primary_gray_4 mb-1 block">
            Buscar Docente
          </label>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_gray_2 text-lg" />
            <input
              type="text"
              placeholder="Nombre, cédula o correo..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-primary_gray_5 rounded-lg focus:ring-2 focus:ring-primary_color_1 focus:outline-none text-primary_text_1"
            />
          </div>
        </div>

        {/* Filtro Facultad */}
        <div>
          <label className="text-xs font-medium text-primary_gray_4 mb-1 block">
            Facultad
          </label>
          <Select
            options={opcionesFacultades}
            value={facultad}
            onChange={(val) => {
              setFacultad(val || { value: "Todas", label: "Todas las Facultades" });
              setPage(1);
            }}
            className="text-sm"
            isSearchable
          />
        </div>

        {/* Filtro Periodo */}
        <div>
          <label className="text-xs font-medium text-primary_gray_4 mb-1 block">
            Período Académico
          </label>
          <Select
            options={opcionesPeriodos}
            value={periodo}
            onChange={(val) => {
              setPeriodo(val || { value: "Todos", label: "Todos los Períodos" });
              setPage(1);
            }}
            className="text-sm"
            isSearchable
          />
        </div>
      </div>

      {/* Tabla de Docentes Pendientes */}
      <div className="bg-white rounded-xl border border-primary_gray_5 shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-12 flex justify-center">
            <Loader />
          </div>
        ) : !data?.respuesta || data.respuesta.length === 0 ? (
          <div className="p-12 text-center text-primary_gray_3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
              ✓
            </div>
            <p className="text-base font-semibold text-primary_text_1">¡Todo al día!</p>
            <p className="text-sm mt-1">
              No hay docentes con rutas pendientes de validación para los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-primary_text_1">
              <thead className="bg-primary_gray_1 text-xs uppercase font-semibold text-primary_gray_4 border-b border-primary_gray_5">
                <tr>
                  <th className="py-3 px-4">Docente</th>
                  <th className="py-3 px-4">Facultad</th>
                  <th className="py-3 px-4 text-center">Período</th>
                  <th className="py-3 px-4">Brechas Detectadas</th>
                  <th className="py-3 px-4 text-center">Horas Est.</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary_gray_5">
                {data.respuesta.map((row) => (
                  <tr
                    key={row.id_ruta || `${row.id_docente}-${row.periodo}`}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-primary_color_1">
                        {row.nombre_docente}
                      </div>
                      <div className="text-xs text-primary_gray_3 mt-0.5">
                        {row.id_docente} • {row.correo}
                      </div>
                    </td>
                    <td
                      className="py-3.5 px-4 text-xs text-primary_gray_4 max-w-[220px] truncate"
                      title={row.facultad}
                    >
                      {row.facultad}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-center text-slate-700">
                      {row.periodo}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {row.brechas_resumen?.slice(0, 2).map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-medium"
                          >
                            {b}
                          </span>
                        ))}
                        {(row.brechas_resumen?.length || 0) > 2 && (
                          <span className="text-[10px] text-primary_gray_3 self-center font-medium">
                            +{(row.brechas_resumen?.length || 0) - 2} más
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-xs">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        <BiTimeFive className="text-primary_color_1" />{" "}
                        {row.total_horas}h
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                        Pendiente
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() =>
                          navigate(
                            `/rutas-aprendizaje/validar/${encodeURIComponent(
                              row.id_docente
                            )}?periodo=${encodeURIComponent(row.periodo)}`
                          )
                        }
                        className="px-3.5 py-1.5 bg-primary_color_1 hover:bg-[#001D3D] text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1"
                      >
                        Validar Ruta →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-primary_gray_5 flex items-center justify-between text-xs text-primary_gray_3">
            <span>
              Mostrando página {page} de {totalPages} ({totalItems} docentes)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-primary_gray_5 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Página anterior"
              >
                <HiOutlineChevronLeft className="text-sm" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-primary_gray_5 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Página siguiente"
              >
                <HiOutlineChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RutasPendientesPage;
