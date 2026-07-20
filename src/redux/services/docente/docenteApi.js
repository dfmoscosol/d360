import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";

export const docenteApi = createApi({
  reducerPath: "docenteApi",
  baseQuery: baseQueryWithAuth,
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
  }),
});

export const {
  useGetAllDocentesQuery,
  useInscribirDocenteMutation,
} = docenteApi;
