import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";

export const rutasAprendizajeApi = createApi({
  reducerPath: "rutasAprendizajeApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["RutasPendientes", "RutaDocente"],
  endpoints: (builder) => ({
    // Obtener lista de rutas (todas, pendientes o validadas)
    getRutasPendientes: builder.query({
      query: ({ busqueda, facultad, periodo, estado, page = 1, per_page = 10 } = {}) => {
        const params = new URLSearchParams();
        if (busqueda && busqueda.trim()) {
          params.append("busqueda", busqueda.trim());
        }
        if (facultad && facultad !== "Todas" && facultad !== "Todas las Facultades") {
          params.append("facultad", facultad.trim());
        }
        if (periodo && periodo !== "Todos" && periodo !== "Todos los Períodos") {
          params.append("periodo", periodo.trim());
        }
        if (estado) {
          params.append("estado", estado.trim().toLowerCase());
        }
        params.append("page", page);
        params.append("per_page", per_page);
        return `/rutas-aprendizaje/pendientes?${params.toString()}`;
      },
      providesTags: ["RutasPendientes"],
    }),

    // Obtener filtros disponibles (periodos y facultades)
    getFiltrosRutas: builder.query({
      query: () => `/rutas-aprendizaje/filtros`,
    }),

    // Obtener detalle completo de la ruta para el constructor
    getRutaDocente: builder.query({
      query: ({ idDocente, periodo }) => {
        const cleanId = encodeURIComponent(String(idDocente || "").trim());
        const p = periodo ? `?periodo=${encodeURIComponent(String(periodo).trim())}` : "";
        return `/rutas-aprendizaje/docente/${cleanId}${p}`;
      },
      providesTags: (result, error, { idDocente }) => [
        { type: "RutaDocente", id: idDocente },
      ],
    }),

    // Guardar la validación y curaduría sin duplicados
    guardarValidacionRuta: builder.mutation({
      query: ({ idDocente, payload }) => ({
        url: `/rutas-aprendizaje/docente/${encodeURIComponent(String(idDocente || "").trim())}/guardar`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["RutasPendientes", "RutaDocente"],
    }),
  }),
});

export const {
  useGetRutasPendientesQuery,
  useGetFiltrosRutasQuery,
  useGetRutaDocenteQuery,
  useGuardarValidacionRutaMutation,
} = rutasAprendizajeApi;
