import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

export const eventoApi = createApi({
  reducerPath: "eventoApi",
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
  tagTypes: ["getAll", "getEvento", "getDocetesParaInscripcion"],
  endpoints: (builder) => ({
    getAllEventos: builder.query({
      query: () => `/eventos/todos`,
      providesTags: ["getAll"],
    }),
    getEvento: builder.query({
      query: (params) => `/eventos/${params.value}`,
      providesTags: ["getEvento"],
      //invalidatesTags: ["getDocetesParaInscripcion"],
    }),
    addEvento: builder.mutation({
      query: ({ params, tipo }) => ({
        url: `/eventos/${tipo}`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["getAll"],
    }),
    editEvento: builder.mutation({
      query: (params) => ({
        url: `/eventos/${params.tipo}/${params.id}`,
        method: "PATCH",
        body: params.body,
      }),
      invalidatesTags: ["getAll"],
    }),
    deleteEvento: builder.mutation({
      query: (params) => ({
        url: `/eventos/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getAll"],
    }),
    getAllDocentes: builder.query({
      query: (params) => `/eventos/docentes/${params.value}`,
    }),

    inscribirDocente: builder.mutation({
      query: (body) => ({
        url: `/eventos/inscripcion`,
        method: "POST",
        body: body,
      }),
      //providesTags: ["getDocetesParaInscripcion"],
      //invalidatesTags: ["getEvento", "Docente"],
    }),
    actualizarInscripcion: builder.mutation({
      query: (params) => ({
        url: `/eventos/inscripcion/estado/${params.id}`,
        method: "PATCH",
        body: params.body,
      }),
    }),
    eliminarInscripcion: builder.mutation({
      query: (params) => ({
        url: `/eventos/inscripcion/${params.id}`,
        method: "DELETE",
        //body: params.body,
      }),
    }),
  }),
});

export const {
  useAddEventoMutation,
  useGetAllEventosQuery,
  useGetEventoQuery,
  useEditEventoMutation,
  useDeleteEventoMutation,
  useInscribirDocenteMutation,
  useGetAllDocentesQuery,
  useActualizarInscripcionMutation,
  useEliminarInscripcionMutation,
} = eventoApi;
