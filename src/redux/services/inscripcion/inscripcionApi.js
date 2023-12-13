import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const inscripcionApi = createApi({
  reducerPath: "inscripcionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    agregarInscripciones: builder.mutation({
      query: (body) => ({
        url: `/agregar_inscripciones`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const { useAgregarInscripcionesMutation } = inscripcionApi;
