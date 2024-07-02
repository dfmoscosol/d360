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
    getAllObservadores: builder.query({
      query: () => `/observadores`,
    }),
    agregarObservadores: builder.mutation({
      query: (params) => ({
        url: `/observadores`,
        method: "POST",
        body: params,
      }),
    }),
    editObservadores: builder.mutation({
      query: (params) => ({
        url: `/observadores/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
    }),
    deleteObservadores: builder.mutation({
      query: (params) => ({
        url: `/observadores/${params.id}`,
        method: "DELETE",
      }),
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
    getAcreditaciones: builder.query({
      query: ({ id_evento, id_taller }) => {
        const baseUrl = `/eventos/acreditaciones/${id_evento}`;
        return id_taller ? `${baseUrl}/${id_taller}` : baseUrl;
      },
      providesTags: ["getAcreditaciones"],
    }),
    updateAcreditaciones: builder.mutation({
      query: (body) => ({
        url: `/eventos/acreditaciones`,
        method: "PUT",
        body,
      }),
    }),
    uploadAcreditaciones: builder.mutation({
      query: ({ id_evento, id_taller, file }) => {
        const formData = new FormData();
        formData.append('id_evento', id_evento);
        if (id_taller) {
          formData.append('id_taller', id_taller);
        }
        formData.append('file', file);
        return {
          url: '/eventos/acreditaciones',
          method: 'POST',
          body: formData,
        };
      },
    }),
    uploadPdf: builder.mutation({
      query: ({ acreditacionId, file }) => {
        const formData = new FormData();
        formData.append('archivo_pdf', file);
        return {
          url: `eventos/acreditaciones/pdf/${acreditacionId}`,
          method: 'PATCH',
          body: formData,
        };
      },
    }),
    deletePdf: builder.mutation({
      query: (acreditacionId) => ({
        url: `eventos/acreditaciones/pdf/${acreditacionId}`,
        method: 'DELETE',
      }),
    }),
    downloadPdf: builder.query({
      query: (acreditacionId) => ({
        url: `eventos/acreditaciones/pdf/${acreditacionId}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
  }),
});

export const {
  useLazyDownloadPdfQuery,
  useDeletePdfMutation,
  useUploadPdfMutation,
  useUploadAcreditacionesMutation,
  useUpdateAcreditacionesMutation,
  useAddEventoMutation,
  useGetAllEventosQuery,
  useGetEventoQuery,
  useLazyGetAcreditacionesQuery,
  useGetAcreditacionesQuery,
  useEditEventoMutation,
  useDeleteEventoMutation,
  useInscribirDocenteMutation,
  useGetAllDocentesQuery,
  useGetAllObservadoresQuery,
  useAgregarObservadoresMutation,
  useActualizarInscripcionMutation,
  useEditObservadoresMutation,
  useDeleteObservadoresMutation,
  useEliminarInscripcionMutation,
} = eventoApi;
