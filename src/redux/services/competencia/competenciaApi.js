import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";

export const competenciaApi = createApi({
  reducerPath: "competenciaApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Competencia"],
  endpoints: (builder) => ({
    getCompetencias: builder.query({
      query: () => `/competencias`,
      transformResponse: (response) => response.respuesta.competencias,
      providesTags: ["Competencia"],
    }),
  }),
});

export const { useGetCompetenciasQuery } = competenciaApi;
