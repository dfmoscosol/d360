import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const certificadoApi = createApi({
  reducerPath: "certificadoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  //tagTypes: ["Docente"],
  endpoints: (builder) => ({
    getAllCertificados: builder.query({
      query: () => `/certificados`,
      //providesTags: ["getAll"],
    }),
    /*getAllDocentes: builder.query({
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
  //useAddEventoMutation,
  //useGetAllDocentesQuery,
  //useInscribirDocenteMutation,
  //useGetCapacitacionQuery,
  //useEditCapacitacionMutation,
  //useDeleteEventoMutation,
} = certificadoApi;
