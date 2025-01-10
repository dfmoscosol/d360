import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:5000/";
//const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const reportesApi = createApi({
  reducerPath: "reportesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Si necesitas autenticación, puedes recuperarla del state
      const token = getState().authState?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
  }),
});

export const { useGetDocentesHorasQuery, useGetAllFacultadesQuery,useGetDocenteReportMutation, useGetDocentesHorasExcelMutation } = reportesApi;

