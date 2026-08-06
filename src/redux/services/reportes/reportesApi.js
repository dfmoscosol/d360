import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";


export const reportesApi = createApi({
  reducerPath: "reportesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["DocentesHoras"],
  endpoints: (builder) => ({
    getDocentesHoras: builder.query({
      query: ({ busqueda, facultad, horas_min, horas_max, page = 1, per_page = 10 }) => {
        const params = new URLSearchParams();
        if (busqueda) params.append("busqueda", busqueda);
        if (facultad) params.append("facultad", facultad);
        if (horas_min !== undefined) params.append("horas_min", horas_min);
        if (horas_max !== undefined) params.append("horas_max", horas_max);
        params.append("page", page);
        params.append("per_page", per_page);

        return `/reportes/horas?${params.toString()}`;
      },
      providesTags: ["DocentesHoras"],
    }),

    getAllFacultades: builder.query({
      query: () => `/facultades`,
      providesTags: ["getAll"],
    }),

    getDocenteReport: builder.mutation({
      query: (uid_firebase) => ({
        url: "/reportes/horas/detalle",
        method: "POST",
        body: { uid_firebase },
      }),
    }),

    getDocentesHorasExcel: builder.mutation({
      query: ({ busqueda, facultad, horas_min, horas_max }) => {
        const params = new URLSearchParams();
        if (busqueda) params.append("busqueda", busqueda);
        if (facultad) params.append("facultad", facultad);
        if (horas_min !== undefined) params.append("horas_min", horas_min);
        if (horas_max !== undefined) params.append("horas_max", horas_max);

        return {
          url: `/reportes/horas/excel?${params.toString()}`, 
          method: "GET",
          // Indicamos a RTK Query que queremos manejar la respuesta como Blob
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    updateDocenteGraduado: builder.mutation({
      query: ({ uid_firebase, graduado }) => ({
        url: `/docentes/${uid_firebase}`,
        method: "PATCH",
        body: { graduado },
      }),
      invalidatesTags: ["DocentesHoras"],
    }),

    cargaMasivaGraduados: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/reportes/horas/carga-masiva",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["DocentesHoras"],
    }),
  }),
});

export const {
  useGetDocentesHorasQuery,
  useGetAllFacultadesQuery,
  useGetDocenteReportMutation,
  useGetDocentesHorasExcelMutation,
  useUpdateDocenteGraduadoMutation,
  useCargaMasivaGraduadosMutation,
} = reportesApi;
