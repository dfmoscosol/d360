import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

export const certificadoApi = createApi({
  reducerPath: "certificadoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().authState.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  //tagTypes: ["Docente"],
  endpoints: (builder) => ({
    getAllCertificados: builder.query({
      query: () => `/certificados`,
      //providesTags: ["getAll"],
    }),
    editCertificado: builder.mutation({
      query: (params) => ({
        url: `/actualizar_certificado/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
      //invalidatesTags: ["getCapacitacion", "getAll"],
    }),
    /*descargarCertificado: builder.mutation({
      query: (params) => ({
        url: `/descargar_certificado/${params.idCertificado}`,
        method: "GET",
        responseHandler: (response) => response.blob(), // Maneja la respuesta como un blob
      }),
    }),
    getAllDocentes: builder.query({
      query: (params) => `/docentes_disponibles/${params.value}`,
    }),
    inscribirDocente: builder.mutation({
      query: (body) => ({
        url: `/agregar_inscripciones`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Docente"],
    }),
    
    addEvento: builder.mutation({
      query: (params) => ({
        url: `/crear_capacitacion`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["getAll"],
    }),
    editCapacitacion: builder.mutation({
      query: (params) => ({
        url: `/actualizar_capacitacion/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
      //invalidatesTags: ["getCapacitacion", "getAll"],
    }),

    deleteEvento: builder.mutation({
      query: (params) => ({
        url: `/eliminar_capacitacion/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getAll"],
    }),
    */
  }),
});

export const {
  useGetAllCertificadosQuery,
  useEditCertificadoMutation,
  //useAddEventoMutation,
  //useGetAllDocentesQuery,
  //useInscribirDocenteMutation,
  //useGetCapacitacionQuery,
  //useEditEventoMutation,
  //useDeleteEventoMutation,
} = certificadoApi;
