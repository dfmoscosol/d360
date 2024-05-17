import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

export const inscripcionApi = createApi({
  reducerPath: "inscripcionApi",
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
  endpoints: (builder) => ({
    descargarInscritos: builder.mutation({
      query: (idEvento, idTaller) => {
        // Construir la URL condicionalmente
        const url = idTaller
          ? `/eventos/${idEvento}/inscritos/${idTaller}`
          : `/eventos/${idEvento}/inscritos`;

        return {
          url: url,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),
    agregarInscripciones: builder.mutation({
      query: (body) => ({
        url: `/agregar_inscripciones`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useDescargarInscritosMutation,
  useAgregarInscripcionesMutation,
} = inscripcionApi;
