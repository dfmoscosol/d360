import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//const BASE_URL = "https://desa-k8s.ucuenca.edu.ec/ms/pentagono-d360/api/";
const BASE_URL = "https://mdlk8s.ucuenca.edu.ec/ms/pentagono-d360/api/";

export const docenteApi = createApi({
  reducerPath: "docenteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Docente"],
  endpoints: (builder) => ({
    getAllDocentes: builder.query({
      query: (params) => `/docentes_disponibles/${params.value}`,
      providesTags: (result) =>
        result
          ? [
              ...result.respuesta.map(({ id }) => ({ type: "Docente", id })),
              "Docente",
            ]
          : ["Docente"],
    }),
    inscribirDocente: builder.mutation({
      query: (body) => ({
        url: `/agregar_inscripciones`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Docente"],
    }),
    /*
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
    getAllCapacitaciones: builder.query({
      query: () => `/capacitaciones`,
      providesTags: ["getAll"],
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
  //useAddEventoMutation,
  useGetAllDocentesQuery,
  useInscribirDocenteMutation,
  //useGetCapacitacionQuery,
  //useEditEventoMutation,
  //useDeleteEventoMutation,
} = docenteApi;
