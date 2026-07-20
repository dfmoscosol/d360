import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";


export const inscripcionApi = createApi({
  reducerPath: "inscripcionApi",
  baseQuery: baseQueryWithAuth,
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
