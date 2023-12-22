import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const eventoApi = createApi({
  reducerPath: "eventoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().authState.token;
      console.log("token eventoApi", token);
      if (token) {
        console.log("token eventoApi", token);
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.log("no token eventoApi");
      }
      return headers;
    },
  }),
  tagTypes: ["getAll", "getCapacitacion", "getDocetesParaInscripcion"],
  endpoints: (builder) => ({
    getCapacitacion: builder.query({
      query: (params) => `/capacitacion/${params.value}`,
      providesTags: ["getCapacitacion"],
      //invalidatesTags: ["getDocetesParaInscripcion"],
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
      invalidatesTags: ["getAll"],
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

    getAllDocentes: builder.query({
      query: (params) => `/docentes_disponibles/${params.value}`,
    }),

    inscribirDocente: builder.mutation({
      query: (body) => ({
        url: `/agregar_inscripciones`,
        method: "POST",
        body: body,
      }),
      //providesTags: ["getDocetesParaInscripcion"],
      //invalidatesTags: ["getCapacitacion", "Docente"],
    }),
    actualizarInscripcion: builder.mutation({
      query: (params) => ({
        url: `/actualizar_inscripcion/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
    }),
    eliminarInscripcion: builder.mutation({
      query: (params) => ({
        url: `/eliminar_inscripcion/${params.id}`,
        method: "DELETE",
        //body: params.body,
      }),
    }),
  }),
});

export const {
  useAddEventoMutation,
  useGetAllCapacitacionesQuery,
  useGetCapacitacionQuery,
  useEditCapacitacionMutation,
  useDeleteEventoMutation,
  useInscribirDocenteMutation,
  useGetAllDocentesQuery,
  useActualizarInscripcionMutation,
  useEliminarInscripcionMutation,
} = eventoApi;
